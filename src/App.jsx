import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './utils/supabase'
import { 
  CheckCircle2, 
  QrCode,
  Download,
  Send,
  Users,
  ClipboardList
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
  const [view, setView] = useState('form') // 'form' hoặc 'list'
  const [registrations, setRegistrations] = useState([])
  const [selectedClass, setSelectedClass] = useState('ALL')

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err))
    
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from('alumni_registrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRegistrations(data)
  }

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
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
    if (!phoneRegex.test(formData.phone)) {
      return alert('Số điện thoại không đúng định dạng!')
    }
    if (!formData.class_name) return alert('Vui lòng chọn lớp!')
    setLoading(true)
    
    const { error } = await supabase.from('alumni_registrations').insert([
      { ...formData, photo: userPhoto }
    ])
    
    if (error) {
      alert('Lỗi: ' + error.message)
      setLoading(false)
    } else {
      setLoading(false)
      setSubmitted(true)
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      fetchRegistrations()
    }
  }

  const handleDownloadQR = async () => {
    const element = document.getElementById('qr-capture-area')
    if (!element) return
    try {
      setLoading(true)
      await new Promise(r => setTimeout(r, 600))
      const dataUrl = await htmlToImage.toPng(element, { 
        backgroundColor: '#ffffff',
        pixelRatio: 4,
        style: { imageRendering: 'crisp-edges' }
      })
      if (dataUrl) {
        setCapturedImage(dataUrl)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = 'Thiep-Moi-20-Nam.png'
        document.body.appendChild(link)
        setTimeout(() => {
          link.click()
          document.body.removeChild(link)
        }, 100)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      alert('Lỗi tạo ảnh!')
    }
  }

  return (
    <div className="app-container">
      <div className="background-image" style={{ backgroundImage: `url(${backdropImg})` }} />
      
      {/* Modern Tab Navigation */}
      <div className="tab-nav-wrapper">
        <div className="tab-nav">
          {['form', 'list'].map((t) => (
            <button 
              key={t}
              className={`tab-item ${view === t ? 'active' : ''}`} 
              onClick={() => {
                setView(t)
                if (t === 'list') fetchRegistrations()
              }}
            >
              {view === t && (
                <motion.div 
                  layoutId="activeTab"
                  className="active-bg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="tab-content-inner" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {t === 'form' ? (
                  <><ClipboardList size={16} /> ĐĂNG KÝ</>
                ) : (
                  <><Users size={16} /> THÀNH VIÊN ({registrations.length})</>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'form' ? (
          !submitted ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="form-card">
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
                    <input required className="input" onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Số điện thoại</label>
                    <input required type="tel" className="input" value={formData.phone} maxLength={10} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({...formData, phone: val})
                    }} placeholder="09xx..." />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Nơi ở hiện tại</label>
                  <select required className="input" onChange={e => setFormData({...formData, location: e.target.value})} defaultValue="">
                    <option value="" disabled>Chọn Tỉnh / Thành phố</option>
                    {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
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
                    <select required className="input" onChange={e => setFormData({...formData, industry: e.target.value})} defaultValue="">
                      <option value="" disabled>Ngành nghề</option>
                      {['Kinh doanh', 'Công nghệ', 'Xây dựng', 'Giáo dục', 'Y tế', 'Sản xuất', 'Tài chính', 'Tự do', 'Khác'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <input required className="input" onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Đơn vị" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Ảnh kỷ niệm</label>
                  <div onClick={() => document.getElementById('photo-input').click()} style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: userPhoto ? '#f8fafc' : 'white' }}>
                    {userPhoto ? <img src={userPhoto} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} /> : <div style={{ color: '#64748b' }}><Send size={20} /><p style={{ fontSize: '0.75rem' }}>Tải ảnh cá nhân</p></div>}
                    <input id="photo-input" type="file" accept="image/*" capture="user" hidden onChange={handlePhotoChange} />
                  </div>
                </div>

                <button disabled={loading} className="btn-submit">{loading ? 'Đang gửi...' : 'GỬI THÔNG TIN'}</button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="form-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Gửi Thành Công!</h2>
              <button onClick={() => { setSubmitted(false); setView('list'); fetchRegistrations(); }} className="btn-submit" style={{ marginTop: '1rem' }}>XEM DANH SÁCH</button>
              <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: '#64748b', marginTop: '1rem', cursor: 'pointer' }}>Quay lại form</button>
            </motion.div>
          )
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="member-list-container">
            
            {/* Class Stats Dashboard */}
            <div className="stats-dashboard">
              <div 
                className={`stat-card ${selectedClass === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedClass('ALL')}
              >
                <div className="stat-value">{registrations.length}</div>
                <div className="stat-label">TỔNG SỐ</div>
              </div>
              {CLASSES.map(cls => {
                const count = registrations.filter(r => r.class_name === cls).length
                return (
                  <div 
                    key={cls} 
                    className={`stat-card ${selectedClass === cls ? 'active' : ''}`}
                    onClick={() => setSelectedClass(cls)}
                  >
                    <div className="stat-value">{count}</div>
                    <div className="stat-label">LỚP {cls}</div>
                  </div>
                )
              })}
            </div>

            <div className="member-grid">
              {registrations
                .filter(reg => selectedClass === 'ALL' || reg.class_name === selectedClass)
                .map((reg) => (
                <div key={reg.id} className="member-card">
                  <div className="member-photo-wrap">
                    {reg.photo ? <img src={reg.photo} alt={reg.full_name} className="member-photo" /> : <div className="member-photo-placeholder">{reg.full_name.charAt(0)}</div>}
                    <div className="member-class-badge">{reg.class_name}</div>
                  </div>
                  <div className="member-info">
                    <h4>{reg.full_name}</h4>
                    <p className="member-industry">{reg.industry}</p>
                    <p className="member-location">📍 {reg.location}</p>
                  </div>
                </div>
              ))}
            </div>
            {registrations.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Chưa có thành viên nào.</div>}
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
                  <img src={capturedImage} alt="Invitation" style={{ width: '100%', borderRadius: '12px' }} />
                  <p style={{ marginTop: '1rem', color: '#166534', fontWeight: 600, fontSize: '0.9rem' }}>✅ Nhấn giữ để lưu ảnh nhé!</p>
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
                      <div style={{ position: 'relative', display: 'inline-block', background: 'white' }}>
                        <QRCodeSVG value="https://20nam.gdo.vn" size={800} style={{ width: '200px', height: '200px' }} level="H" />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px' }}>
                          <img src={logoImg} style={{ width: '100%', height: '100%', mixBlendMode: 'multiply' }} alt="QR Logo" />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>Mã QR đăng ký tham gia</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0072d2', marginTop: '0.5rem' }}>20NAM.GDO.VN</p>
                    </div>
                  </div>
                  <button className="btn-download" onClick={handleDownloadQR} disabled={loading}>{loading ? 'Đang tạo...' : 'XUẤT ẢNH THIỆP'}</button>
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
