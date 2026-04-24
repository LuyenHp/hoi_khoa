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
    if (element) {
      try {
        // Đợi logo và QR hoàn thiện render
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const dataUrl = await htmlToImage.toPng(element, { 
          pixelRatio: 3, 
          backgroundColor: '#ffffff',
          cacheBust: true,
        })
        
        const link = document.createElement('a')
        link.download = `Thiep-Moi-Hoi-Khoa.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (err) {
        console.error('Download error:', err)
        alert('Có lỗi khi tạo ảnh thiệp, vui lòng thử lại!')
      }
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

      {/* Floating Button */}
      <div className="float-btn pulse-ani" onClick={() => setShowQR(true)}>
        <QrCode size={32} />
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="modal-overlay" onClick={() => setShowQR(false)}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="modal-content" onClick={e => e.stopPropagation()}>
              <div id="qr-capture-area" style={{ background: 'white', padding: '2rem', borderRadius: '20px' }}>
                <img src={logoImg} alt="Logo" style={{ width: '50px', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>THƯ MỜI HỘI KHÓA</h3>
                <div className="qr-container">
                  <QRCodeSVG 
                    value={window.location.href} 
                    size={220} 
                    level="H" 
                    imageSettings={{
                      src: logoImg,
                      height: 50,
                      width: 50,
                      excavate: true,
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Quét mã để đăng ký tham gia</p>
              </div>
              <button className="btn-download" onClick={handleDownloadQR}>
                <Download size={18} style={{ marginRight: '8px' }} /> TẢI THIỆP MỜI
              </button>
              <div style={{ marginTop: '1rem', cursor: 'pointer', color: '#64748b' }} onClick={() => setShowQR(false)}>Đóng</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
