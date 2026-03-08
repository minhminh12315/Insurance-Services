using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IPolicySurrenderService
{
    Task<SurrenderCalculationDto?> CalculateSurrenderValueAsync(int policyId);
    Task<PolicySurrenderDto> CreateSurrenderRequestAsync(int userId, CreatePolicySurrenderDto dto);
    Task<PolicySurrenderDto?> GetSurrenderByIdAsync(int surrenderId);
    Task<List<PolicySurrenderDto>> GetUserSurrendersAsync(int userId);
    Task<List<PolicySurrenderDto>> GetPendingSurrendersAsync();
    Task<PolicySurrenderDto?> ProcessSurrenderAsync(int surrenderId, int processedBy, ProcessSurrenderDto dto);
}
