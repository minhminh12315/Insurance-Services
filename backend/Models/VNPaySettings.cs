namespace InsuranceService.API.Models
{
    public class VNPaySettings
    {
        public string TmnCode { get; set; } = null!;
        public string HashSecret { get; set; } = null!;
        public string BaseUrl { get; set; } = null!;
        public string ReturnUrl { get; set; } = null!;   
        public string IpnUrl { get; set; } = null!;
        public string Version { get; set; } = null;
        public string OrderType { get; set; } = null;
    }
}
