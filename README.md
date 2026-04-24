# Hội Khóa 20 Năm - Ngày Trở Về

Ứng dụng React cao cấp dùng để thu thập thông tin cựu học sinh khóa 2002-2006.

## 🚀 Tính năng
- Giao diện Premium (Glassmorphism, animations).
- Tích hợp Supabase để lưu trữ dữ liệu.
- Sinh mã QR trực tiếp trên trang.
- Hiệu ứng pháo hoa (confetti) khi gửi thành công.

## 🛠️ Cài đặt
1. Cài đặt dependencies:
   ```bash
   npm install
   ```
2. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

## 🌐 Triển khai (GitHub Pages & Cloudflare)

### Bước 1: Đẩy lên GitHub
1. Tạo một repository mới trên GitHub.
2. Đẩy code lên:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Bước 2: Triển khai lên GitHub Pages
Chạy lệnh sau:
```bash
npm run deploy
```
Trang web sẽ được build và đẩy lên nhánh `gh-pages`.

### Bước 3: Gắn miền qua Cloudflare
1. Truy cập Cloudflare Dashboard.
2. Thêm một bản ghi **CNAME**:
   - Type: `CNAME`
   - Name: `hoikhoa` (hoặc tên tùy chọn)
   - Content: `<username>.github.io`
   - Proxy: `Enabled`
3. Trong cài đặt GitHub Repository -> Settings -> Pages -> Custom Domain, nhập tên miền của bạn.

## 📝 Chú ý về Supabase
Bạn cần copy nội dung file `supabase_schema.sql` và chạy trong **SQL Editor** của trang quản trị Supabase để tạo bảng.
