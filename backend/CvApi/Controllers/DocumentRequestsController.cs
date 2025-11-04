using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CvApi.Data;
using CvApi.Models;

namespace CvApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentRequestsController : ControllerBase
{
    private readonly CvDbContext _context;

    public DocumentRequestsController(CvDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentRequest>>> GetDocumentRequests()
    {
        return await _context.DocumentRequests
            .Include(dr => dr.Topics)
                .ThenInclude(t => t.Fields)
            .Include(dr => dr.Project)
            .OrderByDescending(dr => dr.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DocumentRequest>> GetDocumentRequest(int id)
    {
        var documentRequest = await _context.DocumentRequests
            .Include(dr => dr.Topics)
                .ThenInclude(t => t.Fields)
            .Include(dr => dr.Project)
            .FirstOrDefaultAsync(dr => dr.Id == id);

        if (documentRequest == null)
        {
            return NotFound();
        }

        return documentRequest;
    }

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<DocumentRequest>>> GetDocumentRequestsByProject(int projectId)
    {
        return await _context.DocumentRequests
            .Include(dr => dr.Topics)
                .ThenInclude(t => t.Fields)
            .Where(dr => dr.ProjectId == projectId)
            .OrderByDescending(dr => dr.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<DocumentRequest>> PostDocumentRequest(DocumentRequest documentRequest)
    {
        try
        {
            documentRequest.CreatedAt = DateTime.UtcNow;

            // Don't load the Project navigation property to avoid foreign key issues
            documentRequest.Project = null;

            _context.DocumentRequests.Add(documentRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocumentRequest), new { id = documentRequest.Id }, documentRequest);
        }
        catch (Exception ex)
        {
            // Log the error for debugging
            Console.WriteLine($"Error creating document request: {ex.Message}");
            Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
            return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutDocumentRequest(int id, DocumentRequest documentRequest)
    {
        if (id != documentRequest.Id)
        {
            return BadRequest();
        }

        _context.Entry(documentRequest).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DocumentRequestExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDocumentRequest(int id)
    {
        var documentRequest = await _context.DocumentRequests.FindAsync(id);
        if (documentRequest == null)
        {
            return NotFound();
        }

        _context.DocumentRequests.Remove(documentRequest);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool DocumentRequestExists(int id)
    {
        return _context.DocumentRequests.Any(e => e.Id == id);
    }
}
