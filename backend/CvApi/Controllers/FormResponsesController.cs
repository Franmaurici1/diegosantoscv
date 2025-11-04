using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CvApi.Data;
using CvApi.Models;

namespace CvApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormResponsesController : ControllerBase
{
    private readonly CvDbContext _context;

    public FormResponsesController(CvDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormResponse>>> GetFormResponses()
    {
        return await _context.FormResponses
            .Include(fr => fr.DocumentRequest)
            .Include(fr => fr.RequestTopic)
            .OrderByDescending(fr => fr.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormResponse>> GetFormResponse(int id)
    {
        var formResponse = await _context.FormResponses
            .Include(fr => fr.DocumentRequest)
            .Include(fr => fr.RequestTopic)
            .FirstOrDefaultAsync(fr => fr.Id == id);

        if (formResponse == null)
        {
            return NotFound();
        }

        return formResponse;
    }

    [HttpGet("request/{requestId}")]
    public async Task<ActionResult<IEnumerable<FormResponse>>> GetFormResponsesByRequest(int requestId)
    {
        return await _context.FormResponses
            .Include(fr => fr.RequestTopic)
            .Where(fr => fr.DocumentRequestId == requestId)
            .OrderBy(fr => fr.RequestTopic.CategoryName)
            .ThenBy(fr => fr.RequestTopic.TopicName)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<FormResponse>> PostFormResponse(FormResponse formResponse)
    {
        formResponse.CreatedAt = DateTime.UtcNow;
        _context.FormResponses.Add(formResponse);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFormResponse), new { id = formResponse.Id }, formResponse);
    }

    [HttpPost("batch")]
    public async Task<ActionResult<IEnumerable<FormResponse>>> PostFormResponsesBatch(List<FormResponse> formResponses)
    {
        foreach (var response in formResponses)
        {
            response.CreatedAt = DateTime.UtcNow;
        }

        _context.FormResponses.AddRange(formResponses);
        await _context.SaveChangesAsync();

        return Ok(formResponses);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutFormResponse(int id, FormResponse formResponse)
    {
        if (id != formResponse.Id)
        {
            return BadRequest();
        }

        formResponse.UpdatedAt = DateTime.UtcNow;
        _context.Entry(formResponse).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FormResponseExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFormResponse(int id)
    {
        var formResponse = await _context.FormResponses.FindAsync(id);
        if (formResponse == null)
        {
            return NotFound();
        }

        _context.FormResponses.Remove(formResponse);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FormResponseExists(int id)
    {
        return _context.FormResponses.Any(e => e.Id == id);
    }
}
