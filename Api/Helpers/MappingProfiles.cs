using Api.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregrate;

namespace Api.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDTO>()
                .ForMember(i => i.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
                .ForMember(i => i.ProductType, o => o.MapFrom(s => s.ProductType.Name))
                .ForMember(i => i.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Address, AddressDto>().ReverseMap();

            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();

            CreateMap<AddressDto, ShipToAddress>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(o => o.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price))
                .ForMember(o => o.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.Description));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(o => o.ProductId, i => i.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(o => o.ProductName, i => i.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(o => o.PictureUrl, i => i.MapFrom(s => s.ItemOrdered.PictureUrl));
        }
    }
}
