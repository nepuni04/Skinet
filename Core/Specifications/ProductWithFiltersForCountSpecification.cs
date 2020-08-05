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
                (!param.brandId.HasValue || x.ProductBrandId == param.brandId) &&
                (!param.typeId.HasValue || x.ProductTypeId == param.typeId) &&
                (string.IsNullOrEmpty(param.Search) || x.Name.ToLower().Contains(param.Search))
            )
        {
        }
    }
}
