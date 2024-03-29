﻿using Core.Entities;
using Core.Entities.OrderAggregrate;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepo;
        private readonly IPaymentService _paymentService;

        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo, IPaymentService paymentService)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
            _paymentService = paymentService;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, ShipToAddress shippingAddress)
        {
            // get basket from repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // if basket does not exist
            if (basket == null) return null;

            // Get items from the product repo
            var orderItems = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productSpec = new ProductWithPhotoSpecification(item.Id);
                var product = await _unitOfWork.Repository<Product>().GetEntityWithSpecAsync(productSpec);
                var itemOrdered = new ProductItemOrdered(
                    product.Id,
                    product.Name,
                    product.Photos.FirstOrDefault(p => p.IsMain)?.PictureUrl);

                var orderItem = new OrderItem(itemOrdered, product.Price, item.Quantity);
                orderItems.Add(orderItem);
            }

            // Get delivery method from repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // Calculate subtotal
            var subtotal = orderItems.Sum(item => item.Quantity * item.Price);

            var orderSpec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpecAsync(orderSpec);

            if(existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                await _paymentService.CreateorUpdatePaymentIntent(basket.Id);
            }

            // Create order
            var order = new Order(orderItems, buyerEmail, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);
            _unitOfWork.Repository<Order>().Add(order);

            // Save order to Db
            var result = await _unitOfWork.CompleteAsync();

            if (result <= 0) return null;

            // Delete basket from database
            //await _basketRepo.DeleteBasketAsync(basketId);

            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpecAsync(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListWithSpecAsync(spec);
        }
    }
}
