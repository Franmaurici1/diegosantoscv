using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CvApi.Data;
using CvApi.Models;

namespace CvApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationsController : ControllerBase
{
    private readonly CvDbContext _context;

    public EducationsController(CvDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Education>>> GetEducations()
    {
        return await _context.Educations
            .OrderBy(e => e.DisplayOrder)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Education>> PostEducation(Education education)
    {
        education.CreatedAt = DateTime.UtcNow;
        _context.Educations.Add(education);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEducations), new { id = education.Id }, education);
    }
}

