'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, ArrowRight, Zap, ShieldCheck, FlaskConical, Microscope, Award, Star, ChevronDown, Play } from 'lucide-react'

// Floating particles config (stable, server-safe)
const PARTICLES = [
  { x: 15, y: 20, s: 2.5, d: 11, delay: 0 },
  { x: 80, y: 10, s: 1.5, d: 14, delay: 2 },
  { x: 45, y: 75, s: 3, d: 9, delay: 1 },
  { x: 25, y: 55, s: 2, d: 13, delay: 3 },
  { x: 70, y: 40, s: 1.5, d: 12, delay: 0.5 },
  { x: 55, y: 85, s: 2.5, d: 10, delay: 1.5 },
  { x: 90, y: 60, s: 1.5, d: 15, delay: 2.5 },
  { x: 10, y: 90, s: 2, d: 11, delay: 4 },
  { x: 35, y: 30, s: 1.5, d: 8, delay: 0.8 },
  { x: 65, y: 15, s: 2.5, d: 16, delay: 3.5 },
  { x: 5, y: 45, s: 1.5, d: 12, delay: 1.2 },
  { x: 85, y: 80, s: 2, d: 10, delay: 2.8 },
]

const REVIEWS = [
  { name: 'Dr. Sarah K.', role: 'Research Scientist, MIT', text: 'Exceptional purity levels. Every batch consistently verified. Our lab trusts Peptides Research Hub exclusively.', stars: 5 },
  { name: 'Prof. James M.', role: 'Biochemistry, Oxford', text: 'The logistics are seamless and the compound documentation is meticulous. Highly recommended for serious research.', stars: 5 },
  { name: 'Dr. Amir P.', role: 'Clinical Researcher', text: 'Fast delivery, sterile packaging, and a support team that actually understands the science.', stars: 5 },
]

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([])
  const [addedProduct, setAddedProduct] = useState<any | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).limit(3)
      .then(({ data }) => setProducts(data || []))
  }, [])

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const idx = cart.findIndex((i: any) => i.id === product.id)
    if (idx > -1) { cart[idx].quantity += 1 } else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedProduct(product)
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B] overflow-x-hidden">
      <Header />

      {/* ═══════════════════════════════════════════
          HERO — Fullscreen immersive with particles
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative bg-[#06000F] min-h-screen flex items-center justify-center overflow-hidden">

        {/* Parallax bg layer */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* Ambient blobs */}
          <motion.div className="absolute top-1/4 left-1/5 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none"
            style={{ background: 'rgba(124,58,237,0.18)' }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
            style={{ background: 'rgba(244,63,94,0.12)' }}
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute top-3/4 left-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
            style={{ background: 'rgba(139,92,246,0.1)' }}
            animate={{ x: [-30, 30, -30] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

          {/* Photo bg overlay */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1920&q=50)',
              backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07,
            }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        </motion.div>

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: i % 2 === 0 ? '#8B5CF6' : '#FB7185' }}
            animate={{ y: [0, -35, 0], opacity: [0.15, 0.8, 0.15] }}
            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
        ))}

        <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ opacity: heroOpacity }}>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10 border border-white/10"
            style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(12px)' }}>
            <FlaskConical size={13} className="text-[#8B5CF6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8B5CF6]">Advanced Peptide Science</span>
          </motion.div>

          {/* H1 */}
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black text-white uppercase leading-[0.82] tracking-[-0.05em] mb-8"
            style={{ fontFamily: "'Exo',sans-serif" }}>
            PEPTIDES<br />
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#FB7185] bg-clip-text text-transparent">
              RESEARCH
            </span><br />
            HUB
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Precision compounds for the world&apos;s most demanding researchers.
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent font-bold"> 99%+ purity, guaranteed.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(124,58,237,0.4)]"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                Browse Products <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white border border-white/20 hover:bg-white/5 transition-all">
              Learn More
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Scroll</p>
            <ChevronDown size={18} className="text-white/20 animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Arch panels */}
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16,1,0.3,1] }}
          className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 w-[220px] h-[280px] rounded-t-full overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(160deg,#7C3AED,#5B21B6)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <img src="/hero-right-arch.png" className="w-full h-full object-contain p-2 scale-110 drop-shadow-2xl" alt="" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16,1,0.3,1] }}
          className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 w-[220px] h-[280px] rounded-t-full overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(160deg,#F43F5E,#BE185D)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <img src="/hero-left-arch.png" className="w-full h-full object-contain p-2 scale-110 drop-shadow-2xl" alt="" />
        </motion.div>

        {/* Marquee */}
        <div className="absolute bottom-0 w-full py-4 z-20 overflow-hidden border-t border-white/5"
          style={{ background: 'linear-gradient(90deg,rgba(124,58,237,0.9),rgba(244,63,94,0.9))' }}>
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="text-white font-black text-[11px] uppercase tracking-[0.35em] mx-12">
                ★ Fast Shipping on orders above £100 ★ 100% Lab Tested ★ Pure Compounds ★ Peptides Research Hub
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VIDEO / CINEMATIC SECTION
      ═══════════════════════════════════════ */}
      <section className="py-0 relative overflow-hidden">
        <div className="relative h-[70vh] overflow-hidden group">
          {/* Background image simulating video still */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1576671414442-fba72f5ebe43?auto=format&fit=crop&w=1920&q=70)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(6,0,15,0.75),rgba(124,58,237,0.3),rgba(244,63,94,0.2))' }} />

          {/* Animated scan lines effect */}
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)' }}
            animate={{ y: [0, 4, 0] }} transition={{ duration: 0.2, repeat: Infinity }} />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setVideoPlaying(!videoPlaying)}
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 cursor-pointer border-2 border-white/30 hover:border-white transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <Play size={32} className="text-white ml-2" fill="white" />
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-4">Inside Our Labs</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>
                Where Science<br />
                <span className="bg-gradient-to-r from-[#A78BFA] to-[#FB7185] bg-clip-text text-transparent">Meets Precision</span>
              </motion.h2>
            </div>
          </div>

          {/* Corner badge */}
          <div className="absolute bottom-8 right-8 px-5 py-3 rounded-2xl border border-white/10 text-white"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Certified Lab Standards</p>
            <p className="text-sm font-black uppercase">ISO 9001 Verified</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BEST SELLERS
      ═══════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C3AED] mb-3">Our Collection</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>
              Best Selling Products
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Feature card */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-10 flex flex-col justify-end min-h-[460px] relative overflow-hidden group"
              style={{ background: 'linear-gradient(145deg,#7C3AED,#5B21B6)' }}>
              <motion.div className="absolute top-0 right-0 w-48 h-48 bg-[#F43F5E]/20 rounded-full blur-[60px]"
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
              <div className="absolute top-10 left-10 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
                <img src="/leaf-bg.png" className="w-32" alt="" />
              </div>
              <div className="relative z-10">
                <FlaskConical className="w-8 h-8 text-white/60 mb-6" />
                <h3 className="text-3xl font-black text-white leading-tight" style={{ fontFamily: "'Exo',sans-serif" }}>
                  Peptides<br />Research<br />Hub
                </h3>
              </div>
            </motion.div>

            {products.map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16,1,0.3,1] }}
                className="group border border-gray-100 rounded-2xl p-6 flex flex-col hover:shadow-2xl hover:shadow-[#7C3AED]/10 hover:border-[#7C3AED]/20 transition-all duration-300">
                <div className="aspect-square mb-6 overflow-hidden bg-[#FAF5FF] rounded-xl">
                  <img src={product.main_image_url} className="w-full h-full object-contain p-4 group-hover:scale-108 transition-transform duration-500"
                    style={{ transform: 'scale(1)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    alt={product.name} />
                </div>
                <p className="text-[#7C3AED] text-[10px] font-bold uppercase tracking-widest mb-1">{product.category_name || 'Peptide'}</p>
                <h4 className="font-bold text-sm mb-4 h-10" style={{ fontFamily: "'Exo',sans-serif" }}>{product.name}</h4>
                <p className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent font-black text-lg mb-6">£{product.price}</p>
                <button onClick={() => addToCart(product)}
                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                  <ShoppingCart size={14} /> Add To Cart
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] text-white transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(124,58,237,0.3)]"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              View Full Catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RESEARCH SPOTLIGHT + Image
      ═══════════════════════════════════════ */}
      <section className="py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg,#FAF5FF,#FFF1F2)' }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} className="lg:w-1/2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>
                Retatrutide – Pre-Filled Pen<br />Evaluation
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-lg">
                Part of{' '}
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent font-bold">Peptides Research Hub&apos;s</span>{' '}
                ongoing research program into advanced GLP-1 multi-agonist compounds. Supplied in controlled batches for laboratory analysis of stability, compound behaviour, and injector system performance.
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-10">Not for human or veterinary consumption.</p>
              <Link href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                About Store <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} className="lg:w-1/2 relative">
              <div className="relative z-10 scale-110 lg:translate-x-6">
                <img src="/supplement-box.png" alt="Supplement Box" className="w-full drop-shadow-[0_40px_60px_rgba(124,58,237,0.2)]" />
              </div>
              <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-0 rounded-[40%_60%_70%_30%/40%_50%_60%_70%]"
                animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{ background: 'conic-gradient(from 0deg,rgba(124,58,237,0.05),rgba(244,63,94,0.03),transparent)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROMO BANNER
      ═══════════════════════════════════════ */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[380px]"
            style={{ background: '#06000F' }}>
            <motion.div className="absolute top-0 left-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-[80px]"
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} />
            <div className="flex-1 p-12 lg:p-20 z-10 relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B5CF6] mb-4">Limited Offer</p>
              <h3 className="text-white text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>
                No Prep. No Hassle.<br />Just Precision Dosing.
              </h3>
              <p className="text-2xl font-black mb-10 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
                Upto 35% off today!
              </p>
              <Link href="/products"
                className="inline-flex items-center gap-3 border-2 border-white/20 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 w-full h-full min-h-[380px] flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(244,63,94,0.2))' }}>
              <div className="absolute left-0 top-0 bottom-0 w-24 hidden md:block"
                style={{ background: '#06000F', clipPath: 'polygon(0 0,0% 100%,100% 0)' }} />
              <div className="relative z-10 flex flex-col items-center">
                <h4 className="text-white text-5xl font-black opacity-10 absolute -left-16 top-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap"
                  style={{ fontFamily: "'Exo',sans-serif" }}>Peptides Research Hub</h4>
                <img src="/phone-app.png" className="w-48 lg:w-64 drop-shadow-2xl translate-y-8" alt="App Preview" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REVIEWS
      ═══════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C3AED] mb-3">Trusted By Scientists</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>What Researchers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <motion.div key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-[#7C3AED]/8 hover:border-[#7C3AED]/20 transition-all duration-300">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.stars }).map((_, s) => (
                    <Star key={s} size={14} fill="#7C3AED" className="text-[#7C3AED]" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.text}"</p>
                <div>
                  <p className="font-black text-sm uppercase" style={{ fontFamily: "'Exo',sans-serif" }}>{review.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          INFO BAR
      ═══════════════════════════════════════ */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg,#F5F3FF,#FFF1F2)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: 'Fastest Delivery', sub: 'Express shipping worldwide', color: '#7C3AED' },
              { icon: ShieldCheck, title: 'Quality Products', sub: '100% Lab Tested & Verified', color: '#F43F5E' },
              { icon: Award, title: 'Secure Payments', sub: 'Encrypted Transaction Data', color: '#8B5CF6' },
            ].map(({ icon: Icon, title, sub, color }) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 group">
                <motion.div whileHover={{ scale: 1.12 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `2px solid ${color}20` }}>
                  <Icon style={{ color }} size={26} />
                </motion.div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-wider mb-1" style={{ fontFamily: "'Exo',sans-serif" }}>{title}</h5>
                  <p className="text-[11px] font-bold text-black/50 uppercase">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CART POPUP
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {addedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm" onClick={() => setAddedProduct(null)} />
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-[310] rounded-2xl p-8 shadow-2xl text-center">
              <div className="p-4 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg,#F5F3FF,#FFF1F2)' }}>
                <p className="text-gray-600 text-xs font-bold">Product added to cart.</p>
              </div>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-4" alt={addedProduct.name} />
              <h6 className="font-bold text-sm mb-6" style={{ fontFamily: "'Exo',sans-serif" }}>{addedProduct.name}</h6>
              <div className="flex gap-4">
                <button onClick={() => setAddedProduct(null)}
                  className="flex-1 text-white py-3 rounded-xl font-black uppercase text-[10px] hover:scale-[1.02] transition-all"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>Continue</button>
                <Link href="/cart"
                  className="flex-1 bg-[#0A0A0B] text-white py-3 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-colors">
                  Cart <ShoppingCart size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="relative bg-[#06000F] py-36 overflow-hidden border-t border-white/5">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(124,58,237,0.22) 0%,rgba(244,63,94,0.1) 60%,transparent 100%)' }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />

        {/* Photo accent */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=50)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
        <div className="absolute right-0 top-0 w-1/3 h-full"
          style={{ background: 'linear-gradient(90deg,#06000F,transparent)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-bold text-lg mb-8 tracking-tight bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
              Science. Precision. Innovation.
            </motion.p>
            <motion.h2 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="text-white text-5xl md:text-8xl font-black uppercase tracking-[-0.04em] flex flex-wrap items-center justify-center gap-4 mb-10"
              style={{ fontFamily: "'Exo',sans-serif" }}>
              PEPTIDES
              <FlaskConical className="w-16 h-16 md:w-24 md:h-24 text-[#8B5CF6]" />
              RESEARCH HUB
            </motion.h2>
            <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-white text-2xl md:text-4xl font-semibold mb-14 tracking-tight max-w-2xl" style={{ fontFamily: "'Exo',sans-serif" }}>
              Engineered For Research Precision.
            </motion.h3>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Link href="/products"
                className="group relative inline-flex items-center justify-center px-14 py-5 rounded-xl overflow-hidden text-white font-black uppercase text-[12px] tracking-[0.15em] border border-white/20 transition-all hover:border-[#8B5CF6]/50 hover:shadow-[0_0_50px_rgba(124,58,237,0.3)]">
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }} />
                <span className="relative z-10 flex items-center gap-3">
                  Shop Peptides Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-slow { animation: marquee-slow 40s linear infinite; }
      `}</style>
    </div>
  )
}
