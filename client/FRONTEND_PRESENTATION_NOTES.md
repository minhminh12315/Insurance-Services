# Tóm tắt logic frontend để thuyết trình

> Phạm vi file này chỉ tập trung vào **mua bảo hiểm** và **yêu cầu sử dụng bảo hiểm (claim)** ở phía frontend.
> **Không trình bày phần thanh toán**.

---

## 1. Mua bảo hiểm trên frontend

### 1.1. Điểm bắt đầu của người dùng
Người dùng có thể đi vào luồng mua bảo hiểm từ:
- Trang `Home`
- Trang `Services`
- Trang `My Policies` với nút **Buy New Policy**

Frontend điều hướng người dùng đến màn hình báo giá/mua bảo hiểm qua route:
- `/calculator`
- hoặc `/calculator?categoryId=...`

Ý nghĩa của `categoryId`:
- Giúp mở sẵn đúng nhóm bảo hiểm mà người dùng vừa chọn
- Ví dụ: Life, Health, Motor, Home

---

### 1.2. Cách frontend nhận loại bảo hiểm được chọn
Trong `PremiumCalculator.tsx`, frontend lấy `categoryId` từ URL:

```tsx
const categoryIdParam = searchParams.get('categoryId');
const categoryIdFilter = categoryIdParam ? Number(categoryIdParam) : undefined;
```

Ý nghĩa:
- Nếu người dùng đi từ trang dịch vụ sang, frontend biết họ đang muốn xem nhóm bảo hiểm nào
- Nếu không có `categoryId`, màn hình vẫn hoạt động bình thường và tải danh sách gói mặc định

---

### 1.3. Tải danh sách gói bảo hiểm
Sau khi lấy được `categoryId`, frontend gọi API để lấy danh sách scheme đang active:
- `schemeApi.getLifeSchemes(categoryIdFilter)`

Frontend sẽ:
1. Tải danh sách gói
2. Chọn gói đầu tiên làm mặc định
3. Thiết lập giá trị mặc định cho:
   - `sumAssured`
   - `termYears`
4. Kiểm tra min/max theo cấu hình của scheme

Ý nghĩa nghiệp vụ:
- Người dùng không phải nhập từ đầu hoàn toàn
- Mọi giá trị đều được giới hạn theo rule của gói bảo hiểm

---

### 1.4. Người dùng cấu hình gói bảo hiểm
Ở màn hình `PremiumCalculator`, người dùng thao tác trên 4 nhóm chính:

#### a. `Policy Plan`
- Chọn gói bảo hiểm cụ thể

#### b. `Sum Assured`
- Chọn số tiền bảo hiểm
- Frontend dùng input + slider để tăng trải nghiệm nhập liệu
- Giá trị luôn bị chặn trong khoảng min/max của scheme

#### c. `Policy Term`
- Chọn số năm tham gia
- Danh sách năm được build động từ `minTerm` đến `maxTerm`

#### d. `Payment Frequency`
- Chọn chu kỳ đóng phí:
  - Monthly
  - Quarterly
  - Half-Yearly
  - Yearly

> Khi thuyết trình, có thể nói ngắn gọn: frontend cho phép người dùng “cá nhân hóa gói bảo hiểm” trước khi sang bước thanh toán.

---

### 1.5. Tính phí bảo hiểm theo thời gian thực
Khi người dùng thay đổi:
- gói bảo hiểm
- số tiền bảo hiểm
- thời hạn
- chu kỳ đóng phí

frontend sẽ tự động gọi API tính phí:
- `schemeApi.calculatePremium(...)`

Frontend dùng `useEffect` để theo dõi các giá trị này và cập nhật:
- `annualPremium`
- `premiumPerInstallment`
- `totalPremiumPayable`

Ý nghĩa:
- Người dùng thấy ngay chi phí thay đổi như thế nào
- Không cần bấm nút tính lại thủ công

---

### 1.6. Premium Summary hiển thị gì
Khối `Premium Summary` ở bên phải cho người dùng thấy:
- Base Plan
- Add-ons / Riders
- Tax
- Discount theo chu kỳ đóng phí
- Total Payable
- Premium per Installment

