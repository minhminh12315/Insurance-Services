namespace InsuranceService.API.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileStorageService> _logger;
    private readonly string _uploadFolder;

    public FileStorageService(IWebHostEnvironment environment, ILogger<FileStorageService> logger)
    {
        _environment = environment;
        _logger = logger;
        _uploadFolder = Path.Combine(_environment.ContentRootPath, "Uploads");

        // Create Uploads folder if it doesn't exist
        if (!Directory.Exists(_uploadFolder))
        {
            Directory.CreateDirectory(_uploadFolder);
        }
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folder)
    {
        try
        {
            // Create subfolder if it doesn't exist
            var folderPath = Path.Combine(_uploadFolder, folder);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(folderPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path for storage in database
            var relativePath = Path.Combine(folder, fileName).Replace("\\", "/");
            _logger.LogInformation("File saved successfully: {FilePath}", relativePath);
            return relativePath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving file: {FileName}", file.FileName);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_uploadFolder, filePath);
            if (File.Exists(fullPath))
            {
                await Task.Run(() => File.Delete(fullPath));
                _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
                return true;
            }
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
            return false;
        }
    }

    public string GetFileUrl(string filePath)
    {
        // Return URL to access the file (adjust based on your hosting configuration)
        return $"/uploads/{filePath}";
    }

    public bool IsValidFileType(IFormFile file, string[] allowedExtensions)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        return allowedExtensions.Contains(extension);
    }

    public bool IsValidFileSize(IFormFile file, long maxSizeInBytes)
    {
        return file.Length <= maxSizeInBytes;
    }
}
