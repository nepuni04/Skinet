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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public ProductsController(IUnitOfWork unitOfWork,
            IPhotoService photoService,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _mapper = mapper;
        }

        [ProducesResponseType(typeof(ProductToReturnDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductWithTypeAndBrandSpecification(id);
            
            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpecAsync(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }


        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
           [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductWithTypeAndBrandSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            int totalItems = await _unitOfWork.Repository<Product>().CountSpecAsync(countSpec);

            var products = await _unitOfWork.Repository<Product>().ListWithSpecAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Product>,
                IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>()
            {
                PageIndex = productParams.PageIndex,
                PageSize = productParams.PageSize,
                Count = totalItems,
                Data = data
            });

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

        /*******************************************************************************************************
                                            ADMIN PORTION STARTS HERE
        *******************************************************************************************************/


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductToReturnDto>> CreateProduct(ProductCreateDto productToCreate)
        {
            var product = _mapper.Map<ProductCreateDto, Product>(productToCreate);

            _unitOfWork.Repository<Product>().Add(product);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Creating Product"));

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> UpdateProduct(int id, ProductCreateDto productToUpdate)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null) return NotFound(new ApiResponse(404));

            _mapper.Map(productToUpdate, product);
            _unitOfWork.Repository<Product>().Update(product);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Updating Product"));

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null) return NotFound(new ApiResponse(404));

            foreach (var photo in product.Photos)
            {
                // check that any original images that are used for seeded products are not deleted.
                if (photo.Id > 18)
                {
                    _photoService.DeleFromDisk(photo);
                }
            }

            _unitOfWork.Repository<Product>().Delete(product);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Deleting Product")); 

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/photo")]
        public async Task<ActionResult<ProductToReturnDto>> AddProductPhoto(int id, [FromForm] ProductPhotoDto photoDto)
        {
            var spec = new ProductWithTypeAndBrandSpecification(id);
            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpecAsync(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            if(photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo);

                if (photo == null) return BadRequest(new ApiResponse(400, "Problem saving to disk"));

                product.AddPhoto(photo.PictureUrl, photo.FileName);

                _unitOfWork.Repository<Product>().Update(product);
                var result = await _unitOfWork.CompleteAsync();

                if (result <= 0) return BadRequest(new ApiResponse(400, "Problem adding photo product"));
            }

            return _mapper.Map<Product, ProductToReturnDto>(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}/photo/{photoId}")]
        public async Task<ActionResult> DeleteProductPhoto(int id, int photoId)
        {
            var spec = new ProductWithPhotoSpecification(id);
            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpecAsync(spec);

            if (product == null) return NotFound(new ApiResponse(404, "Product does not exists"));

            var photo = product.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound(new ApiResponse(404, "Photo does not exists"));

            if (photo.IsMain) return BadRequest(new ApiResponse(400, "You cannot delete the main photo"));

            // Remove product photo from disk
            _photoService.DeleFromDisk(photo);

            // Remove photo details from database
            product.RemovePhoto(photo.Id);
            _unitOfWork.Repository<Product>().Update(product);
            var result = await _unitOfWork.CompleteAsync();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem removing the photo"));

            return Ok();
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/photo/{photoId}")]
        public async Task<ActionResult<ProductToReturnDto>> SetMainPhoto(int id, int photoId)
        {
            var spec = new ProductWithTypeAndBrandSpecification(id);
            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpecAsync(spec);

            if (product == null) return NotFound(new ApiResponse(404, "Product does not exists"));

            var photo = product.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound(new ApiResponse(404, "Photo does not exists"));

            product.SetMainPhoto(photo.Id);

            _unitOfWork.Repository<Product>().Update(product);

            var result = await _unitOfWork.CompleteAsync();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem setting product main photo"));

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }
    }
}
