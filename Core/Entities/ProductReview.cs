namespace Core.Entities
{
    public class ProductReview : BaseEntity
    {
        public string DisplayName { get; set; }
        public string UserEmail { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
