using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Dtos;
using Api.Errors;
using Api.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductsController(IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [HttpGet("{id}")]
        public async Task<ActionResult<List<ProductToReturnDTO>>> GetProduct(int id)
        {
            var spec = new ProductWithTypeAndBrandSpecification(id);
            
            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpecAsync(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Product, ProductToReturnDTO>(product));
        }


        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDTO>>> GetProducts(
           [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductWithTypeAndBrandSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            int totalItems = await _unitOfWork.Repository<Product>().CountAsync(countSpec);

            var products = await _unitOfWork.Repository<Product>().ListWithSpecAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Product>,
                IReadOnlyList<ProductToReturnDTO>>(products);

            return Ok(new Pagination<ProductToReturnDTO>()
            {
                PageIndex = productParams.PageIndex,
                PageSize = productParams.PageSize,
                Count = totalItems,
                Data = data
            });

        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(ProductCreateDto productToCreate)
        {
            var product = _mapper.Map<ProductCreateDto, Product>(productToCreate);
            product.PictureUrl = "images/products/placeholder.png";

            _unitOfWork.Repository<Product>().Add(product);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Creating Product"));

            return Ok(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, ProductCreateDto productToUpdate)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null) return NotFound(new ApiResponse(404));

            _mapper.Map(productToUpdate, product);
            _unitOfWork.Repository<Product>().Update(product);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Updating Product"));

            return Ok(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null) return NotFound(new ApiResponse(404));

            _unitOfWork.Repository<Product>().Delete(product);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Deleting Product")); 

            return Ok();
        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            var productBrands = await _unitOfWork.Repository<ProductBrand>().ListAllAsync();
            return Ok(productBrands);
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var productTypes = await _unitOfWork.Repository<ProductType>().ListAllAsync();
            return Ok(productTypes);
        }
    }
}
