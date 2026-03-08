using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class PolicyRiderService : IPolicyRiderService
{
    private readonly InsuranceDbContext _context;

    public PolicyRiderService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PolicyRiderDto>> GetPolicyRidersAsync(int policyId)
    {
        var riders = await _context.PolicyRiders
            .Where(r => r.PolicyId == policyId)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();

        return riders.Select(MapToDto);
    }

    public async Task<PolicyRiderDto?> GetRiderByIdAsync(int riderId)
    {
        var rider = await _context.PolicyRiders.FindAsync(riderId);
        return rider != null ? MapToDto(rider) : null;
    }

    public async Task<PolicyRiderDto> CreateRiderAsync(CreatePolicyRiderDto dto)
    {
        // Validate policy exists
        var policy = await _context.Policies.FindAsync(dto.PolicyId);
        if (policy == null)
            throw new InvalidOperationException("Policy not found");

        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Can only add riders to active policies");

        var rider = new PolicyRider
        {
            PolicyId = dto.PolicyId,
            RiderName = dto.RiderName,
            RiderType = dto.RiderType,
            Description = dto.Description,
            RiderPremium = dto.RiderPremium,
            CoverageAmount = dto.CoverageAmount,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.PolicyRiders.Add(rider);
        await _context.SaveChangesAsync();

        return MapToDto(rider);
    }

    public async Task<PolicyRiderDto?> UpdateRiderAsync(int riderId, UpdatePolicyRiderDto dto)
    {
        var rider = await _context.PolicyRiders.FindAsync(riderId);
        if (rider == null)
            return null;

        if (dto.RiderName != null)
            rider.RiderName = dto.RiderName;

        if (dto.Description != null)
            rider.Description = dto.Description;

        if (dto.RiderPremium.HasValue)
            rider.RiderPremium = dto.RiderPremium.Value;

        if (dto.CoverageAmount.HasValue)
            rider.CoverageAmount = dto.CoverageAmount.Value;

        if (dto.IsActive.HasValue)
            rider.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();

        return MapToDto(rider);
    }

    public async Task<bool> DeleteRiderAsync(int riderId)
    {
        var rider = await _context.PolicyRiders.FindAsync(riderId);
        if (rider == null)
            return false;

        _context.PolicyRiders.Remove(rider);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<RiderTemplateDto>> GetAvailableRiderTemplatesAsync(string categoryType)
    {
        var templates = new List<RiderTemplateDto>();

        switch (categoryType.ToLower())
        {
            case "life":
            case "bảo hiểm nhân thọ":
                templates.AddRange(new[]
                {
                    new RiderTemplateDto
                    {
                        RiderType = "AccidentGuard",
                        RiderName = "Tai nạn - Accident Guard",
                        Description = "Chi trả thêm khi gặp tai nạn, đặc biệt là phương tiện công cộng",
                        ApplicableCategories = "Life",
                        BasePrice = 500000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "CriticalIllness",
                        RiderName = "Bệnh hiểm nghèo - Critical Illness",
                        Description = "Bảo vệ trước 134 bệnh hiểm nghèo",
                        ApplicableCategories = "Life",
                        BasePrice = 1000000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "WaiverOfPremium",
                        RiderName = "Miễn đóng phí - Waiver of Premium",
                        Description = "Công ty đóng thay phí nếu gặp rủi ro lớn",
                        ApplicableCategories = "Life",
                        BasePrice = 750000
                    }
                });
                break;

            case "medical":
            case "bảo hiểm y tế":
                templates.AddRange(new[]
                {
                    new RiderTemplateDto
                    {
                        RiderType = "Outpatient",
                        RiderName = "Ngoại trú - Outpatient",
                        Description = "Khám bệnh thông thường, thuốc men",
                        ApplicableCategories = "Medical",
                        BasePrice = 300000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "Dental",
                        RiderName = "Nha khoa - Dental",
                        Description = "Chăm sóc răng miệng",
                        ApplicableCategories = "Medical",
                        BasePrice = 400000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "Maternity",
                        RiderName = "Thai sản - Maternity",
                        Description = "Chi phí sinh nở (có thời gian chờ)",
                        ApplicableCategories = "Medical",
                        BasePrice = 2000000
                    }
                });
                break;

            case "motor":
            case "bảo hiểm xe cơ giới":
                templates.AddRange(new[]
                {
                    new RiderTemplateDto
                    {
                        RiderType = "Hydrostatic",
                        RiderName = "Thủy kích - Hydrostatic",
                        Description = "Bảo vệ động cơ khi xe ngập nước",
                        ApplicableCategories = "Motor",
                        BasePrice = 800000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "PartsTheft",
                        RiderName = "Mất cắp bộ phận - Parts Theft",
                        Description = "Bảo hiểm mất cắp bộ phận xe",
                        ApplicableCategories = "Motor",
                        BasePrice = 600000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "OfficialGarage",
                        RiderName = "Sửa chữa Garage chính hãng",
                        Description = "Sửa chữa tại garage chính hãng",
                        ApplicableCategories = "Motor",
                        BasePrice = 1500000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "PassengerAccident",
                        RiderName = "Tai nạn người ngồi trên xe",
                        Description = "Bảo hiểm tai nạn cho người ngồi trên xe",
                        ApplicableCategories = "Motor",
                        BasePrice = 500000
                    }
                });
                break;

            case "home":
            case "bảo hiểm nhà ở":
                templates.AddRange(new[]
                {
                    new RiderTemplateDto
                    {
                        RiderType = "Contents",
                        RiderName = "Tài sản bên trong - Contents",
                        Description = "Nội thất, đồ điện tử bên trong nhà",
                        ApplicableCategories = "Home",
                        BasePrice = 1000000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "Liability",
                        RiderName = "Trách nhiệm công cộng - Liability",
                        Description = "Đền bù thiệt hại gây ra cho hàng xóm/bên thứ 3",
                        ApplicableCategories = "Home",
                        BasePrice = 700000
                    },
                    new RiderTemplateDto
                    {
                        RiderType = "RentalSupport",
                        RiderName = "Hỗ trợ thuê nhà - Rental Support",
                        Description = "Chi trả tiền thuê nhà tạm thời sau sự cố",
                        ApplicableCategories = "Home",
                        BasePrice = 500000
                    }
                });
                break;
        }

        return await Task.FromResult(templates);
    }

    private PolicyRiderDto MapToDto(PolicyRider rider)
    {
        return new PolicyRiderDto
        {
            RiderId = rider.RiderId,
            PolicyId = rider.PolicyId,
            RiderName = rider.RiderName,
            RiderType = rider.RiderType,
            Description = rider.Description,
            RiderPremium = rider.RiderPremium,
            CoverageAmount = rider.CoverageAmount,
            IsActive = rider.IsActive,
            CreatedAt = rider.CreatedAt
        };
    }
}
