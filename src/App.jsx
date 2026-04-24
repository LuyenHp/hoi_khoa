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
  X,
  ChevronRight
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { QRCodeSVG } from 'qrcode.react'
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
    const { error } = await supabase.from('alumni_registrations').insert([formData])

    if (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại sau.')
      setLoading(false)
    } else {
      setLoading(false)
      setSubmitted(true)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0072d2', '#e6001a', '#FFFFFF']
      })
    }
  }

  const handleDownloadQR = async () => {
    const element = document.getElementById('qr-invitation')
    if (element) {
      try {
        await new Promise(resolve => setTimeout(resolve, 600))
        const dataUrl = await htmlToImage.toPng(element, { 
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#ffffff'
        })
        const link = document.createElement('a')
        link.download = 'Thiep-Moi-Hoi-Khoa.png'
        link.href = dataUrl
        link.click()
      } catch (err) {
        alert('Không thể tải ảnh, vui lòng thử lại!')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-10 bg-[#f8fafc] overflow-x-hidden">
      {/* Dynamic Background */}
      <div 
        className="background-container" 
        style={{ 
          backgroundImage: `url(${backdropImg})`,
          opacity: 0.1,
          filter: 'grayscale(20%)'
        }}
      />
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-card w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] mb-10 mt-10"
          >
            {/* Left Decor Side (Desktop) */}
            <div className="lg:col-span-5 bg-blue-600 relative hidden lg:flex flex-col justify-center p-12 text-white overflow-hidden">
               <div 
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `url(${backdropImg})`, backgroundSize: 'cover' }}
               />
               <div className="relative z-10 space-y-6">
                  <div className="bg-white/20 backdrop-blur-md w-fit p-4 rounded-3xl mb-8">
                    <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain" />
                  </div>
                  <h2 className="text-4xl font-extrabold leading-tight">20 Năm<br/>Ngày Trở Về</h2>
                  <p className="text-blue-100 text-lg">Trường THCS Tiên Thắng<br/>Khóa 2002 - 2006</p>
                  <div className="pt-10 border-t border-white/20">
                    <p className="italic text-sm text-blue-200">\"Thanh xuân của chúng ta đẹp nhất là khi ở bên nhau\"</p>
                  </div>
               </div>
            </div>

            {/* Right Form Side */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12">
              <div className="lg:hidden flex items-center justify-between mb-10">
                <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
                <p className="font-bold text-blue-600 text-sm tracking-widest">HỘI KHÓA 20 NĂM</p>
              </div>

              <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Đăng ký tham dự</h1>
                <p className="text-slate-500 font-medium">Vui lòng điền thông tin của bạn</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Họ và Tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required name="full_name" value={formData.full_name} onChange={handleChange} className="luxury-input w-full pl-12" placeholder="VD: Nguyễn Văn A" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="luxury-input w-full pl-12" placeholder="09xx..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Nơi ở hiện tại</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required name="location" value={formData.location} onChange={handleChange} className="luxury-input w-full pl-12" placeholder="Thành phố bạn đang sống..." />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Lớp của bạn</label>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES.map(cls => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setFormData({ ...formData, class_name: cls })}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                          formData.class_name === cls 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Ngành nghề</label>
                    <input required name="industry" value={formData.industry} onChange={handleChange} className="luxury-input w-full" placeholder="Lĩnh vực công tác..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Đơn vị</label>
                    <input required name="company" value={formData.company} onChange={handleChange} className="luxury-input w-full" placeholder="Tên công ty..." />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="btn-luxury w-full mt-4 flex items-center justify-center gap-3 py-5"
                >
                  {loading ? 'Đang gửi...' : (
                    <>
                      XÁC NHẬN THAM DỰ <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="luxury-card p-12 text-center max-w-lg bg-white"
          >
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Hoàn tất!</h2>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
              Cảm ơn bạn đã đăng ký. Hẹn gặp lại bạn tại buổi Hội khóa rực rỡ nhất!
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-luxury px-10">QUAY LẠI</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(true)}
        className="fixed bottom-10 right-10 fab-button pulse-animation-strong group z-30"
      >
        <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-10" />
        <QrCode className="text-blue-600" size={32} />
      </motion.button>

      {/* Elegant QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl"
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div id="qr-invitation" className="bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 text-center relative border border-slate-100">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-red-500" />
                
                <div className="mb-8">
                  <div className="bg-slate-50 w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-4">
                    <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thư mời hội khóa</h3>
                  <p className="script-text text-3xl mt-1">20 Năm Ngày Trở Về</p>
                </div>

                <div className="relative inline-block bg-white p-6 rounded-[2.5rem] shadow-sm border-2 border-slate-50 mb-8">
                  <QRCodeSVG value={window.location.href} size={200} level="H" bgColor="#ffffff" fgColor="#0f172a" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl p-1 shadow-md border-2 border-slate-50">
                    <img src={logoImg} alt="QR Logo" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="px-4 py-2 bg-blue-100/30 rounded-2xl inline-block">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">20nam.gdo.vn</p>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">Quét mã để đăng ký tham gia cùng bạn bè</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-5 gap-3">
                <button onClick={handleDownloadQR} className="col-span-4 btn-luxury flex items-center justify-center gap-3">
                  <Download size={20} /> TẢI THIỆP MỜI
                </button>
                <button onClick={() => setShowQR(false)} className="col-span-1 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-lg">
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
