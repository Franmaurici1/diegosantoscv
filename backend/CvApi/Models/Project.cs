namespace CvApi.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LiveUrl { get; set; }
    public string? RepositoryUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? CodeSnippet { get; set; }
    public string? CodeExplanation { get; set; }
    public string? Technologies { get; set; } // Comma-separated list
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

