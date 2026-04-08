# 📋 Cập nhật mới - Format Excel & Lưu trữ ảnh

## ✅ Đã thực hiện 3 yêu cầu:

### 1. ✅ Thay đổi format Excel - Xen kẽ POST và Screenshot

**Trước đây**:
```
Mã NPP | Mã NV | POST 1 | POST 2 | ... | POST 8 | Screenshot 1 | Screenshot 2 | ... | Screenshot 8 | Ghi chú
```

**Bây giờ**:
```
Mã NPP | Mã NV | POST 1 | Screenshot 1 | POST 2 | Screenshot 2 | ... | POST 8 | Screenshot 8 | Ghi chú
```

**Lợi ích**: Dễ đối chiếu POST với Screenshot tương ứng!

---

### 2. ✅ Hỗ trợ lưu ảnh trên ổ chung (Shared Drive)

Bạn có thể cấu hình để lưu screenshots trên:
- **Ổ mạng Windows** (UNC path): `\\\\SERVER\\ShareFolder\\Screenshots`
- **Ổ đĩa ánh xạ**: `Z:\\Screenshots`
- **Thư mục local** (mặc định): `public/screenshots`

**Cách cấu hình**:

#### Bước 1: Tạo file `.env.local` trong thư mục project

```env
# Ổ mạng (UNC path)
SCREENSHOT_STORAGE_PATH=\\\\YOUR-SERVER\\ShareFolder\\Screenshots
SCREENSHOT_PUBLIC_URL=\\\\YOUR-SERVER\\ShareFolder\\Screenshots
```

#### Bước 2: Restart server

```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
```

#### Bước 3: Test

- Upload Excel và xử lý
- Kiểm tra ảnh đã lưu vào ổ chung chưa
- Mở Excel trên máy khác, click link ảnh để verify

---

### 3. ✅ Đảm bảo định dạng ảnh PNG đúng chuẩn

**Cải tiến**:
- ✅ Format: PNG (chuẩn, mở được mọi nơi)
- ✅ Quality: 100 (chất lượng tối đa)
- ✅ Validation: Kiểm tra file size > 1KB
- ✅ Kiểm tra extension `.png`
- ✅ Background: Giữ nguyên màu nền (không transparent)

**File config**: `lib/utils/screenshot-config.ts`

---

## 📁 Files mới tạo:

1. **`lib/utils/screenshot-config.ts`** - Config module cho storage
2. **`ENV_CONFIG.md`** - Hướng dẫn chi tiết cấu hình ổ chung
3. **`.env.example`** - Template file environment

---

## 🚀 Cách sử dụng Shared Drive

### Option 1: Ổ mạng UNC (Khuyến nghị)

```env
SCREENSHOT_STORAGE_PATH=\\\\OFFICE-SERVER\\Shared\\Screenshots
SCREENSHOT_PUBLIC_URL=\\\\OFFICE-SERVER\\Shared\\Screenshots
```

**Ưu điểm**:
- Ổn định hơn mapped drive
- Không cần map drive trên mỗi máy
- Tự động reconnect khi mất kết nối

### Option 2: Ổ đĩa ánh xạ

```bash
# Map drive trước
net use Z: \\\\SERVER\\ShareFolder /persistent:yes

# Tạo folder
mkdir Z:\\Screenshots
```

```env
SCREENSHOT_STORAGE_PATH=Z:\\Screenshots
SCREENSHOT_PUBLIC_URL=Z:\\Screenshots
```

### Option 3: Local (Development)

```env
SCREENSHOT_STORAGE_PATH=public/screenshots
SCREENSHOT_PUBLIC_URL=/screenshots
```

---

## 🧪 Test ngay

### Test 1: Kiểm tra format Excel mới

1. Chạy server: `npm run dev`
2. Upload file Excel test
3. Xử lý batch
4. Mở Excel kết quả
5. **Verify**: POST 1 ở cạnh Screenshot 1 ✅

### Test 2: Kiểm tra shared drive

1. Tạo `.env.local` với path ổ chung
2. Restart server
3. Xử lý batch
4. **Verify**: Ảnh lưu vào ổ chung ✅
5. Mở Excel trên máy khác
6. Click link ảnh
7. **Verify**: Ảnh mở được ✅

### Test 3: Kiểm tra định dạng PNG

1. Sau khi xử lý, vào folder screenshots
2. Click chuột phải vào file ảnh → Properties
3. **Verify**: Type = PNG Image ✅
4. **Verify**: Size > 1KB ✅
5. Double-click mở ảnh
6. **Verify**: Ảnh hiển thị đúng ✅

---

## 📖 Tài liệu chi tiết

Xem file **`ENV_CONFIG.md`** để biết:
- Hướng dẫn setup từng bước
- Troubleshooting
- Best practices
- Ví dụ cấu hình cho các trường hợp khác nhau

---

## ⚠️ Lưu ý quan trọng

### Permissions

Đảm bảo:
- ✅ Application có quyền **Write** vào folder ổ chung
- ✅ Users có quyền **Read** để xem ảnh
- ✅ Network drive accessible từ tất cả máy

### Testing

Trước khi deploy production:
1. Test với 2-3 shops trước
2. Verify ảnh lưu đúng chỗ
3. Test mở ảnh từ máy khác
4. Kiểm tra permissions

### Backup

- Nên backup folder screenshots định kỳ
- Monitor disk space trên shared drive
- Setup auto-cleanup cho ảnh cũ (nếu cần)

---

## 🎯 Tóm tắt

✅ **Format Excel**: POST và Screenshot xen kẽ nhau  
✅ **Shared Drive**: Hỗ trợ UNC path và mapped drive  
✅ **PNG Format**: Chất lượng 100, validation đầy đủ  
✅ **Documentation**: Hướng dẫn chi tiết trong ENV_CONFIG.md  
✅ **Ready to use**: Chỉ cần tạo .env.local và restart  

---

**Cần hỗ trợ?** Xem file `ENV_CONFIG.md` hoặc hỏi tôi! 🚀
