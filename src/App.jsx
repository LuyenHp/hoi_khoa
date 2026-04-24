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
  Sparkles,
  Download,
  X
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import * as htmlToImage from 'html-to-image'

import backdropImg from './assets/backdrop.png'
import logoImg from './assets/logo.png'




const CLASSES = ['9A', '9B', '9C', '9D', '9E']

export default function App() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    class_name: '',
    industry: '',
    company: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.class_name) {
      alert('Vui lòng chọn lớp của bạn!')
      return
    }
    
    setLoading(true)
    
    const { error } = await supabase
      .from('alumni_registrations')
      .insert([formData])

    if (error) {
      console.error('Lỗi khi gửi dữ liệu:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại sau.')
      setLoading(false)
    } else {
      setLoading(false)
      setSubmitted(true)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0087CD', '#E30613', '#FFFFFF']
      })
    }
  }

  const handleDownloadQR = async () => {
    const element = document.getElementById('qr-card')
    if (element) {
      try {
        // Đợi một chút để QR kịp render ổn định
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const dataUrl = await htmlToImage.toPng(element, { 
          quality: 1.0,
          pixelRatio: 2, // Tăng chất lượng ảnh
        })
        const link = document.createElement('a')
        link.download = 'Thiep-Moi-Hoi-Khoa-20-Nam.png'
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Lỗi khi tải ảnh:', err)
        alert('Không thể tải ảnh, vui lòng thử lại!')
      }
    }
  }


  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8">
      {/* Background Layer - Replace URL with your actual backdrop image */}
      <div 
        className="background-container" 
        style={{ 
          backgroundImage: `url(${backdropImg})`,
          opacity: 1
        }}

      />

      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="premium-card w-full max-w-2xl overflow-hidden"
          >
            {/* Header Area */}
            <div className="bg-gradient-to-r from-blue-500/10 to-red-500/10 p-8 text-center border-b border-white/20">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  <img src={logoImg} alt="Logo" className="w-24 h-24 object-contain shadow-sm rounded-full bg-white p-1" />
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-2 tracking-tight">
                  HỘI KHÓA 20 NĂM
                </h1>
                <p className="script-text">Ngày Trở Về</p>
                <p className="text-gray-500 mt-2 font-medium">Trường THCS Tiên Thắng (2002 - 2006)</p>
              </motion.div>
            </div>

            {/* Form Area */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User size={16} /> Họ và Tên
                  </label>
                  <input 
                    required 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="Nguyễn Văn A" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Phone size={16} /> Số điện thoại
                  </label>
                  <input 
                    required 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="09xx xxx xxx" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin size={16} /> Nơi ở hiện tại
                </label>
                <input 
                  required 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field" 
                  placeholder="Hà Nội, Việt Nam..." 
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Bạn học lớp nào?</label>
                <div className="flex flex-wrap gap-3">
                  {CLASSES.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setFormData({ ...formData, class_name: cls })}
                      className={`class-btn ${formData.class_name === cls ? 'active' : ''}`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase size={16} /> Ngành nghề / Lĩnh vực
                  </label>
                  <input 
                    required 
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="Xây dựng, Giáo dục..." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Building2 size={16} /> Doanh nghiệp / Đơn vị
                  </label>
                  <input 
                    required 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="Tên công ty/đơn vị..." 
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="btn-primary w-full shadow-lg"
              >
                {loading ? 'Đang gửi...' : (
                  <>
                    <Send size={18} />
                    Gửi thông tin tham dự
                  </>
                )}
              </motion.button>
            </form>
            
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 italic">
                \"Chúng mình sẽ hẹn nhau ở 5 - 10 - 20 năm nữa nhé, Bạn của Tôi!\"
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="premium-card p-12 text-center max-w-lg"
          >
            <div className="flex justify-center mb-6">
              <CheckCircle2 size={80} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Gửi thành công!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Cảm ơn bạn vì đã có mặt ở đây để chúng ta cùng nhau sống lại những tháng năm thanh xuân đó. Thật rực rỡ biết bao!
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn-primary"
            >
              Quay lại trang chủ
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating QR Link */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(!showQR)}
        className="fixed bottom-6 right-6 bg-white pl-4 pr-6 py-3 rounded-full shadow-2xl border border-blue-100 font-bold text-blue-600 flex items-center gap-3 z-40 pulse-animation"
      >
        <div className="bg-blue-600 p-2 rounded-full text-white">
          <QrCode size={20} />
        </div>
        <span>Mời bạn bè</span>
      </motion.button>


      {showQR && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setShowQR(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm relative"
            onClick={e => e.stopPropagation()}
          >
            {/* The Downloadable Card */}
            <div 
              id="qr-card" 
              className="rounded-3xl overflow-hidden shadow-2xl relative"
              style={{ backgroundColor: '#ffffff' }}
            >
              {/* Card Background Overlay */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ 
                  backgroundImage: `url(${backdropImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}

              />
              
              <div className="relative p-10 text-center space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-extrabold text-blue-600 tracking-wider">THIỆP MỜI</h3>
                  <div className="h-1 w-16 bg-red-500 mx-auto rounded-full" />
                  <p className="script-text text-4xl">Hội Khóa 20 Năm</p>
                </div>

                <div className="bg-white p-6 inline-block rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-4 border-blue-50/50 mx-auto">
                    <QRCodeSVG 
                      value={window.location.href} 
                      size={200}
                      level={"H"}
                      includeMargin={false}
                      bgColor={"#ffffff"}
                      fgColor={"#1e293b"}
                      imageSettings={{
                        src: logoImg,
                        x: undefined,
                        y: undefined,
                        height: 60,
                        width: 60,
                        excavate: true,
                      }}
                    />
                </div>

                <div className="space-y-3">
                  <p className="text-lg font-bold text-slate-800">Quét mã để đăng ký</p>
                  <div className="px-4 py-2 bg-blue-50 rounded-full inline-block">
                    <p className="text-xs text-blue-600 font-bold tracking-[0.2em] uppercase">20nam.gdo.vn</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                    \"Thanh xuân của chúng ta đẹp nhất<br/>là khi ở bên nhau\"
                  </p>
                </div>
              </div>
            </div>


            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <button 
                onClick={handleDownloadQR}
                className="btn-primary flex-1 py-3"
              >
                <Download size={18} /> Tải ảnh về
              </button>
              <button 
                onClick={() => setShowQR(false)}
                className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/30 transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

