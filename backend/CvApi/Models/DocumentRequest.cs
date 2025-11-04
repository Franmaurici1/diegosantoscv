namespace CvApi.Models;

public class DocumentRequest
{
    public int Id { get; set; }
    public int? ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft"; // Draft, Sent, InProgress, Completed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SentAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Navigation property
    public Project? Project { get; set; }
    public ICollection<RequestTopic> Topics { get; set; } = new List<RequestTopic>();
}
