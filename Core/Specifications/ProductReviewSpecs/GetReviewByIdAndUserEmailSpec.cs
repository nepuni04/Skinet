using Core.Entities;

namespace Core.Specifications
{
    public class GetReviewByIdAndUserEmailSpec : BaseSpecification<ProductReview>
    {
        public GetReviewByIdAndUserEmailSpec(int id, string email) : 
            base(x => x.Id == id && x.UserEmail == email)
        {
        }
    }
}
