using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class NewsAndAnnouncement
{
    [Key]
    public int NewsId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    public string Content { get; set; } = null!;

    public DateTime? PublishedDate { get; set; }

    [ForeignKey("Author")]
    public int? AuthorId { get; set; }

    public virtual User? Author { get; set; }
}
