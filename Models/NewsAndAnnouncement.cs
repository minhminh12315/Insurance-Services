using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class NewsAndAnnouncement
{
    public int NewsId { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime? PublishedDate { get; set; }

    public int? AuthorId { get; set; }

    public virtual User? Author { get; set; }
}
