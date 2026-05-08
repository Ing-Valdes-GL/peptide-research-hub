'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, CheckCircle2, Percent, ArrowRight, Shield, FlaskConical, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [addedItemName, setAddedItemName] = useState('')
  const [filterPromo, setFilterPromo] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase.from('categories').select('*')
      setCategories(catData || [])
      const { data: prodData } = await supabase.from('products').select('*')
      setProducts(prodData || [])
    }
    fetchData()
  }, [])

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0))
    }
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cart-updated', updateCartCount)
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [])

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const idx = cart.findIndex((i: any) => i.id === product.id)
    if (idx > -1) { cart[idx].quantity += 1 } else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAddedItemName(product.name)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  let displayed = products.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchPromo = filterPromo ? p.on_sale === true : true
    const matchCat = activeCategory ? p.category_id === activeCategory || p.category_name === activeCategory : true
    return matchSearch && matchPromo && matchCat
  })

  if (sortBy === 'price_asc') displayed = [...displayed].sort((a, b) => a.price - b.price)
  if (sortBy === 'price_desc') displayed = [...displayed].sort((a, b) => b.price - a.price)

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B] flex flex-col">
      <Header />

      {/* ── Marquee ── */}
      <div className="py-3 overflow-hidden border-b border-white/5 relative z-10"
        style={{ background: 'linear-gradient(90deg,rgba(124,58,237,0.9),rgba(244,63,94,0.9))' }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-white text-[10px] font-black uppercase tracking-[0.3em] mx-12">
              ★ Free Shipping on orders above £100 ★ 100% Lab Tested ★ Pure Compounds ★ Peptides Research Hub
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero header ── */}
      <section className="relative bg-[#06000F] py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#F43F5E]/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 border border-white/10"
                style={{ background: 'rgba(124,58,237,0.15)' }}>
                <FlaskConical size={12} className="text-[#8B5CF6]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#8B5CF6]">Research Catalogue</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: "'Exo',sans-serif" }}>
                All Products
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-white/40 text-sm mt-2">
                {displayed.length} compound{displayed.length !== 1 ? 's' : ''} available
              </motion.p>
            </div>

            {/* Search */}
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              onSubmit={(e) => { e.preventDefault() }}
              className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-3 flex-1 md:w-[340px] bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus-within:border-[#7C3AED] transition-colors">
                <Search size={16} className="text-white/30" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search compounds..."
                  className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-white/20"
                />
                {searchValue && (
                  <button type="button" onClick={() => setSearchValue('')}><X size={14} className="text-white/30 hover:text-white" /></button>
                )}
              </div>
              <button type="button" onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${showFilters ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A78BFA]' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}>
                <SlidersHorizontal size={14} />
              </button>
            </motion.form>
          </div>

          {/* Filter bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex flex-wrap gap-3 overflow-hidden">
                {/* Promo toggle */}
                <button onClick={() => setFilterPromo(!filterPromo)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${filterPromo ? 'border-[#F43F5E] bg-[#F43F5E]/20 text-[#FB7185]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}>
                  <Percent size={12} /> On Sale
                </button>
                {/* Sort */}
                {(['default', 'price_asc', 'price_desc'] as const).map((s) => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${sortBy === s ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A78BFA]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}>
                    {s === 'default' ? 'Default' : s === 'price_asc' ? 'Price ↑' : 'Price ↓'}
                  </button>
                ))}
                {/* Category pills */}
                <button onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${!activeCategory ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A78BFA]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}>
                  All
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${activeCategory === cat.name ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A78BFA]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}>
                    {cat.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Products grid ── */}
      <main className="container mx-auto px-6 py-16 flex-grow">
        <AnimatePresence mode="wait">
          {displayed.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-32">
              <FlaskConical size={64} className="mx-auto text-gray-200 mb-6" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No compounds found</p>
              <button onClick={() => { setSearchValue(''); setActiveCategory(null); setFilterPromo(false) }}
                className="mt-6 text-[#7C3AED] text-xs font-black uppercase tracking-widest hover:underline">
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayed.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-[#7C3AED]/10 hover:border-[#7C3AED]/20 transition-all duration-300"
                >
                  {product.on_sale && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                      style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
                      Sale
                    </div>
                  )}

                  <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-[#FAF5FF] flex items-center justify-center p-6">
                    <img
                      src={product.main_image_url}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                      style={{ transform: 'scale(1)' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(124,58,237,0.05)' }}>
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#7C3AED] flex items-center gap-2">
                        View Details <ArrowRight size={10} />
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={10} className="text-[#7C3AED] shrink-0" />
                      <p className="text-[#7C3AED] text-[9px] font-black uppercase tracking-widest">
                        {product.category_name || 'Research Compound'}
                      </p>
                    </div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-black text-sm uppercase mb-3 leading-tight group-hover:text-[#7C3AED] transition-colors"
                        style={{ fontFamily: "'Exo',sans-serif" }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <p className="font-black text-xl bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent">
                        £{product.price}
                      </p>
                      <button
                        onClick={(e) => addToCart(e, product)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#7C3AED]/25 active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}
                      >
                        <ShoppingCart size={12} />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Cart popup toast ── */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-white/10"
            style={{ background: 'rgba(6,0,15,0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div className="flex-grow">
              <p className="text-[9px] uppercase font-black tracking-widest text-white/40">Added to cart</p>
              <p className="text-sm font-bold text-white truncate">{addedItemName}</p>
            </div>
            <Link href="/cart" className="text-[#A78BFA] text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              Cart →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  )
}
