using Microsoft.AspNetCore.Http;

namespace Api.Dtos
{
    public class ProductPhotoDto
    {
        public IFormFile Photo { get; set; }
    }
}
