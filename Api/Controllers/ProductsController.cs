﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Errors;
using Api.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productsRepo,
            IGenericRepository<ProductBrand> productBrandRepo,
            IGenericRepository<ProductType> productTypeRepo,
            IMapper mapper)
        {
            _productsRepo = productsRepo;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<ProductToReturnDTO>>> GetProduct(int id)
        {
            var spec = new ProductWithTypeAndBrandSpecification(id);
            
            var product = await _productsRepo.GetEntityWithSpecAsync(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Product, ProductToReturnDTO>(product));
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDTO>>> GetProducts(
           [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductWithTypeAndBrandSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            int totalItems = await _productsRepo.CountAsync(countSpec);

            var products = await _productsRepo.ListWithSpecAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Product>,
                IReadOnlyList<ProductToReturnDTO>>(products);

            return Ok(new Pagination<ProductToReturnDTO>() { 
                PageIndex = productParams.PageIndex,
                PageSize = productParams.PageSize,
                Count = totalItems,
                Data = data
            });

        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var productBrands = await _productBrandRepo.ListAllAsync();
            return Ok(productBrands);
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var productTypes = await _productTypeRepo.ListAllAsync();
            return Ok(productTypes);
        }
    }
}