Điểm hay ở frontend:
- Tổng tiền được cập nhật ngay khi người dùng đổi lựa chọn
- Giao diện đóng vai trò như một bảng tóm tắt trước khi chuyển sang bước tiếp theo

---

### 1.7. Riders & Add-ons
Frontend hiện có danh sách rider mẫu:
- Critical Illness Cover
- Accidental Death Benefit
- Waiver of Premium

Khi chọn rider:
- frontend cập nhật `selectedRiderIds`
- cộng thêm chi phí rider vào `pricingBreakdown`

Ý nghĩa khi thuyết trình:
- Đây là phần giúp người dùng tùy biến quyền lợi bảo hiểm
- Rider hiện tác động lên phần hiển thị giá ở frontend

---

### 1.8. Chuẩn bị dữ liệu trước khi sang bước thanh toán
Khi người dùng bấm **Proceed to Payment**, frontend bắt đầu gom dữ liệu của hợp đồng.

Frontend tạo `policyPayload` với các trường chung:
- `schemeId`
- `termYears`
- `paymentFrequency`
- `sumAssured`

Sau đó bổ sung dữ liệu chi tiết theo từng nhóm bảo hiểm:

#### Life Insurance
- `lifeDetails`
- ví dụ: `nomineeName`, `nomineeRelation`

#### Medical Insurance
- `medicalDetails`
- ví dụ: bệnh nền, hospital tier, family floater

#### Motor Insurance
- `motorDetails`
- ví dụ: biển số xe, model xe, loại xe

#### Home Insurance
- `homeDetails`
- ví dụ: địa chỉ tài sản, giá trị tài sản, loại công trình

### 1.9. Cách nói khi thuyết trình
Vì phần thanh toán là của người khác, đoạn này nên chốt như sau:

> “Ở phần frontend của em, hệ thống đã cho phép người dùng chọn loại bảo hiểm, cấu hình gói, xem premium thay đổi theo thời gian thực, chọn thêm rider và chuẩn bị đầy đủ dữ liệu hợp đồng trước khi chuyển sang bước thanh toán.”

---

## 2. Yêu cầu sử dụng bảo hiểm (Claim) trên frontend

### 2.1. Hiện trạng frontend
Frontend **đã có luồng claim cho user để demo trực tiếp** và có route riêng cho user.

Hiện đang có:

#### a. `MyClaims.tsx`
- Gọi API thật để lấy danh sách claim của user (`/claim/my-claims`)
- Có form tạo claim mới (`policyId`, `claimAmount`, `reason`)
- Có upload tài liệu hỗ trợ sau khi tạo claim (`/claim/{id}/upload-document`)
- Có hiển thị trạng thái claim và ghi chú từ admin (nếu có)

#### b. `UserDashboard.tsx`
- Có thống kê số lượng claim của người dùng
- Cũng đang lấy từ dữ liệu giả

#### c. `Admin/ClaimList.tsx`
- Gọi API thật để lấy toàn bộ claim cho admin (`GET /claim`)
- Lọc claim theo status ngay trên giao diện
- Cập nhật trạng thái claim thật qua API (`PATCH /claim/{id}/status`)
- Hỗ trợ workflow: Review → Approve/Reject → Mark Paid

---

### 2.2. Frontend đang thể hiện logic claim như thế nào
Về mặt giao diện, claim đang được hiểu là:
1. Người dùng có một hoặc nhiều hợp đồng bảo hiểm
2. Sau đó có thể phát sinh yêu cầu sử dụng bảo hiểm / bồi thường
3. Mỗi claim có các thông tin cơ bản:
   - mã claim
   - policy liên quan
   - ngày yêu cầu
   - số tiền yêu cầu
   - lý do
   - trạng thái

Các trạng thái đang thể hiện trên frontend:
- Submitted
- Under Review
- Approved
- Rejected

Điều này giúp thuyết trình được cả nghiệp vụ lẫn flow thao tác thực tế trên frontend.

---

### 2.3. Mức độ hoàn thiện hiện tại của claim frontend
Hiện đã có các phần chính để demo:
- `claimApi` trong `insuranceApi.ts`
- Form user gửi claim thật
- Upload chứng từ claim từ giao diện user
- Route user chính thức: `/user/claims`
- Điều hướng từ dropdown user profile sang trang claim

