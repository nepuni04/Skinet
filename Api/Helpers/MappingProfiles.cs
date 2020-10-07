using Api.Dtos;
using Api.Dtos.ProductDtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregrate;
using Core.Entities.ProductAggregate;

namespace Api.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Product mappings
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(dto => dto.ProductBrand, p => p.MapFrom(s => s.ProductBrand.Name))
                .ForMember(dto => dto.ProductType, p => p.MapFrom(s => s.ProductType.Name))
                .ForMember(dto => dto.PictureUrl, p => p.MapFrom<ProductUrlResolver>());

            CreateMap<Photo, PhotoToReturnDto>()
                .ForMember(dto => dto.PictureUrl, p => p.MapFrom<PhotoUrlResolver>());

            CreateMap<ProductCreateDto, Product>();

            // User address mapping
            CreateMap<Address, AddressDto>().ReverseMap();

            // Basket mappings
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();


            // Order mappings
            CreateMap<AddressDto, ShipToAddress>().ReverseMap();

            CreateMap<Order, OrderToReturnDto>()
                .ForMember(dto => dto.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price))
                .ForMember(dto => dto.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.Description));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dto => dto.ProductId, oi => oi.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(dto => dto.ProductName, oi => oi.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(dto => dto.PictureUrl, oi => oi.MapFrom<OrderUrlResolver>());

            // Product reviews and ratings mappings
            CreateMap<ProductReview, ReviewToReturnDto>();
            CreateMap<ReviewCreateDto, ProductReview>();
        }
    }
}
