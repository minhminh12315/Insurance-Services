namespace InsuranceService.API.DTOs.VNPay
{
    public class VNPayResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public string? OrderId { get; set; }
        public string? VnPayResponseCode { get; set; }
        public string? VnPayTransactionNo { get; set; }
        public string? VnPayBankCode { get; set; }
        public decimal? Amount { get; set; }
        public string? VnPayTxnRef { get; set; }
    }
}
