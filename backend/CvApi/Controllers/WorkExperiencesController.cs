using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CvApi.Data;
using CvApi.Models;

namespace CvApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkExperiencesController : ControllerBase
{
    private readonly CvDbContext _context;

    public WorkExperiencesController(CvDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkExperience>>> GetWorkExperiences()
    {
        return await _context.WorkExperiences
            .OrderBy(w => w.DisplayOrder)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkExperience>> GetWorkExperience(int id)
    {
        var workExperience = await _context.WorkExperiences.FindAsync(id);
        if (workExperience == null)
        {
            return NotFound();
        }
        return workExperience;
    }

    [HttpPost]
    public async Task<ActionResult<WorkExperience>> PostWorkExperience(WorkExperience workExperience)
    {
        workExperience.CreatedAt = DateTime.UtcNow;
        _context.WorkExperiences.Add(workExperience);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWorkExperience), new { id = workExperience.Id }, workExperience);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutWorkExperience(int id, WorkExperience workExperience)
    {
        if (id != workExperience.Id)
        {
            return BadRequest();
        }

        _context.Entry(workExperience).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkExperience(int id)
    {
        var workExperience = await _context.WorkExperiences.FindAsync(id);
        if (workExperience == null)
        {
            return NotFound();
        }

        _context.WorkExperiences.Remove(workExperience);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

