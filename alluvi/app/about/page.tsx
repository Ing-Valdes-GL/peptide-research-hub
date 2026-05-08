'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, FlaskConical, Microscope, Globe, Award, ShieldCheck, Zap, Users, Star, ChevronDown } from 'lucide-react'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const TIMELINE = [
  { year: '2018', title: 'Company Founded', desc: 'Peptides Research Hub launched with a mission to democratize access to high-purity research compounds.' },
  { year: '2020', title: 'ISO Certification', desc: 'Achieved ISO 9001 certification for quality management in pharmaceutical compound handling.' },
  { year: '2022', title: 'Global Expansion', desc: 'Extended operations to 40+ countries with cold-chain logistics and real-time tracking.' },
  { year: '2024', title: '10,000+ Researchers', desc: 'Reached a milestone of 10,000 active research clients across academic and private institutions.' },
]

const VALUES = [
  { icon: FlaskConical, title: 'Lab Precision', desc: 'Every compound is third-party verified with >99% purity standards before dispatch.' },
  { icon: ShieldCheck, title: 'Research Integrity', desc: 'Strict research-only policy. All clients verified for legitimate laboratory use.' },
  { icon: Globe, title: 'Global Network', desc: 'Warehouses and logistics hubs across USA, UK, Canada, Germany, and Australia.' },
  { icon: Zap, title: 'Rapid Dispatch', desc: 'Same-day processing on orders placed before 14:00 with express worldwide shipping.' },
]

export default function AboutPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B] overflow-x-hidden">
      <Header />

      {/* ═══ HERO CINEMATIC ═══ */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">

        {/* Animated gradient background simulating video */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-[#06000F]" />
          <motion.div
            className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[180px]"
            style={{ background: 'rgba(124,58,237,0.2)' }}
            animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ background: 'rgba(244,63,94,0.15)' }}
            animate={{ scale: [1.2, 1, 1.2], x: [20, -20, 20] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Floating molecules illustration */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </motion.div>

        {/* Photo overlay — lab imagery */}
        <div className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1920&q=60)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.12,
          }} />

        <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 border border-white/10"
            style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(12px)' }}
          >
            <Microscope size={14} className="text-[#8B5CF6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5CF6]">Our Story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-[0.85] tracking-[-0.04em] mb-8"
            style={{ fontFamily: "'Exo',sans-serif" }}
          >
            Built For<br />
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#FB7185] bg-clip-text text-transparent">
              Research
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-12"
          >
            Precision compounds. Transparent sourcing. Science you can trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-2"
          >
            <ChevronDown size={20} className="text-white/30 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-20 bg-[#06000F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 10000, suffix: '+', label: 'Active Researchers' },
              { value: 99, suffix: '%', label: 'Purity Standard' },
              { value: 40, suffix: '+', label: 'Countries Served' },
              { value: 4700, suffix: '+', label: 'Compounds Shipped' },
            ].map(({ value, suffix, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent"
                  style={{ fontFamily: "'Exo',sans-serif" }}>
                  <CountUp target={value} suffix={suffix} />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION STATEMENT ═══ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C3AED] mb-4">Our Mission</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight mb-8" style={{ fontFamily: "'Exo',sans-serif" }}>
                Science Without<br />
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent">Compromise</span>
              </h2>
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-600 border-l-4 pl-6 mb-8"
                style={{ borderColor: '#7C3AED' }}>
                "Our mission is to provide the highest purity compounds with absolute transparency. Innovation in healthcare starts with precision in the lab."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wide" style={{ fontFamily: "'Exo',sans-serif" }}>Allen Bryant</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Founder — Peptides Research Hub</p>
                </div>
              </div>
            </motion.div>

            {/* Visual — lab image with overlay */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
              className="relative rounded-3xl overflow-hidden h-[480px] group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] to-[#F43F5E] opacity-100"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1576671414442-fba72f5ebe43?auto=format&fit=crop&w=900&q=70)',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.6),rgba(244,63,94,0.4))' }} />
              <div className="absolute inset-0 flex items-end p-10">
                <div className="text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Our Lab Standard</p>
                  <p className="text-2xl font-black uppercase" style={{ fontFamily: "'Exo',sans-serif" }}>ISO 9001 Certified</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ VALUES GRID ═══ */}
      <section className="py-28" style={{ background: 'linear-gradient(135deg,#F5F3FF,#FFF1F2)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C3AED] mb-4">What Drives Us</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 border border-transparent hover:border-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/10 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(244,63,94,0.1))' }}>
                  <Icon size={26} className="text-[#7C3AED]" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-wide mb-3" style={{ fontFamily: "'Exo',sans-serif" }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="py-28 bg-[#06000F] relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 w-[2px] top-20 bottom-20 bg-gradient-to-b from-[#7C3AED] to-[#F43F5E] opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B5CF6] mb-4">Our Journey</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: "'Exo',sans-serif" }}>Timeline</h2>
          </div>
          <div className="space-y-12 max-w-3xl mx-auto">
            {TIMELINE.map(({ year, title, desc }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-8 items-start ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse text-right'}`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs text-white"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                    {year}
                  </div>
                </div>
                <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-[#7C3AED]/30 transition-all duration-300">
                  <h3 className="font-black text-white text-lg uppercase mb-2" style={{ fontFamily: "'Exo',sans-serif" }}>{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHOTO GALLERY STRIP ═══ */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="flex gap-4 animate-marquee-slow">
          {[
            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&h=400&q=70',
            'https://images.unsplash.com/photo-1576671414442-fba72f5ebe43?auto=format&fit=crop&w=600&h=400&q=70',
            'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&h=400&q=70',
            'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&h=400&q=70',
            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&h=400&q=70',
            'https://images.unsplash.com/photo-1576671414442-fba72f5ebe43?auto=format&fit=crop&w=600&h=400&q=70',
          ].map((src, i) => (
            <div key={i} className="w-[360px] h-[240px] rounded-2xl overflow-hidden shrink-0 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/40 to-[#F43F5E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img src={src} alt="Research lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-28 bg-[#06000F] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(124,58,237,0.25) 0%,rgba(244,63,94,0.12) 60%,transparent 100%)' }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8" style={{ fontFamily: "'Exo',sans-serif" }}>
            Ready to Start<br />
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">Your Research?</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link href="/products"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(124,58,237,0.35)]"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              Browse Products <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-slow { animation: marquee-slow 40s linear infinite; }
      `}</style>
    </div>
  )
}
