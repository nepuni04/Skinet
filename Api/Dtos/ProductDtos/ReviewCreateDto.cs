using System;
using System.ComponentModel.DataAnnotations;

namespace Api.Dtos.ProductDtos
{
    public class ReviewCreateDto
    {
        [Required]
        [Range(1, 5, ErrorMessage = "Value must be between 1 and 5.")]
        public int Rating { get; set; }
        
        [Required]
        public string Comment { get; set; }
    }
}
