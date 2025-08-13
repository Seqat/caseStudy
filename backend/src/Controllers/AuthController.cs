using Microsoft.AspNetCore.Mvc;
using CaseStudy.Api.Data;
using CaseStudy.Api.Models;

namespace CaseStudy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = dto.Password // No hashing yet
            };
            _db.Users.Add(user);
            _db.SaveChanges();
            return Ok(new { message = "User registered" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthDto dto)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email && u.PasswordHash == dto.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });
            return Ok(new { message = "Login successful" });
        }



        // Other CRUD operations
        // TODO - Implement proper validation and password hashing for security
        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _db.Users.ToList();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public IActionResult GetUser(int id)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("users/{id}")]
        public IActionResult UpdateUser(int id, [FromBody] AuthDto dto)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            user.Email = dto.Email;
            user.PasswordHash = dto.Password;
            _db.SaveChanges();
            return Ok(user);
        }

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            _db.Users.Remove(user);
            _db.SaveChanges();
            return Ok(new { message = "User deleted" });
        }
    }
}
