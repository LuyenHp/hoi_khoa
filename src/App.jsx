import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './utils/supabase'
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  Send, 
  CheckCircle2, 
  QrCode,
  Download,
  X
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { QRCodeCanvas } from 'qrcode.react'
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

  const handleDownloadQR = async () => {
    const element = document.getElementById('qr-capture-area')
    if (!element) return
    
    try {
      setLoading(true)
      const dataUrl = await htmlToImage.toPng(element, { 
        backgroundColor: '#ffffff',
        pixelRatio: 3, 
      })
      
      if (dataUrl) {
        setCapturedImage(dataUrl)
        const link = document.createElement('a')
        link.download = 'ThiepMoi.png'
        link.href = dataUrl
        link.click()
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(err)
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
                <input required type="tel" name="phone" className="input" onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xx..." />
              </div>

              <div className="form-group">
                <label className="label">Nơi ở hiện tại</label>
                <input required name="location" className="input" onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Thành phố đang sống..." />
              </div>

              <div className="form-group">
                <label className="label">Lớp học</label>
                <div className="class-grid">
                  {CLASSES.map(cls => (
                    <div 
                      key={cls} 
                      className={`class-option ${formData.class_name === cls ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, class_name: cls})}
                    >
                      {cls}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="label">Ngành nghề & Đơn vị</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input required name="industry" className="input" onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="Ngành nghề" />
                  <input required name="company" className="input" onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Đơn vị" />
                </div>
              </div>

              <button disabled={loading} className="btn-submit">
                {loading ? 'Đang gửi...' : 'GỬI THÔNG TIN'}
              </button>
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
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
              {capturedImage ? (
                <div className="animate-fade-in">
                  <img src={capturedImage} alt="Captured" style={{ width: '100%', borderRadius: '15px' }} />
                  <div style={{ marginTop: '1.5rem', background: '#f0fdf4', padding: '1rem', borderRadius: '12px' }}>
                    <p style={{ color: '#166534', fontSize: '0.875rem' }}>Nhấn giữ vào ảnh để lưu nhé!</p>
                  </div>
                  <button className="btn-download" onClick={() => setCapturedImage(null)} style={{ background: '#f1f5f9', color: '#64748b', marginTop: '1rem' }}>
                    Chỉnh sửa thiệp
                  </button>
                </div>
              ) : (
                <>
                  <div id="qr-capture-area" style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: '20px' }}>
                    <img src={logoImg} alt="Logo" style={{ width: '60px', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>THƯ MỜI HỘI KHÓA</h3>
                    <p className="script-text">Ngày Trở Về</p>
                    <div className="qr-container">
                      <QRCodeCanvas 
                        value="https://20nam.gdo.vn" 
                        size={400} 
                        style={{ width: '220px', height: '220px' }}
                        level="H"
                        imageSettings={{
                          src: logoImg,
                          height: 80,
                          width: 80,
                          excavate: true,
                        }}
                      />
                    </div>
                  </div>
                  <button className="btn-download" onClick={handleDownloadQR} disabled={loading}>
                    {loading ? 'Đang tạo ảnh...' : 'TẠO ẢNH THIỆP MỜI'}
                  </button>
                </>
              )}
              <div style={{ marginTop: '1rem', cursor: 'pointer', color: '#64748b' }} onClick={() => setShowQR(false)}>Đóng</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
