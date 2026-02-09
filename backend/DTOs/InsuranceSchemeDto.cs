using InsuranceService.API.DTOs.Category;

namespace InsuranceService.API.DTOs
{
    public class InsuranceSchemeDto
    {
        public int SchemeId { get; set; }
        public int? CategoryId { get; set; }

        public string SchemeName { get; set; } = string.Empty;
        public string? Description { get; set; }

        public int? MinTerm { get; set; }
        public int? MaxTerm { get; set; }

        public decimal? MinInvestmentAmount { get; set; }
        public decimal? MaxInvestmentAmount { get; set; }

        public decimal? ProfitRatio { get; set; }
        public DateOnly? NewLaunchDate { get; set; }

        public bool? IsActive { get; set; }

        // Optional: hiển thị category rút gọn
        public InsuranceCategoryResponseDto? Category { get; set; }
    }
}
