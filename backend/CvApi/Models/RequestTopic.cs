namespace CvApi.Models;

public class RequestTopic
{
    public int Id { get; set; }
    public int DocumentRequestId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string TopicName { get; set; } = string.Empty;
    public string TopicLabel { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Priority"; // Priority, Tier 1, Tier 2, Tier 3
    public bool IsSelected { get; set; }
    public bool HasFieldRequirements { get; set; }

    // Navigation property
    public DocumentRequest? DocumentRequest { get; set; }
    public ICollection<TopicField> Fields { get; set; } = new List<TopicField>();
}
