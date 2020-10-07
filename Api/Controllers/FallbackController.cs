using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html");
            return PhysicalFile(path, "text/HTML");
        }
    }
}
