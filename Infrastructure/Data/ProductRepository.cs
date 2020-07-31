using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        Task<Product> IProductRepository.GetProductByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        Task<IReadOnlyList<Product>> IProductRepository.GetProductsAsync()
        {
            throw new NotImplementedException();
        }
    }
}
