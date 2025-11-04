namespace CvApi.Models;

public class FormResponse
{
    public int Id { get; set; }
    public int DocumentRequestId { get; set; }
    public int RequestTopicId { get; set; }
    public string ResponseText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public DocumentRequest? DocumentRequest { get; set; }
    public RequestTopic? RequestTopic { get; set; }
}
