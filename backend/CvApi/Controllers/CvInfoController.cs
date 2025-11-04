using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CvApi.Data;
using CvApi.Models;

namespace CvApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CvInfoController : ControllerBase
{
    private readonly CvDbContext _context;

    public CvInfoController(CvDbContext context)
    {
        _context = context;
    }

    // GET: api/CvInfo
    [HttpGet]
    public async Task<ActionResult<CvInfo>> GetCvInfo()
    {
        var cvInfo = await _context.CvInfos.FirstOrDefaultAsync();

        if (cvInfo == null)
        {
            return NotFound();
        }

        return cvInfo;
    }

    // POST: api/CvInfo
    [HttpPost]
    public async Task<ActionResult<CvInfo>> PostCvInfo(CvInfo cvInfo)
    {
        cvInfo.CreatedAt = DateTime.UtcNow;
        _context.CvInfos.Add(cvInfo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCvInfo), cvInfo);
    }

    // PUT: api/CvInfo/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCvInfo(int id, CvInfo cvInfo)
    {
        if (id != cvInfo.Id)
        {
            return BadRequest();
        }

        cvInfo.UpdatedAt = DateTime.UtcNow;
        _context.Entry(cvInfo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CvInfoExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    private bool CvInfoExists(int id)
    {
        return _context.CvInfos.Any(e => e.Id == id);
    }
}

