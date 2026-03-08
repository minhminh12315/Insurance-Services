using System;
using System.Text;
using System.Security.Cryptography;
using System.Net;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using InsuranceService.API.Models;
using InsuranceService.API.DTOs.VNPay;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services.VNPay
{
    public class VNPayService : IVNPayService
    {
        private readonly VNPaySettings _settings;
        private readonly InsuranceDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VNPayService(IOptions<VNPaySettings> settings, InsuranceDbContext context)
        {
            _settings = settings.Value;
            _context = context;
        }

        public string CreatePaymentUrl(CreatePaymentRequest request, HttpContext context)
        {
            // Update PremiumPayment with PaymentMethod if exists
            var payment = _context.PremiumPayments.FirstOrDefault(p => p.PaymentId == request.OrderID);
            if (payment != null)
            {
                payment.PaymentMethod = request.PaymentMethod;
                payment.Gateway = "VNPay";
                _context.Update(payment);
                _context.SaveChanges();
            }

            // if (request.Amount < 5 * 1000 || request.Amount > 1 * 1000 * 1000 * 1000)
            // {
            //     throw new ArgumentException("Số tiền thanh toán phải nằm trong khoảng 5.000 (VND) đến 1.000.000.000 (VND).", nameof(request.Money));
            // }

            // if (string.IsNullOrWhiteSpace(request.Description))
            // {
            //     throw new ArgumentException("Không được để trống mô tả giao dịch.", nameof(request.Description));
            // }

            var remoteIpAddress = context.Connection.RemoteIpAddress;
            string ipAddress = remoteIpAddress != null
                ? (remoteIpAddress.IsIPv4MappedToIPv6 ? remoteIpAddress.MapToIPv4().ToString() : remoteIpAddress.ToString())
                : "127.0.0.1";

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", _settings.Version);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", _settings.TmnCode);
            vnpay.AddRequestData("vnp_Amount", ((long)(request.Amount * 100)).ToString());
            vnpay.AddRequestData("vnp_CreateDate",DateTime.UtcNow.AddHours(7).ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", request.OrderDescription.Trim());
            vnpay.AddRequestData("vnp_OrderType", _settings.OrderType);
            vnpay.AddRequestData("vnp_ReturnUrl", _settings.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", payment?.OrderCode ?? DateTime.Now.Ticks.ToString());

            string paymentUrl = vnpay.CreateRequestUrl(_settings.BaseUrl, _settings.HashSecret);

            return paymentUrl;
        }

        public bool ValidateSignature(IQueryCollection queryParams)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in queryParams)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value!);
                }
            }

            string vnp_SecureHash = queryParams["vnp_SecureHash"]!;
            return vnpay.ValidateSignature(vnp_SecureHash, _settings.HashSecret);
        }
    }

    // Helper library for VNPay (Usually part of the SDK, but added here for self-contained logic)
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayComparer());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayComparer());

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var queryBuilder = new StringBuilder();

            foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                queryBuilder.Append($"{WebUtility.UrlEncode(key)}={WebUtility.UrlEncode(value)}&");
            }

            if (queryBuilder.Length > 0)
            {
                queryBuilder.Length--;
            }

            string queryString = queryBuilder.ToString();

            string secureHash = HmacSha512(vnp_HashSecret,queryString);

            return $"{baseUrl}?{queryString}&vnp_SecureHash={WebUtility.UrlEncode(secureHash)}";
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            string rspRaw = GetResponseData();
            string myChecksum = HmacSha512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();

            if (_responseData.ContainsKey("vnp_SecureHashType"))
                _responseData.Remove("vnp_SecureHashType");

            if (_responseData.ContainsKey("vnp_SecureHash"))
                _responseData.Remove("vnp_SecureHash");

            foreach (var kv in _responseData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    // QUAN TRỌNG: Dữ liệu trả về (IQueryCollection) đã bị ASP.NET Core decode.
                    // Để tạo lại mã băm chính xác, bạn phải UrlEncode lại nó.
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            if (data.Length > 0)
                data.Remove(data.Length - 1, 1);

            return data.ToString();
        }

        private string HmacSha512(string key, string inputData)
        {
            if (string.IsNullOrEmpty(inputData))
            {
                throw new ArgumentNullException(nameof(inputData));
            }

            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
          
            using var hmac = new HMACSHA512(keyBytes);
            return BitConverter.ToString(hmac.ComputeHash(inputBytes)).Replace("-", string.Empty);
        }
    }

    public class VnPayComparer : IComparer<string>
    {
        public int Compare(string? x, string? y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            return string.Compare(x, y, StringComparison.Ordinal);
        }
    }
}
