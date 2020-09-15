using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Core.Specifications
{
    public class ProductWithPhotoSpecification : BaseSpecification<Product>
    {
        public ProductWithPhotoSpecification(int id) : base(p => p.Id == id)
        {
            AddInclude(p => p.Photos);
        }
    }
}
