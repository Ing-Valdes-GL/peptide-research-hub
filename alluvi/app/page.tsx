'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ShoppingCart, ArrowRight, FlaskConical, Microscope,
  ShieldCheck, Zap, Award, Star, ChevronDown, Play,
} from 'lucide-react'

// Three.js canvas loads client-only (no SSR)
const SceneCanvas = dynamic(() => import('@/components/SceneCanvas'), { ssr: false })

// ─── Static data ─────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Dr. Sarah K.',   role: 'Research Scientist, MIT',   text: 'Exceptional purity. Every batch verified. Our lab trusts Peptides Research Hub exclusively.', stars: 5 },
  { name: 'Prof. James M.', role: 'Biochemistry, Oxford',       text: 'Seamless logistics and meticulous documentation. Highly recommended for serious research.', stars: 5 },
  { name: 'Dr. Amir P.',    role: 'Clinical Researcher, UCLA',  text: 'Fast delivery, sterile packaging, support that actually understands the science.', stars: 5 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function GlassPanel({ className = '', children, style = {} }: any) {
  return (
    <div
      className={`rounded-3xl border border-white/10 ${className}`}
      style={{ background: 'rgba(6,0,15,0.72)', backdropFilter: 'blur(28px)', ...style }}
    >
      {children}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([])
  const [addedProduct, setAddedProduct] = useState<any | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  // ── Supabase ──
  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).limit(3)
      .then(({ data }) => setProducts(data || []))
  }, [])

  // ── GSAP ScrollTrigger ──────────────────────────────────────────────────────
  useEffect(() => {
    let ctx: any

    const boot = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {

        // ── [0] SMOOTH SCROLL EASE ─────────────────────────────────────────
        // already handled by CSS scroll-behavior smooth + GSAP scrub

        // ── [1] HERO — letters assemble ───────────────────────────────────
        gsap.from('.hero-word', {
          y: 120, opacity: 0, rotateX: -80, skewX: 6,
          stagger: 0.12, duration: 1.4,
          ease: 'expo.out',
          delay: 0.3,
        })
        gsap.from('.hero-sub', {
          y: 40, opacity: 0,
          duration: 1.1, ease: 'expo.out', delay: 0.9,
        })
        gsap.from('.hero-cta', {
          y: 30, opacity: 0,
          duration: 1, ease: 'expo.out', delay: 1.1,
        })
        gsap.from('.hero-badge', {
          scale: 0.6, opacity: 0, y: -20,
          duration: 0.8, ease: 'back.out(2)', delay: 0.2,
        })

        // ── [2] HERO PIN — let Three.js camera travel ─────────────────────
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: '+=180%',
          pin: true,
          pinSpacing: true,
        })

        // ── [3] STATS — count-up + stagger ────────────────────────────────
        gsap.from('.stat-item', {
          y: 80, opacity: 0, scale: 0.85,
          stagger: 0.12, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: '#stats', start: 'top 80%' },
        })

        // ── [4] VIDEO SECTION — split reveal ──────────────────────────────
        gsap.from('.vid-left', {
          x: -100, opacity: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '#vid-section', start: 'top 75%' },
        })
        gsap.from('.vid-right', {
          x: 100, opacity: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '#vid-section', start: 'top 75%' },
        })

        // ── [5] PRODUCTS — depth fly-in from Z ────────────────────────────
        gsap.set('.product-card', { transformPerspective: 1200 })
        gsap.from('.product-card', {
          z: -400, opacity: 0, scale: 0.75, rotateY: 18,
          stagger: 0.1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: '#products', start: 'top 78%' },
        })

        // ── [6] SPOTLIGHT — parallax layers ───────────────────────────────
        gsap.to('.parallax-back', {
          y: -80, ease: 'none',
          scrollTrigger: {
            trigger: '#spotlight',
            start: 'top bottom', end: 'bottom top',
            scrub: 1,
          },
        })
        gsap.to('.parallax-mid', {
          y: -40, ease: 'none',
          scrollTrigger: {
            trigger: '#spotlight',
            start: 'top bottom', end: 'bottom top',
            scrub: 0.6,
          },
        })
        gsap.to('.parallax-front', {
          y: -15, ease: 'none',
          scrollTrigger: {
            trigger: '#spotlight',
            start: 'top bottom', end: 'bottom top',
            scrub: 0.3,
          },
        })
        gsap.from('.spotlight-text > *', {
          y: 60, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: '#spotlight', start: 'top 70%' },
        })

        // ── [7] REVIEWS — horizontal infinite drift ────────────────────────
        gsap.from('.review-card', {
          x: 80, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: '#reviews', start: 'top 80%' },
        })

        // ── [8] PROMO — zoom scale ─────────────────────────────────────────
        gsap.from('.promo-inner', {
          scale: 0.88, opacity: 0, y: 60, duration: 1.3, ease: 'expo.out',
          scrollTrigger: { trigger: '#promo', start: 'top 80%' },
        })

        // ── [9] INFO BAR ──────────────────────────────────────────────────
        gsap.from('.info-item', {
          y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: '#infobar', start: 'top 82%' },
        })

        // ── [10] FINAL CTA — camera rush-in feel ──────────────────────────
        gsap.from('.cta-title span', {
          y: 100, opacity: 0, rotateX: -70,
          stagger: 0.08, duration: 1.5, ease: 'expo.out',
          scrollTrigger: { trigger: '#final-cta', start: 'top 75%' },
        })
        gsap.from('.cta-btn', {
          scale: 0.7, opacity: 0, duration: 1, ease: 'back.out(2)',
          scrollTrigger: { trigger: '#final-cta', start: 'top 65%' },
        })

        // ── [11] FLOATING DEPTH BADGES ────────────────────────────────────
        gsap.from('.depth-badge', {
          z: -200, opacity: 0, scale: 0.5,
          stagger: 0.1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '#hero', start: 'top 20%' },
        })

      }, pageRef)
    }

    boot()
    return () => { if (ctx) ctx.revert() }
  }, [])

  // ── Cart ──
  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const idx = cart.findIndex((i: any) => i.id === product.id)
    if (idx > -1) { cart[idx].quantity += 1 } else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedProduct(product)
    window.dispatchEvent(new Event('storage'))
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div ref={pageRef} className="relative text-white overflow-x-hidden" style={{ background: '#06000F' }}>

      {/* ── THREE.JS CANVAS (always fixed behind everything) ── */}
      <SceneCanvas />

      {/* ── HEADER (z above canvas) ── */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO (pinned for 180vh of scroll travel)
      ════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* Depth fog bottom */}
        <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to top,#06000F,transparent)' }} />

        {/* Depth badge layer — float in front via perspective */}
        <div className="absolute inset-0 pointer-events-none" style={{ perspective: '1200px' }}>
          <div className="depth-badge absolute top-24 left-16 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/30"
            style={{ background: 'rgba(124,58,237,0.12)', backdropFilter: 'blur(16px)', transform: 'translateZ(40px)' }}>
            <FlaskConical size={12} className="text-[#8B5CF6]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#8B5CF6]">ISO 9001 Certified</span>
          </div>
          <div className="depth-badge absolute top-40 right-20 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-[#F43F5E]/30"
            style={{ background: 'rgba(244,63,94,0.1)', backdropFilter: 'blur(16px)', transform: 'translateZ(60px)' }}>
            <ShieldCheck size={12} className="text-[#FB7185]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#FB7185]">99%+ Purity</span>
          </div>
          <div className="depth-badge absolute bottom-32 left-24 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', transform: 'translateZ(30px)' }}>
            <Award size={12} className="text-[#A78BFA]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#A78BFA]">Lab Tested</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10 border border-white/10"
            style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(14px)' }}>
            <FlaskConical size={13} className="text-[#8B5CF6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8B5CF6]">Advanced Peptide Science</span>
          </div>

          {/* H1 — each word gets stagger */}
          <div className="overflow-hidden mb-6" style={{ perspective: '800px' }}>
            <h1 className="text-6xl sm:text-8xl lg:text-[11rem] font-black uppercase leading-[0.82] tracking-[-0.05em]"
              style={{ fontFamily: "'Exo',sans-serif" }}>
              <span className="hero-word inline-block bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">PEPTIDES</span>
              <br />
              <span className="hero-word inline-block bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#FB7185] bg-clip-text text-transparent">RESEARCH</span>
              <br />
              <span className="hero-word inline-block bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">HUB</span>
            </h1>
          </div>

          <p className="hero-sub text-xl text-white/40 font-medium max-w-2xl mx-auto mb-14 leading-relaxed">
            Precision compounds for the world&apos;s most demanding researchers.{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent font-bold">
              99%+ purity, guaranteed.
            </span>
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products"
              className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_25px_70px_rgba(124,58,237,0.5)]"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg,#8B5CF6,#FB7185)' }} />
              <span className="relative flex items-center gap-3">
                Browse Products <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-black uppercase text-sm tracking-[0.15em] border border-white/20 hover:bg-white/5 transition-all duration-300">
              Our Story
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="mt-20 flex flex-col items-center gap-2 opacity-30">
            <p className="text-[9px] font-bold uppercase tracking-widest">Scroll to explore</p>
            <ChevronDown size={16} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — STATS BAR
      ════════════════════════════════════════════════════════ */}
      <section id="stats" className="relative py-24" style={{ zIndex: 10 }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom,transparent,rgba(6,0,15,0.9) 20%,rgba(6,0,15,0.9) 80%,transparent)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '10,000+', label: 'Active Researchers' },
              { val: '99%+',    label: 'Purity Standard' },
              { val: '40+',     label: 'Countries Served' },
              { val: '4,700+',  label: 'Compounds Shipped' },
            ].map(({ val, label }) => (
              <div key={label} className="stat-item text-center">
                <GlassPanel className="py-8 px-4">
                  <p className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent"
                    style={{ fontFamily: "'Exo',sans-serif" }}>
                    {val}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — CINEMATIC VIDEO / IMAGE SPLIT
      ════════════════════════════════════════════════════════ */}
      <section id="vid-section" className="relative py-0 overflow-hidden" style={{ zIndex: 10 }}>
        <div className="min-h-[80vh] flex flex-col lg:flex-row">

          {/* Left — image with deep parallax */}
          <div className="vid-left relative flex-1 overflow-hidden min-h-[50vh] lg:min-h-0"
            style={{ perspective: '1000px' }}>
            {/* Back layer — farthest parallax */}
            <div className="parallax-back absolute inset-0 scale-110"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1579165466991-467135ad3110?auto=format&fit=crop&w=900&q=80)',
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
            {/* Mid layer — overlay tint */}
            <div className="parallax-mid absolute inset-0"
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.55),rgba(244,63,94,0.3))' }} />
            {/* Front layer — text */}
            <div className="parallax-front absolute inset-0 flex flex-col justify-end p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-2">Inside the Lab</p>
              <h2 className="text-4xl font-black uppercase text-white leading-tight"
                style={{ fontFamily: "'Exo',sans-serif" }}>
                Where Molecules<br />
                <span className="bg-gradient-to-r from-[#A78BFA] to-[#FB7185] bg-clip-text text-transparent">
                  Meet Precision
                </span>
              </h2>
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/30 cursor-pointer group hover:scale-110 transition-transform duration-300"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <Play size={28} className="text-white ml-2 group-hover:scale-110 transition-transform" fill="white" />
              </div>
            </div>
          </div>

          {/* Right — second image layer */}
          <div className="vid-right relative flex-1 overflow-hidden min-h-[50vh] lg:min-h-0"
            style={{ perspective: '1000px' }}>
            <div className="parallax-back absolute inset-0 scale-110"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1639772823849-6efbd173043c?auto=format&fit=crop&w=900&q=80)',
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
            <div className="parallax-mid absolute inset-0"
              style={{ background: 'linear-gradient(225deg,rgba(244,63,94,0.5),rgba(124,58,237,0.3))' }} />
            <div className="parallax-front absolute inset-0 flex flex-col justify-end p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 mb-2">ISO 9001</p>
              <h2 className="text-4xl font-black uppercase text-white leading-tight"
                style={{ fontFamily: "'Exo',sans-serif" }}>
                Certified<br />
                <span className="bg-gradient-to-r from-[#FB7185] to-[#A78BFA] bg-clip-text text-transparent">
                  Research Grade
                </span>
              </h2>
            </div>

            {/* Corner badge */}
            <GlassPanel className="absolute top-8 right-8 px-5 py-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Verified</p>
              <p className="text-sm font-black uppercase text-white">COA Available</p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — BEST SELLERS (3D fly-in)
      ════════════════════════════════════════════════════════ */}
      <section id="products" className="relative py-28 overflow-hidden" style={{ zIndex: 10 }}>
        <div className="absolute inset-0"
          style={{ background: 'rgba(6,0,15,0.8)', backdropFilter: 'blur(0px)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B5CF6] mb-3">Our Collection</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white"
              style={{ fontFamily: "'Exo',sans-serif" }}>
              Best Selling Products
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ perspective: '1200px' }}>

            {/* Feature card */}
            <div className="product-card rounded-2xl p-10 flex flex-col justify-end min-h-[460px] relative overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(124,58,237,0.35)]"
              style={{ background: 'linear-gradient(145deg,#7C3AED,#5B21B6)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F43F5E]/25 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(145deg,#8B5CF6,#7C3AED)' }} />
              <div className="absolute top-10 left-10 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
                <img src="/leaf-bg.png" className="w-32" alt="" />
              </div>
              <div className="relative z-10">
                <FlaskConical className="w-8 h-8 text-white/60 mb-6" />
                <h3 className="text-3xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Exo',sans-serif" }}>
                  Peptides<br />Research<br />Hub
                </h3>
              </div>
            </div>

            {products.map((product) => (
              <div key={product.id}
                className="product-card group border border-white/10 rounded-2xl p-6 flex flex-col transition-all duration-500 hover:border-[#7C3AED]/40 hover:shadow-[0_30px_80px_rgba(124,58,237,0.2)] hover:scale-[1.02]"
                style={{ background: 'rgba(6,0,15,0.7)', backdropFilter: 'blur(20px)' }}>
                <div className="aspect-square mb-6 overflow-hidden rounded-xl"
                  style={{ background: 'rgba(124,58,237,0.08)' }}>
                  <img src={product.main_image_url}
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    alt={product.name} />
                </div>
                <p className="text-[#8B5CF6] text-[10px] font-bold uppercase tracking-widest mb-1">
                  {product.category_name || 'Peptide'}
                </p>
                <h4 className="font-bold text-sm mb-4 h-10 text-white/90"
                  style={{ fontFamily: "'Exo',sans-serif" }}>
                  {product.name}
                </h4>
                <p className="font-black text-xl mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
                  £{product.price}
                </p>
                <button onClick={() => addToCart(product)}
                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(124,58,237,0.4)] active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                  <ShoppingCart size={14} /> Add To Cart
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] text-white transition-all hover:scale-105 hover:shadow-[0_15px_50px_rgba(124,58,237,0.35)]"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              View Full Catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — SPOTLIGHT (depth parallax layers)
      ════════════════════════════════════════════════════════ */}
      <section id="spotlight" className="relative py-32 overflow-hidden" style={{ zIndex: 10 }}>
        <div className="absolute inset-0" style={{ background: 'rgba(6,0,15,0.75)' }} />

        {/* Layered depth images */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Farthest layer */}
          <div className="parallax-back absolute inset-0 opacity-20 scale-110"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1920&q=60)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          {/* Mid layer tint */}
          <div className="parallax-mid absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 60% 50%,rgba(124,58,237,0.2),transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">

            {/* Text — parallax-front */}
            <div className="parallax-front spotlight-text lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/30"
                style={{ background: 'rgba(124,58,237,0.12)', backdropFilter: 'blur(12px)' }}>
                <Microscope size={13} className="text-[#8B5CF6]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#8B5CF6]">Research Spotlight</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tighter text-white"
                style={{ fontFamily: "'Exo',sans-serif" }}>
                Retatrutide –<br />Pre-Filled Pen<br />
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
                  Evaluation
                </span>
              </h2>
              <p className="text-white/50 leading-relaxed max-w-lg">
                Part of{' '}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent font-bold">
                  Peptides Research Hub&apos;s
                </span>{' '}
                ongoing research program into advanced GLP-1 multi-agonist compounds. Supplied in controlled batches for laboratory analysis of stability, compound behaviour, and injector system performance.
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/25">
                Not for human or veterinary consumption.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(124,58,237,0.35)]"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                About Store <ArrowRight size={14} />
              </Link>
            </div>

            {/* Product image with depth layers */}
            <div className="lg:w-1/2 relative" style={{ perspective: '1000px' }}>
              {/* Back glow */}
              <div className="parallax-back absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[80px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse,rgba(124,58,237,0.25),rgba(244,63,94,0.1),transparent)' }} />
              {/* Mid decorative ring */}
              <div className="parallax-mid absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full border border-[#7C3AED]/20 animate-spin"
                  style={{ animationDuration: '20s' }} />
                <div className="absolute w-48 h-48 rounded-full border border-[#F43F5E]/15 animate-spin"
                  style={{ animationDuration: '14s', animationDirection: 'reverse' }} />
              </div>
              {/* Product image — front layer */}
              <div className="parallax-front relative z-10 scale-105 lg:translate-x-6">
                <div className="relative rounded-2xl overflow-hidden border border-[#7C3AED]/20 shadow-[0_40px_80px_rgba(124,58,237,0.25)]">
                  <img
                    src="https://images.unsplash.com/photo-1752842350772-2921657e50d7?auto=format&fit=crop&w=600&q=80"
                    alt="Pharmaceutical Research Compounds"
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top,rgba(6,0,15,0.85) 0%,rgba(6,0,15,0.25) 55%,transparent 100%)' }} />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#8B5CF6] mb-1">Research Grade</p>
                    <p className="text-lg font-black uppercase text-white leading-tight"
                      style={{ fontFamily: "'Exo',sans-serif" }}>
                      Precision Peptide<br />Compounds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 6 — PROMO BANNER
      ════════════════════════════════════════════════════════ */}
      <section id="promo" className="py-10 relative" style={{ zIndex: 10 }}>
        <div className="container mx-auto px-6">
          <div className="promo-inner rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[380px] border border-white/5"
            style={{ background: 'rgba(6,0,15,0.9)', backdropFilter: 'blur(20px)' }}>

            <div className="absolute top-0 left-0 w-80 h-80 bg-[#7C3AED]/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#F43F5E]/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex-1 p-12 lg:p-20 z-10 relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B5CF6] mb-4">Limited Time</p>
              <h3 className="text-white text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter"
                style={{ fontFamily: "'Exo',sans-serif" }}>
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

            <div className="flex-1 relative overflow-hidden min-h-[380px] flex items-center justify-center">
              {/* Pharma background image */}
              <div className="absolute inset-0"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1763142843470-9a9e9db7f68f?auto=format&fit=crop&w=800&q=65)',
                  backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22,
                }} />
              {/* Left diagonal mask */}
              <div className="absolute left-0 top-0 bottom-0 w-24 hidden md:block pointer-events-none"
                style={{ background: 'rgba(6,0,15,0.95)', clipPath: 'polygon(0 0,0% 100%,100% 100%)' }} />
              {/* Branded glass panel */}
              <div className="relative z-10 flex flex-col items-center gap-5 p-8 rounded-3xl border border-white/10 mx-8"
                style={{ background: 'rgba(6,0,15,0.65)', backdropFilter: 'blur(24px)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                  <FlaskConical size={28} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-white font-black text-2xl uppercase tracking-tight leading-none"
                    style={{ fontFamily: "'Exo',sans-serif" }}>PEPTIDES</p>
                  <p className="font-black text-2xl uppercase tracking-tight leading-none bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent"
                    style={{ fontFamily: "'Exo',sans-serif" }}>RESEARCH HUB</p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#7C3AED]/30"
                    style={{ background: 'rgba(124,58,237,0.1)' }}>
                    <ShieldCheck size={12} className="text-[#8B5CF6] shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8B5CF6]">ISO 9001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#F43F5E]/30"
                    style={{ background: 'rgba(244,63,94,0.08)' }}>
                    <Award size={12} className="text-[#FB7185] shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#FB7185]">99%+ Purity Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Zap size={12} className="text-[#A78BFA] shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#A78BFA]">Same-Day Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 7 — REVIEWS
      ════════════════════════════════════════════════════════ */}
      <section id="reviews" className="py-28 relative overflow-hidden" style={{ zIndex: 10 }}>
        <div className="absolute inset-0" style={{ background: 'rgba(6,0,15,0.8)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B5CF6] mb-3">Trusted By Scientists</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white"
              style={{ fontFamily: "'Exo',sans-serif" }}>What Researchers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <GlassPanel key={r.name} className="review-card p-8 transition-all duration-300 hover:border-[#7C3AED]/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.15)] hover:-translate-y-2 cursor-default">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: r.stars }).map((_, s) => (
                    <Star key={s} size={13} fill="#8B5CF6" className="text-[#8B5CF6]" />
                  ))}
                </div>
                <p className="text-white/60 leading-relaxed mb-6 italic text-sm">"{r.text}"</p>
                <div>
                  <p className="font-black text-sm uppercase text-white"
                    style={{ fontFamily: "'Exo',sans-serif" }}>{r.name}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{r.role}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 8 — INFO BAR
      ════════════════════════════════════════════════════════ */}
      <section id="infobar" className="py-20 relative" style={{ zIndex: 10 }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(244,63,94,0.06))' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Zap,        title: 'Fastest Delivery',   sub: 'Same-day dispatch before 14:00', color: '#7C3AED' },
              { icon: ShieldCheck, title: 'Quality Products',  sub: '100% Lab Tested & Verified',     color: '#F43F5E' },
              { icon: Award,       title: 'Secure Payments',   sub: 'Encrypted Transaction Data',      color: '#8B5CF6' },
            ].map(({ icon: Icon, title, sub, color }) => (
              <div key={title}
                className="info-item flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${color}20`, border: `2px solid ${color}30`, boxShadow: `0 0 0 0 ${color}40` }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px 4px ${color}30`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${color}40`)}>
                  <Icon style={{ color }} size={26} />
                </div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-wider mb-1 text-white"
                    style={{ fontFamily: "'Exo',sans-serif" }}>{title}</h5>
                  <p className="text-[11px] font-bold text-white/30 uppercase">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 9 — FINAL CTA (camera rush-in effect via Three.js)
      ════════════════════════════════════════════════════════ */}
      <section id="final-cta" className="relative py-40 overflow-hidden" style={{ zIndex: 10 }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom,rgba(6,0,15,0.6),rgba(6,0,15,0.95))' }} />

        {/* Deep photo accent */}
        <div className="absolute inset-0 opacity-8 scale-110"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1562789233-495f52b583dd?auto=format&fit=crop&w=1920&q=40)',
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06,
          }} />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.4em] mb-10 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
            Science. Precision. Innovation.
          </p>

          {/* Title — each word gets depth stagger */}
          <div className="cta-title overflow-hidden mb-10" style={{ perspective: '900px' }}>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-[-0.04em] flex flex-wrap items-center justify-center gap-4"
              style={{ fontFamily: "'Exo',sans-serif" }}>
              <span className="inline-block text-white">PEPTIDES</span>
              <FlaskConical className="w-16 h-16 md:w-24 md:h-24 text-[#8B5CF6]" />
              <span className="inline-block bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
                RESEARCH HUB
              </span>
            </h2>
          </div>

          <h3 className="text-white/60 text-2xl md:text-4xl font-semibold mb-16 tracking-tight max-w-2xl mx-auto"
            style={{ fontFamily: "'Exo',sans-serif" }}>
            Engineered For Research Precision.
          </h3>

          <Link href="/products"
            className="cta-btn group relative inline-flex items-center justify-center px-16 py-6 rounded-xl overflow-hidden text-white font-black uppercase text-sm tracking-[0.15em] border border-white/20 transition-all duration-400 hover:border-[#8B5CF6]/50 hover:shadow-[0_0_60px_rgba(124,58,237,0.4)]">
            <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }} />
            <span className="relative z-10 flex items-center gap-3">
              Shop Peptides Products
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Link>
        </div>

        {/* Fine grid overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      {/* ── FOOTER ── */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* ── CART POPUP ── */}
      {addedProduct && (
        <div className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAddedProduct(null)}>
          <div className="w-full max-w-md rounded-2xl p-8 shadow-2xl text-center border border-white/10"
            style={{ background: 'rgba(6,0,15,0.95)', backdropFilter: 'blur(24px)' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-4 rounded-xl mb-6"
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(244,63,94,0.1))' }}>
              <p className="text-white/60 text-xs font-bold">Product added to cart.</p>
            </div>
            <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-4" alt={addedProduct.name} />
            <h6 className="font-bold text-sm mb-6 text-white"
              style={{ fontFamily: "'Exo',sans-serif" }}>{addedProduct.name}</h6>
            <div className="flex gap-4">
              <button onClick={() => setAddedProduct(null)}
                className="flex-1 text-white py-3 rounded-xl font-black uppercase text-[10px] hover:scale-[1.02] transition-all"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                Continue
              </button>
              <Link href="/cart"
                className="flex-1 bg-white text-[#06000F] py-3 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                Cart <ShoppingCart size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee { 0% { transform:translateX(0) } 100% { transform:translateX(-50%) } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}
