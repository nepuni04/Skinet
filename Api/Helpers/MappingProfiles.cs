using Api.Dtos;
using AutoMapper;
using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        }
    }
}
