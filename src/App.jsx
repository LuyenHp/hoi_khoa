import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './utils/supabase'
import { 
  CheckCircle2, 
  QrCode,
  Download,
  Send
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { QRCodeSVG } from 'qrcode.react'
import * as htmlToImage from 'html-to-image'

import backdropImg from './assets/backdrop.png'
import logoImg from './assets/logo.png'

const CLASSES = ['9A', '9B', '9C', '9D', '9E']

export default function App() {
  const [formData, setFormData] = useState({
    full_name: '', phone: '', location: '', class_name: '', industry: '', company: ''
  })
  const [provinces, setProvinces] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [userPhoto, setUserPhoto] = useState(null)

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err))
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Kiểm tra định dạng số điện thoại Việt Nam (10 số, bắt đầu bằng 0, đầu số 3,5,7,8,9)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
    if (!phoneRegex.test(formData.phone)) {
      return alert('Số điện thoại không đúng định dạng Việt Nam (phải có 10 chữ số và bắt đầu bằng 03, 05, 07, 08 hoặc 09)!')
    }

    if (!formData.class_name) return alert('Vui lòng chọn lớp!')
    setLoading(true)
    const { error } = await supabase.from('alumni_registrations').insert([formData])
    if (error) {
      alert('Lỗi: ' + error.message)
      setLoading(false)
    } else {
      setLoading(false)
      setSubmitted(true)
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    }
  }

  const handleCreateImage = async () => {
    const element = document.getElementById('qr-capture-area')
    if (!element) return
    
    try {
      setLoading(true)
      // Chờ một chút để đảm bảo mọi thứ đã render
      await new Promise(r => setTimeout(r, 600))
      
      const dataUrl = await htmlToImage.toPng(element, { 
        backgroundColor: '#ffffff',
        pixelRatio: 4, // Mức siêu sắc nét
        style: {
          imageRendering: 'crisp-edges'
        }
      })
      
      if (dataUrl) {
        setCapturedImage(dataUrl)
        
        // Tự động tải xuống cho PC
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = 'Thiep-Moi-Hoi-Khoa.png'
        document.body.appendChild(link)
        setTimeout(() => {
          link.click()
          document.body.removeChild(link)
        }, 100)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      alert('Không thể tạo ảnh, vui lòng chụp màn hình!')
    }
  }

  return (
    <div className="app-container">
      <div className="background-image" style={{ backgroundImage: `url(${backdropImg})` }} />
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="form-card">
            <div className="card-header">
              <img src={logoImg} alt="Logo" className="logo-main" style={{ mixBlendMode: 'multiply' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>HỘI KHÓA 20 NĂM</h2>
              <p className="script-text">Ngày Trở Về</p>
              <p style={{ color: '#64748b', fontSize: '0.75rem' }}>THCS Tiên Thắng (2002 - 2006)</p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Họ và Tên</label>
                  <input required name="full_name" className="input" onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Nguyễn Văn A" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Số điện thoại</label>
                  <input 
                    required 
                    type="tel" 
                    className="input" 
                    value={formData.phone}
                    maxLength={10}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '') // Chỉ giữ lại số
                      setFormData({...formData, phone: val})
                    }} 
                    placeholder="09xx..." 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="label">Nơi ở hiện tại</label>
                <select 
                  required 
                  className="input" 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  defaultValue=""
                >
                  <option value="" disabled>Chọn Tỉnh / Thành phố</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                  <option value="Nước ngoài">Nước ngoài</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Lớp học</label>
                <div className="class-grid">
                  {CLASSES.map(cls => (
                    <div key={cls} className={`class-option ${formData.class_name === cls ? 'active' : ''}`} onClick={() => setFormData({...formData, class_name: cls})}>{cls}</div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="label">Ngành nghề & Đơn vị</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                  <select 
                    required 
                    className="input" 
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                    defaultValue=""
                  >
                    <option value="" disabled>Chọn ngành nghề</option>
                    <option value="Kinh doanh / Buôn bán">Kinh doanh / Buôn bán</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Xây dựng / Kiến trúc">Xây dựng / Kiến trúc</option>
                    <option value="Giáo dục / Đào tạo">Giáo dục / Đào tạo</option>
                    <option value="Y tế / Dược phẩm">Y tế / Dược phẩm</option>
                    <option value="Cơ khí / Sản xuất">Cơ khí / Sản xuất</option>
                    <option value="Tài chính / Ngân hàng">Tài chính / Ngân hàng</option>
                    <option value="Lao động tự do">Lao động tự do</option>
                    <option value="Khác">Khác...</option>
                  </select>
                  <input required className="input" onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Đơn vị công tác" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Ảnh kỷ niệm (Không bắt buộc)</label>
                <div 
                  onClick={() => document.getElementById('photo-input').click()}
                  style={{ 
                    border: '2px dashed #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '1rem', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: userPhoto ? '#f8fafc' : 'white'
                  }}
                >
                  {userPhoto ? (
                    <img src={userPhoto} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} />
                  ) : (
                    <div style={{ color: '#64748b' }}>
                      <Send size={24} style={{ marginBottom: '4px', transform: 'rotate(-45deg)' }} />
                      <p style={{ fontSize: '0.8rem' }}>Chụp hoặc Tải ảnh của bạn</p>
                    </div>
                  )}
                  <input id="photo-input" type="file" accept="image/*" capture="user" hidden onChange={handlePhotoChange} />
                </div>
              </div>

              <button disabled={loading} className="btn-submit">{loading ? 'Đang gửi...' : 'GỬI THÔNG TIN'}</button>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="form-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Gửi Thành Công!</h2>
            <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>Hẹn gặp lại bạn tại ngày kỷ niệm.</p>
            <button onClick={() => setSubmitted(false)} className="btn-submit">QUAY LẠI</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="float-btn pulse-ani" onClick={() => { setShowQR(true); setCapturedImage(null); }}>
        <QrCode size={32} />
      </div>

      <AnimatePresence>
        {showQR && (
          <div className="modal-overlay" onClick={() => setShowQR(false)}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '1.5rem' }}>
              
              {capturedImage ? (
                <div>
                  <img src={capturedImage} alt="Invitation" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <p style={{ marginTop: '1rem', color: '#166534', fontWeight: 600, fontSize: '0.9rem' }}>✅ Nhấn giữ vào ảnh để lưu nhé!</p>
                  <button className="btn-download" onClick={() => setCapturedImage(null)} style={{ background: '#f1f5f9', color: '#64748b', marginTop: '1rem' }}>Quay lại</button>
                </div>
              ) : (
                <>
                  <div id="qr-capture-area" style={{ background: 'white', padding: '2.5rem 1rem', borderRadius: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                      {userPhoto ? (
                        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1rem' }}>
                          <img src={userPhoto} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0072d2' }} />
                          <img src={logoImg} style={{ position: 'absolute', bottom: 0, right: 0, width: '25px', height: '25px', mixBlendMode: 'multiply', background: 'white', borderRadius: '50%' }} alt="Logo" />
                        </div>
                      ) : (
                        <img src={logoImg} alt="Logo" style={{ width: '50px', marginBottom: '0.5rem', mixBlendMode: 'multiply' }} />
                      )}
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>THƯ MỜI HỘI KHÓA</h3>
                      <p className="script-text" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>Ngày Trở Về</p>
                      
                      {/* Vùng QR sử dụng SVG nguyên bản để html-to-image dễ capture */}
                    <div style={{ position: 'relative', display: 'inline-block', background: 'white' }}>
                      <QRCodeSVG 
                        value="https://20nam.gdo.vn" 
                        size={800} 
                        style={{ width: '220px', height: '220px' }}
                        level="H"
                      />
                      <div style={{ 
                        position: 'absolute', top: '50%', left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        width: '50px', height: '50px'
                      }}>
                        <img src={logoImg} style={{ width: '100%', height: '100%', mixBlendMode: 'multiply' }} alt="QR Logo" />
                      </div>
                    </div>
                      
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>Mã QR đăng ký tham gia</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0072d2', marginTop: '0.5rem' }}>20NAM.GDO.VN</p>
                    </div>
                  </div>
                  
                  <button className="btn-download" onClick={handleCreateImage} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'XUẤT ẢNH THIỆP MỜI'}
                  </button>
                </>
              )}
              
              <div style={{ marginTop: '1rem', cursor: 'pointer', color: '#94a3b8', fontSize: '0.8rem' }} onClick={() => setShowQR(false)}>Đóng</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
