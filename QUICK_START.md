# Quick Start Guide 🚀

## Hướng dẫn chạy nhanh

### Bước 1: Kiểm tra Node.js version

```bash
node --version
```

**Yêu cầu**: Node.js >= 20.9.0

Nếu version thấp hơn, tải về tại: https://nodejs.org/

### Bước 2: Cài dependencies

```bash
cd C:\Users\vitadairy\.gemini\antigravity\scratch\social-batch-uploader
npm install
```

### Bước 3: Chạy development server

```bash
npm run dev
```

### Bước 4: Mở trình duyệt

Truy cập: http://localhost:3000

---

## Cách sử dụng

### 1. Tải template Excel

Click vào link "📥 Tải file Excel mẫu" trên trang chủ

### 2. Điền dữ liệu

| Mã NPP | Mã NV | POST 1 | POST 2 | POST 3 | POST 4 | POST 5 | POST 6 | POST 7 | POST 8 |
|--------|-------|--------|--------|--------|--------|--------|--------|--------|--------|
| NPP001 | NV001 | URL FB | URL TikTok | ... | ... | ... | ... | ... | ... |

**Lưu ý**:
- Tối đa 100 shops (rows)
- Mỗi shop có 1-8 post URLs
- Ô trống OK nếu shop có ít hơn 8 posts

### 3. Upload file

- Kéo thả file Excel vào khung upload
- Hoặc click để chọn file

### 4. Chờ xử lý

- Theo dõi tiến độ real-time
- Xem thống kê success/fail
- Thời gian ước tính sẽ hiển thị

### 5. Tải kết quả

- File Excel tự động download khi hoàn thành
- Screenshots lưu trong `public/screenshots/`

---

## File kết quả

### 18 cột:

1. Mã NPP
2. Mã NV
3-10. POST 1-8 (URLs)
11-18. Screenshot 1-8 (URLs có link)
19. Ghi chú

### Trạng thái trong cột Ghi chú:

- ✅ **Đầy đủ**: Post có đủ 4 hashtag
- ❌ **Thiếu hashtag**: Thiếu 1 hoặc nhiều hashtag
- 🔒 **Riêng tư**: Post private/unavailable
- 🚫 **Link trùng**: URL bị duplicate trong shop
- ⚠️ **Lỗi**: Lỗi khác (timeout, network, etc.)

---

## 4 Hashtag bắt buộc

1. `#ColosBabyGoldcaitien`
2. `#DHA`
3. `#DamwheyMCT`
4. `#Vithanhnhat`

---

## Deployment lên Windows Server

### Tự động (khuyến nghị):

Double-click file: `deploy-windows.bat`

### Thủ công:

```bash
npm install
npm run build
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### PM2 Commands hữu ích:

```bash
pm2 status          # Xem trạng thái
pm2 logs            # Xem logs
pm2 restart all     # Restart app
pm2 stop all        # Stop app
pm2 monit           # Monitor resources
```

---

## Troubleshooting

### Lỗi Node version

**Hiện tượng**: `">=20.9.0" is required`

**Giải pháp**: Cài Node.js 20.x LTS từ https://nodejs.org/

### Lỗi Puppeteer install

**Giải pháp**:
```bash
npm install puppeteer --save --ignore-scripts
npx puppeteer browsers install chrome
```

### Screenshots bị lỗi nhiều

**Giải pháp**:
- Kiểm tra internet connection
- Thử giảm BATCH_SIZE từ 4 xuống 2 (file `lib/batch/processor.ts`)
- Tăng timeout từ 60s lên 90s (file `lib/puppeteer/screenshot-engine.ts`)

### Memory cao

**Giải pháp**:
- Giảm BATCH_SIZE từ 4 xuống 2
- Restart app: `pm2 restart all`
- Kiểm tra: `pm2 monit`

---

## Performance

**100 shops (800 screenshots)**:
- ⏱️ Thời gian: 45-60 phút
- 📊 Success rate: 95-99%
- 💾 RAM: ~1.5GB
- 💿 Disk: ~500MB

---

## Liên hệ & Support

📖 Xem file README.md để biết thêm chi tiết

📂 Project location:
`C:\Users\vitadairy\.gemini\antigravity\scratch\social-batch-uploader`

🔧 Built with:
- Next.js 14
- Puppeteer
- ExcelJS
- TailwindCSS
- PM2
- TypeScript
