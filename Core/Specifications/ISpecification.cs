using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Core.Specifications
{
    public interface ISpecification<T> where T : BaseEntity
    {
        Expression<Func<T, bool>> Criteria { get;  }
        List<Expression<Func<T, object>>> Includes { get; } 
    }
}
