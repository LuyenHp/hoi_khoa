-- Chạy đoạn mã này trong SQL Editor của Supabase để tạo bảng lưu trữ thông tin

CREATE TABLE alumni_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  class_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company TEXT NOT NULL,
  photo TEXT, -- Lưu chuỗi Base64 của ảnh cá nhân
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cho phép mọi người gửi form (nếu không dùng Auth)
ALTER TABLE alumni_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép mọi người thêm dữ liệu" 
ON alumni_registrations FOR INSERT 
WITH CHECK (true);

-- (Tùy chọn) Cho phép xem dữ liệu - CHÚ Ý: Cẩn trọng với quyền này
-- CREATE POLICY "Cho phép mọi người xem dữ liệu" 
-- ON alumni_registrations FOR SELECT 
-- USING (true);
