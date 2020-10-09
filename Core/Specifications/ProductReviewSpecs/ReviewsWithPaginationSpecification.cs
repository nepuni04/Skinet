using Core.Entities;

namespace Core.Specifications.ProductReviewSpecs
{
    public class ReviewsWithPaginationSpecification : BaseSpecification<ProductReview>
    {
        public ReviewsWithPaginationSpecification(ReviewSpecParams param) : base()
        {
            AddPaging(param.PageSize * (param.PageIndex - 1), param.PageSize);
        }
    }
}
