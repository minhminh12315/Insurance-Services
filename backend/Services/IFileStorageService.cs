namespace InsuranceService.API.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string folder);
    Task<bool> DeleteFileAsync(string filePath);
    string GetFileUrl(string filePath);
    bool IsValidFileType(IFormFile file, string[] allowedExtensions);
    bool IsValidFileSize(IFormFile file, long maxSizeInBytes);
}
