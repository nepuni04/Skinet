using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities.ProductAggregate
{
    public class ProductReview : BaseEntity
    {
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
