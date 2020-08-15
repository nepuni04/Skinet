using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithTypeAndBrandSpecification : BaseSpecification<Product>
    {
        public ProductWithTypeAndBrandSpecification(ProductSpecParams param)
            : base(x =>
                  (!param.BrandId.HasValue || x.ProductBrandId == param.BrandId) &&
                  (!param.TypeId.HasValue || x.ProductTypeId == param.TypeId) &&
                  (string.IsNullOrEmpty(param.Search) || x.Name.ToLower().Contains(param.Search))
              )
        {
            AddInclude(x => x.ProductBrand);
            AddInclude(x => x.ProductType);
            AddOrderBy(x => x.Name);
            AddPaging(param.PageSize * (param.PageIndex - 1), param.PageSize);

            if (!string.IsNullOrEmpty(param.Sort))
            {
                switch (param.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(x => x.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDesc(x => x.Price);
                        break;
                    default:
                        AddOrderBy(x => x.Name);
                        break;
                }
            }
        }

        public ProductWithTypeAndBrandSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductBrand);
            AddInclude(x => x.ProductType);
        }
    }
}
