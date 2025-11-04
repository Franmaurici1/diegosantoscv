namespace CvApi.Models;

public class TopicField
{
    public int Id { get; set; }
    public int RequestTopicId { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public string FieldType { get; set; } = "Text"; // Text, Number, Date, File, Dropdown
    public bool IsRequired { get; set; }
    public string? DefaultValue { get; set; }
    public string? Options { get; set; } // JSON array for dropdown options

    // Navigation property
    public RequestTopic? RequestTopic { get; set; }
}
