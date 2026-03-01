using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs.VNPay
{
    public class CreatePaymentRequest
    {
        [Required]
        public int OrderID { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; } = "VNPay";

        public string OrderDescription { get; set; } = string.Empty;
    }
}
