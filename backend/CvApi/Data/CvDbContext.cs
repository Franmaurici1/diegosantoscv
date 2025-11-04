using Microsoft.EntityFrameworkCore;
using CvApi.Models;

namespace CvApi.Data;

public class CvDbContext : DbContext
{
    public CvDbContext(DbContextOptions<CvDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects { get; set; }
    public DbSet<CvInfo> CvInfos { get; set; }
    public DbSet<WorkExperience> WorkExperiences { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<DocumentRequest> DocumentRequests { get; set; }
    public DbSet<RequestTopic> RequestTopics { get; set; }
    public DbSet<TopicField> TopicFields { get; set; }
    public DbSet<FormResponse> FormResponses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.HasIndex(e => e.DisplayOrder);
        });

        modelBuilder.Entity<CvInfo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<WorkExperience>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Company).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Position).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.DisplayOrder);
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.DisplayOrder);
        });

        modelBuilder.Entity<Education>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Institution).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Degree).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.DisplayOrder);
        });

        modelBuilder.Entity<DocumentRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProjectName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.HasOne(e => e.Project)
                .WithMany()
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
        });

        modelBuilder.Entity<RequestTopic>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CategoryName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.TopicName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.TopicLabel).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Priority).HasMaxLength(50);
            entity.HasOne(e => e.DocumentRequest)
                .WithMany(dr => dr.Topics)
                .HasForeignKey(e => e.DocumentRequestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TopicField>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FieldName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.FieldType).HasMaxLength(50);
            entity.HasOne(e => e.RequestTopic)
                .WithMany(rt => rt.Fields)
                .HasForeignKey(e => e.RequestTopicId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FormResponse>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ResponseText).IsRequired();
            entity.HasOne(e => e.DocumentRequest)
                .WithMany()
                .HasForeignKey(e => e.DocumentRequestId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.RequestTopic)
                .WithMany()
                .HasForeignKey(e => e.RequestTopicId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

