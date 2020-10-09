using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Dtos.ProductDtos;
using Api.Errors;
using Api.Extensions;
using Api.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Core.Specifications.ProductReviewSpecs;
using Microsoft.AspNetCore.Authorization;
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
        public async Task<ActionResult<IReadOnlyList<ReviewToReturnDto>>> GetReviewsAsync([FromQuery] ReviewSpecParams reviewParams)
        {
            var spec = new ReviewsWithPaginationSpecification(reviewParams);

            var totalItem = await _unitOfWork.Repository<ProductReview>().CountAsync();
            var reviews = await _unitOfWork.Repository<ProductReview>().ListWithSpecAsync(spec);
            var data = _mapper.Map<IReadOnlyList<ReviewToReturnDto>>(reviews);

            return Ok(new Pagination<ReviewToReturnDto>() {
                PageIndex = reviewParams.PageIndex,
                PageSize = reviewParams.PageSize,
                Count = totalItem,
                Data = data
            });
        }

        [Authorize]
        [HttpGet("currentuser")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ReviewToReturnDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReviewToReturnDto>> GetReviewForUser(int productId)
        {
            var email = HttpContext.User.GetEmailFromClaimsPrincipal();
            var spec = new GetReviewByIdAndUserEmailSpec(productId, email);

            var review = await _unitOfWork.Repository<ProductReview>().GetEntityWithSpecAsync(spec);

            return _mapper.Map<ReviewToReturnDto>(review);
        }

        [Authorize]
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ReviewToReturnDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReviewToReturnDto>> CreateReviewAsync(int productId, [FromBody] ReviewCreateDto reviewCreateDto)
        {
            // Check if product exists
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(productId);
            if (product == null) return NotFound(new ApiResponse(404, "Product Not Found"));

            var email = HttpContext.User.GetEmailFromClaimsPrincipal();
            var displayName = HttpContext.User.GetUserNameFromClaimsPrincipal();
            
            // Check if review by current user exists
            var spec = new GetReviewByProductIdAndUserEmailSpec(productId, email);
            var existReview = _unitOfWork.Repository<ProductReview>().GetEntityWithSpecAsync(spec);

            if (existReview != null) return BadRequest(new ApiResponse(400, "User review already exists"));

            // Map ReviewCreateDto to ProductReview
            var review = _mapper.Map<ProductReview>(reviewCreateDto);
            review.UserEmail = email;
            review.DisplayName = displayName;
            review.ProductId = productId;

            // Save review to database
            _unitOfWork.Repository<ProductReview>().Add(review);
            var result = await _unitOfWork.CompleteAsync();

            if (result < 1) return BadRequest(new ApiResponse(400, "Problem creating product"));

            return Ok(_mapper.Map<ProductReview, ReviewToReturnDto>(review));
        }

        [Authorize]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ReviewToReturnDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReviewToReturnDto>> UpdateReviewAsync(int id, int productId, [FromBody] ReviewCreateDto reviewUpdateDto)
        {
            // Check if product exists
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(productId);
            if (product == null) return NotFound(new ApiResponse(404, "Product Not Found"));

            var email = HttpContext.User.GetEmailFromClaimsPrincipal();

            // Check if user review exists
            var spec = new GetReviewByIdAndUserEmailSpec(id, email);
            var review = await _unitOfWork.Repository<ProductReview>().GetEntityWithSpecAsync(spec);

            if (review == null) return BadRequest(new ApiResponse(400, "You cannot edit this product"));

            // Map review Dto to Entity and update it
            _mapper.Map(reviewUpdateDto, review);

            _unitOfWork.Repository<ProductReview>().Update(review);
            var result = await _unitOfWork.CompleteAsync();

            if (result < 1) return BadRequest(new ApiResponse(400, "Problem Updating Product"));

            return Ok(_mapper.Map<ProductReview, ReviewToReturnDto>(review));
        }

        [Authorize]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> DeleteReviewAsync(int id)
        {
            // Check if review exists
            var email = HttpContext.User.GetEmailFromClaimsPrincipal();
            var spec = new GetReviewByIdAndUserEmailSpec(id, email);
            var review = await _unitOfWork.Repository<ProductReview>().GetEntityWithSpecAsync(spec);

            if (review == null) return NotFound(new ApiResponse(404));

            // Delete review
            _unitOfWork.Repository<ProductReview>().Delete(review);
            var result = await _unitOfWork.CompleteAsync();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Deleting Review"));

            return Ok();
        }
    }
}