Phần chưa hoàn thiện sâu:
- `UserDashboard` vẫn còn một số số liệu lấy từ dữ liệu giả
- Chưa có flow chỉnh sửa/xóa claim phía user

---

### 2.4. Cách nói khi thuyết trình
Có thể trình bày như sau:

> “Với phần yêu cầu sử dụng bảo hiểm, frontend hiện đã có màn hình claim cho user với dữ liệu thật: xem claim của tôi, nộp claim mới, và đính kèm chứng từ. Hệ thống cũng hiển thị trạng thái xử lý như Submitted, Under Review, Approved, Rejected. Vì vậy em có thể demo trực tiếp flow claim ở phía người dùng.”

---

## 3. So sánh nhanh 2 phần để dễ thuyết trình

| Phần | Mức độ hoàn thiện frontend | Ghi chú |
|---|---|---|
| Mua bảo hiểm | Khá đầy đủ | Có luồng chọn gói, tính phí realtime, chuẩn bị dữ liệu hợp đồng |
| Yêu cầu sử dụng bảo hiểm | Đã demo được luồng chính | User có thể submit claim + xem danh sách claim từ API thật |

---

## 4. Bài nói ngắn gọn 1-2 phút

### Phiên bản ngắn
> “Ở phía frontend, phần mua bảo hiểm đã khá hoàn chỉnh. Người dùng có thể đi từ trang dịch vụ vào màn hình calculator, chọn loại gói, số tiền bảo hiểm, thời hạn hợp đồng và chu kỳ đóng phí. Hệ thống sẽ tính premium theo thời gian thực và hiển thị lại ở phần Premium Summary. Ngoài ra người dùng còn có thể chọn thêm rider để tùy biến quyền lợi. Sau khi hoàn tất cấu hình, frontend sẽ chuẩn bị dữ liệu hợp đồng để chuyển sang bước thanh toán.
>
> Còn với phần yêu cầu sử dụng bảo hiểm, frontend hiện đã có màn hình claim cho user dùng dữ liệu thật. Người dùng có thể chọn policy, nhập số tiền yêu cầu, nhập lý do, gửi claim và đính kèm tài liệu. Danh sách claim sau đó hiển thị trạng thái xử lý để người dùng theo dõi tiến độ.”

---

## 5. Nếu bị hỏi sâu thì trả lời nhanh

### Hỏi: Frontend mua bảo hiểm đọc loại bảo hiểm từ đâu?
Trả lời:
- Từ query string `categoryId` trên URL `/calculator?categoryId=...`

### Hỏi: Tính premium ở frontend hay backend?
Trả lời:
- Frontend chỉ gửi dữ liệu và hiển thị kết quả
- Backend mới là nơi tính premium chính thức

### Hỏi: Claim đã dùng được chưa?
Trả lời:
- Có thể demo được ở frontend user
- User đã gửi claim thật qua API và theo dõi trạng thái claim

### Hỏi: Phần của em dừng ở đâu?
Trả lời:
- Em phụ trách phần frontend trước bước thanh toán và phần claim user, gồm chọn gói, tính phí, chuẩn bị dữ liệu hợp đồng, gửi claim, upload chứng từ và theo dõi trạng thái

---

## 6. File frontend liên quan

### Mua bảo hiểm
- `client/src/pages/User/PremiumCalculator.tsx`
- `client/src/pages/Services.tsx`
- `client/src/pages/Home.tsx`
- `client/src/pages/User/MyPolicies.tsx`
- `client/src/services/insuranceApi.ts`

### Yêu cầu sử dụng bảo hiểm
- `client/src/pages/User/MyClaims.tsx`
- `client/src/App.tsx`
- `client/src/components/Header.tsx`
- `client/src/pages/Admin/ClaimList.tsx`
- `client/src/pages/User/UserDashboard.tsx`
- `client/src/services/insuranceApi.ts`

---

## 7. Chốt 1 câu dễ nhớ

> **Frontend hiện làm tốt phần mua bảo hiểm trước thanh toán; đồng thời phần claim user đã demo được luồng chính: gửi yêu cầu sử dụng bảo hiểm và theo dõi trạng thái xử lý.**
