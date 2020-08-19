using Core.Entities;
using Core.Entities.OrderAggregrate;
using Core.Interfaces;
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

        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, ShipToAddress shippingAddress)
        {
            // get basket from repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // Get items from the product repo
            var orderItems = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(product.Id, product.Name, product.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, product.Price, item.Quantity);
                orderItems.Add(orderItem);
            }

            // Get delivery method from repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // Calculate subtotal
            var subtotal = orderItems.Sum(item => item.Quantity * item.Price);

            // Create order
            var order = new Order(orderItems, buyerEmail, shippingAddress, deliveryMethod, subtotal);
            
            // Save order to Db

            return order;
        }

        public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrderByIdAsync(int id, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}
