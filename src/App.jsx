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
  Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8">
      {/* Background Layer - Replace URL with your actual backdrop image */}
      <div 
        className="background-container" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=2070')`,
          opacity: 0.15 
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
                  <Sparkles className="text-blue-500 w-12 h-12" />
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

      {/* Floating QR Link for Testing/Demo */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(!showQR)}
        className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-xl border border-gray-100 hover:text-blue-500"
      >
        <QrCode size={24} />
      </motion.button>

      {showQR && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Quét mã để đăng ký</h3>
            <div className="bg-white p-4 inline-block rounded-xl border-4 border-blue-500">
               {/* Replace with actual domain later */}
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`} alt="QR Code" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Mời bạn bè cùng quét mã!</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
