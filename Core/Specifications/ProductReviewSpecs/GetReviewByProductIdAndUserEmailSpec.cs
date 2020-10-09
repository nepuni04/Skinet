using Core.Entities;

namespace Core.Specifications.ProductReviewSpecs
{
    public class GetReviewByProductIdAndUserEmailSpec : BaseSpecification<ProductReview>
    {
        public GetReviewByProductIdAndUserEmailSpec(int productId, string email) 
            : base(x => x.ProductId == productId && x.UserEmail == email)
        {
        }
    }
}
