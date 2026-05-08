'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Loader2, Send, FlaskConical, Microscope, Dna, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}))

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/orders` },
      })
      if (error) throw error
      setSent(true)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Transmission failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#06000F] text-white overflow-hidden relative flex items-center justify-center">

      {/* ── Ambient globs ── */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#7C3AED]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F43F5E]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Floating particles ── */}
      {mounted && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? '#8B5CF6' : '#FB7185',
          }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Fine grid ── */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* ── Back link ── */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>
      </motion.div>

      {/* ── Decorative icons ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.06 }} transition={{ delay: 0.5 }}
        className="absolute top-16 right-16 hidden md:block">
        <FlaskConical size={120} className="text-[#8B5CF6]" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.04 }} transition={{ delay: 0.8 }}
        className="absolute bottom-16 left-16 hidden md:block">
        <Dna size={100} className="text-[#FB7185]" />
      </motion.div>

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Glass card */}
        <div className="rounded-3xl p-10 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}>
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ fontFamily: "'Exo',sans-serif" }}>Peptides</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Research Hub</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                <h1 className="text-3xl font-black uppercase leading-tight mb-2" style={{ fontFamily: "'Exo',sans-serif" }}>
                  Secure <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FB7185] bg-clip-text text-transparent">Access</span>
                </h1>
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest mb-10">
                  Enter your email — we'll send a magic link
                </p>

                {message.text && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider">
                    {message.text}
                  </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="user@peptidesresearchhub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-white/20 focus:border-[#7C3AED] focus:bg-[#7C3AED]/5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] text-white transition-all hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(124,58,237,0.35)] active:scale-[0.98] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send Magic Link <Send size={14} /></>}
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <ShieldCheck size={16} className="text-[#8B5CF6] shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                    Encrypted OTP — no password required
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="py-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }}
                >
                  <Send size={36} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-black uppercase mb-3" style={{ fontFamily: "'Exo',sans-serif" }}>
                  Link Transmitted
                </h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Check your inbox.<br />The link expires in 10 minutes.
                </p>
                <button onClick={() => setSent(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                  ← Use different email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glow under card */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 rounded-full blur-[40px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg,rgba(124,58,237,0.3),rgba(244,63,94,0.2))' }} />
      </motion.div>
    </div>
  )
}
