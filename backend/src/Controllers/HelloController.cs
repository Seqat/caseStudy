using Microsoft.AspNetCore.Mvc;

// Test controller to verify API is working
namespace CaseStudy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Hello, API is working!" });
        }
    }
}
