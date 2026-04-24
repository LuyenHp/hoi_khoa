import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './utils/supabase'
import { 
  CheckCircle2, 
  QrCode,
  Download
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
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>HỘI KHÓA 20 NĂM</h2>
              <p className="script-text">Ngày Trở Về</p>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>THCS Tiên Thắng (2002 - 2006)</p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              <div className="form-group">
                <label className="label">Họ và Tên</label>
                <input required name="full_name" className="input" onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label className="label">Số điện thoại</label>
                <input required type="tel" className="input" onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xx..." />
              </div>
              <div className="form-group">
                <label className="label">Nơi ở hiện tại</label>
                <input required className="input" onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Thành phố đang sống..." />
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input required className="input" onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="Ngành nghề" />
                  <input required className="input" onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Đơn vị" />
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
                  <div id="qr-capture-area" style={{ background: 'white', padding: '2rem 1rem', borderRadius: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <img src={logoImg} alt="Logo" style={{ width: '50px', marginBottom: '0.5rem', mixBlendMode: 'multiply' }} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>THƯ MỜI HỘI KHÓA</h3>
                      <p className="script-text" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>Ngày Trở Về</p>
                      
                      {/* Vùng QR sử dụng SVG nguyên bản để html-to-image dễ capture */}
                      <div style={{ position: 'relative', display: 'inline-block', padding: '10px', background: 'white' }}>
                        <QRCodeSVG 
                          value="https://20nam.gdo.vn" 
                          size={200} 
                          level="H"
                        />
                        {/* Đè logo lên trên bằng ảnh rời để đảm bảo capture được */}
                        <div style={{ 
                          position: 'absolute', top: '50%', left: '50%', 
                          transform: 'translate(-50%, -50%)', 
                          background: 'white', padding: '4px', borderRadius: '4px' 
                        }}>
                          <img src={logoImg} style={{ width: '40px', height: '40px', mixBlendMode: 'multiply', imageRendering: '-webkit-optimize-contrast' }} alt="QR Logo" />
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
