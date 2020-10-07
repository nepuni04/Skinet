using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Dtos.ProductDtos;
using Api.Errors;
using AutoMapper;
using Core.Entities;
using Core.Entities.ProductAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/products/{productId}/[controller]")]
    public class ReviewsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReviewsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ReviewToReturnDto>>> GetReviewsAsync()
        {
            var reviews = await _unitOfWork.Repository<ProductReview>().ListAllAsync();

            return Ok(_mapper.Map<IReadOnlyList<ReviewToReturnDto>>(reviews));
        }


        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ReviewToReturnDto), StatusCodes.Status200OK)]
        [HttpPost]
        public async Task<ActionResult<ReviewToReturnDto>> CreateReviewAsync(int productId, [FromBody] ReviewCreateDto reviewCreateDto)
        {
            if (productId != reviewCreateDto.ProductId) return BadRequest(400);

            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(productId);

            if (product == null) return NotFound(new ApiResponse(404, "Product Not Found"));

            var review = _mapper.Map<ProductReview>(reviewCreateDto);
            _unitOfWork.Repository<ProductReview>().Add(review);

            var result = await _unitOfWork.CompleteAsync();

            if (result < 1) return BadRequest(new ApiResponse(400));

            return Ok(_mapper.Map<ProductReview, ReviewToReturnDto>(review));
        }


        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ReviewToReturnDto), StatusCodes.Status200OK)]
        [HttpPut("{id}")]
        public async Task<ActionResult<ReviewToReturnDto>> UpdateReviewAsync(int id, int productId, [FromBody] ReviewCreateDto reviewUpdateDto)
        {
            if (productId != reviewUpdateDto.ProductId) return BadRequest(400);

            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(productId);
            if (product == null) return NotFound(new ApiResponse(404, "Product Not Found"));

            var review = await _unitOfWork.Repository<ProductReview>().GetByIdAsync(id);
            if (review == null) return NotFound(new ApiResponse(404));

            _mapper.Map(reviewUpdateDto, review);
            _unitOfWork.Repository<ProductReview>().Update(review);

            var result = await _unitOfWork.CompleteAsync();
            if (result < 1) return BadRequest(new ApiResponse(400, "Problem Updating Product"));

            return Ok(_mapper.Map<ProductReview, ReviewToReturnDto>(review));
        }

        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReviewAsync(int id)
        {
            var review = await _unitOfWork.Repository<ProductReview>().GetByIdAsync(id);
            if (review == null) return NotFound(new ApiResponse(404));

            _unitOfWork.Repository<ProductReview>().Delete(review);

            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Deleting Review"));

            return Ok();
        }
    }
}
