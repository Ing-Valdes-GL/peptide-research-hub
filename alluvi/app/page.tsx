'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, ArrowRight, X, Smartphone, Zap, ShieldCheck, FlaskConical, Microscope, Award } from 'lucide-react'

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addedProduct, setAddedProduct] = useState<any | null>(null)

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(3)
      setProducts(data || [])
      setLoading(false)
    }
    loadProducts()
  }, [])

  const addToCart = (product: any) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = currentCart.find((item: any) => item.id === product.id)
    if (existingItem) { existingItem.quantity += 1 }
    else { currentCart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(currentCart))
    setAddedProduct(product)
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B]">
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#06000F] min-h-[88vh] flex items-center justify-center overflow-hidden">

        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F43F5E]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Fine dot grid */}
        <div className="absolute inset-0 z-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-between gap-8">

          {/* LEFT ARCH */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative w-[260px] h-[320px] rounded-t-full overflow-hidden flex-shrink-0"
            style={{ background: 'linear-gradient(160deg, #7C3AED, #5B21B6)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
            <img src="/hero-right-arch.png" className="w-full h-full object-contain p-2 scale-110 z-10 relative drop-shadow-2xl" alt="" />
          </motion.div>

          {/* CENTER BLOCK */}
          <div className="flex flex-col items-center text-center flex-grow px-6">

            {/* Glass badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full mb-8 border border-white/10"
              style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(12px)' }}
            >
              <FlaskConical size={14} className="text-[#8B5CF6]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5CF6]">Advanced Peptide Science</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.85] tracking-[-0.05em] uppercase mb-6"
              style={{ fontFamily: "'Exo', sans-serif" }}
            >
              PEPTIDES<br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#FB7185] bg-clip-text text-transparent">
                RESEARCH
              </span>
              <br />HUB
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg md:text-xl text-gray-400 font-medium tracking-tight mb-12 max-w-lg"
            >
              Advancing Science with{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent font-bold">
                Precision Peptide Innovation
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(124,58,237,0.4)]"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  Browse All Products
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT ARCH */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative w-[260px] h-[320px] rounded-t-full overflow-hidden flex-shrink-0"
            style={{ background: 'linear-gradient(160deg, #F43F5E, #BE185D)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
            <img src="/hero-left-arch.png" className="w-full h-full object-contain p-2 scale-110 z-10 relative drop-shadow-2xl" alt="" />
          </motion.div>
        </div>

        {/* MARQUEE */}
        <div className="absolute bottom-0 w-full py-4 z-20 overflow-hidden border-t border-white/5"
          style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.9), rgba(244,63,94,0.9))' }}>
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="text-white font-black text-[11px] uppercase tracking-[0.35em] mx-12">
                ★ Fast Shipping on orders above £100 ★ 100% Lab Tested ★ Pure Compounds ★ Peptides Research Hub
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BEST SELLERS ═══ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7C3AED] mb-3">Our Collection</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Exo', sans-serif" }}>
              Best Selling Products
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Feature card */}
            <div className="rounded-2xl p-10 flex flex-col justify-end min-h-[460px] relative overflow-hidden group"
              style={{ background: 'linear-gradient(145deg, #7C3AED, #5B21B6)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F43F5E]/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute top-10 left-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <img src="/leaf-bg.png" className="w-32" alt="" />
              </div>
              <div className="relative z-10">
                <FlaskConical className="w-8 h-8 text-white/60 mb-6" />
                <h3 className="text-3xl font-black text-white leading-tight" style={{ fontFamily: "'Exo', sans-serif" }}>
                  Peptides<br />Research<br />Hub
                </h3>
              </div>
            </div>

            {products.map((product) => (
              <div key={product.id} className="group border border-gray-100 rounded-2xl p-6 flex flex-col hover:shadow-2xl hover:shadow-[#7C3AED]/10 hover:border-[#7C3AED]/20 transition-all duration-300">
                <div className="aspect-square mb-6 overflow-hidden bg-[#FAF5FF] rounded-xl">
                  <img src={product.main_image_url} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                </div>
                <p className="text-[#7C3AED] text-[10px] font-bold uppercase tracking-widest mb-1">{product.category_name || 'Peptide'}</p>
                <h4 className="font-bold text-sm mb-4 h-10" style={{ fontFamily: "'Exo', sans-serif" }}>{product.name}</h4>
                <p className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent font-black text-lg mb-6">£{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full border-2 border-[#7C3AED]/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-all duration-300"
                >
                  <ShoppingCart size={14} /> Add To Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH SPOTLIGHT ═══ */}
      <section className="py-24 bg-[#FAF5FF] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-violet-200"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}>
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter" style={{ fontFamily: "'Exo', sans-serif" }}>
                Retatrutide – Pre-Filled Pen<br />Evaluation
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-lg">
                Part of{' '}
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent font-bold">
                  Peptides Research Hub&apos;s
                </span>{' '}
                ongoing research program into advanced GLP-1 multi-agonist compounds. This formulation is supplied in controlled batches for laboratory analysis of stability, compound behaviour, and injector system performance.
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-10">Not for human or veterinary consumption.</p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(124,58,237,0.3)]"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
              >
                About Store <ArrowRight size={14} />
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 scale-110 lg:translate-x-10">
                <img src="/supplement-box.png" alt="Supplement Box" className="w-full drop-shadow-[0_35px_35px_rgba(124,58,237,0.2)]" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-0 rounded-[40%_60%_70%_30%/40%_50%_60%_70%] animate-pulse"
                style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROMO BANNER ═══ */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[380px]"
            style={{ background: '#06000F' }}>

            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex-1 p-12 lg:p-20 z-10 relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B5CF6] mb-4">Limited Offer</p>
              <h3 className="text-white text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter" style={{ fontFamily: "'Exo', sans-serif" }}>
                No Prep. No Hassle.<br />Just Precision Dosing.
              </h3>
              <p className="text-2xl font-black mb-10 bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">
                Upto 35% off today!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 border-2 border-white/20 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex-1 w-full h-full min-h-[380px] flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(244,63,94,0.2))' }}>
              <div className="absolute left-0 top-0 bottom-0 w-24 hidden md:block"
                style={{ background: '#06000F', clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
              <div className="relative z-10 flex flex-col items-center">
                <h4 className="text-white text-6xl font-black opacity-10 absolute -left-16 top-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap"
                  style={{ fontFamily: "'Exo', sans-serif" }}>
                  Peptides Research Hub
                </h4>
                <img src="/phone-app.png" className="w-48 lg:w-64 drop-shadow-2xl translate-y-8" alt="App Preview" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INFO BAR ═══ */}
      <section className="py-20 mt-10" style={{ background: 'linear-gradient(135deg, #F5F3FF, #FFF1F2)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: 'Fastest Delivery', sub: 'Express shipping worldwide', color: '#7C3AED' },
              { icon: ShieldCheck, title: 'Quality Products', sub: '100% Lab Tested & Verified', color: '#F43F5E' },
              { icon: Award, title: 'Secure Payments', sub: 'Encrypted Transaction Data', color: '#8B5CF6' },
            ].map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}15`, border: `2px solid ${color}20` }}>
                  <Icon style={{ color }} size={26} />
                </div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-wider mb-1" style={{ fontFamily: "'Exo', sans-serif" }}>{title}</h5>
                  <p className="text-[11px] font-bold text-black/50 uppercase">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CART POPUP ═══ */}
      <AnimatePresence>
        {addedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm" onClick={() => setAddedProduct(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-[310] rounded-2xl p-8 shadow-2xl text-center">
              <div className="p-4 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, #F5F3FF, #FFF1F2)' }}>
                <p className="text-gray-600 text-xs font-bold">Product added to cart.</p>
              </div>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-4" alt={addedProduct.name} />
              <h6 className="font-bold text-sm mb-6" style={{ fontFamily: "'Exo', sans-serif" }}>{addedProduct.name}</h6>
              <div className="flex gap-4">
                <button onClick={() => setAddedProduct(null)}
                  className="flex-1 text-white py-3 rounded-xl font-black uppercase text-[10px] transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}>
                  Continue
                </button>
                <Link href="/cart"
                  className="flex-1 bg-[#0A0A0B] text-white py-3 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-colors">
                  Cart <ShoppingCart size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative bg-[#06000F] py-32 overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, rgba(244,63,94,0.1) 60%, transparent 100%)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bold text-lg md:text-xl mb-8 tracking-tight bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent"
            >
              Science. Precision. Innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-[-0.04em] flex flex-wrap items-center justify-center gap-3"
                style={{ fontFamily: "'Exo', sans-serif" }}>
                PEPTIDES
                <FlaskConical className="w-14 h-14 md:w-20 md:h-20 text-[#8B5CF6]" />
                RESEARCH HUB
              </h2>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white text-3xl md:text-5xl font-semibold mb-12 tracking-tight leading-tight max-w-3xl"
              style={{ fontFamily: "'Exo', sans-serif" }}
            >
              Engineered For Research Precision.
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-12 py-4 rounded-xl overflow-hidden text-white font-bold uppercase text-[12px] tracking-[0.15em] border border-white/20 transition-all duration-300 hover:border-[#8B5CF6]/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]"
              >
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }} />
                <span className="relative z-10 flex items-center gap-3">
                  Shop Peptides Products
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  )
}
