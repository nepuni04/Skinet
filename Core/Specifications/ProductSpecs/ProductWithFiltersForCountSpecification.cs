using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams param)
            : base(x => 
                (!param.BrandId.HasValue || x.ProductBrandId == param.BrandId) &&
                (!param.TypeId.HasValue || x.ProductTypeId == param.TypeId) &&
                (string.IsNullOrEmpty(param.Search) || x.Name.ToLower().Contains(param.Search))
            )
        {
        }
    }
}
