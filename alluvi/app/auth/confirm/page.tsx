'use client'

// Atterrissage du lien email. La vérification se fait au CLIC, pas au chargement :
// les scanners de liens (Outlook SafeLinks, Defender, antivirus d'entreprise) ouvrent les URLs
// avant l'utilisateur et consommeraient le token à usage unique.

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { EmailOtpType } from '@supabase/supabase-js'
import { ArrowRight, Check, FlaskConical, Loader2, TriangleAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { safeNextPath } from '@/lib/site'

const OTP_TYPES: readonly EmailOtpType[] = ['magiclink', 'signup', 'email', 'invite', 'recovery', 'email_change']
const isOtpType = (v: string | null): v is EmailOtpType => !!v && (OTP_TYPES as readonly string[]).includes(v)

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-[#06000F] text-white overflow-hidden relative flex items-center justify-center">
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#7C3AED]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F43F5E]/10 rounded-full blur-[100px] pointer-events-none" />
      <Suspense fallback={null}>
        <ConfirmFlow />
      </Suspense>
    </div>
  )
}

function ConfirmFlow() {
  const router = useRouter()
  const params = useSearchParams()

  const tokenHash = params.get('token_hash')
  const type = params.get('type')
  const next = safeNextPath(params.get('next'))
  const valid = !!tokenHash && isOtpType(type)

  const [status, setStatus] = useState<Status>(valid ? 'idle' : 'error')
  const [error, setError] = useState(valid ? '' : 'This sign-in link is incomplete.')

  const confirm = async () => {
    if (!tokenHash || !isOtpType(type) || status === 'loading') return
    setStatus('loading')
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) {
      setStatus('error')
      setError(/expired|invalid/i.test(error.message) ? 'This link has expired or was already used.' : 'We could not sign you in with this link.')
      return
    }
    setStatus('success')
    setTimeout(() => router.replace(next), 800)
  }

  const btn = 'w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
  const gradient = { background: 'linear-gradient(135deg,#7C3AED,#F43F5E)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-4 rounded-3xl p-10 border border-white/10 text-center"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={status === 'loading' ? 'idle' : status}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 ${status === 'error' ? 'bg-red-500/15 text-red-400' : 'text-white'}`}
            style={status === 'error' ? undefined : gradient}
          >
            {status === 'success' ? <Check size={30} strokeWidth={3} /> : status === 'error' ? <TriangleAlert size={28} /> : <FlaskConical size={28} />}
          </div>

          <h1 className="text-2xl font-black uppercase mb-3" style={{ fontFamily: "'Exo',sans-serif" }}>
            {status === 'success' ? "You're in" : status === 'error' ? 'Link not valid' : 'Confirm sign-in'}
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
            {status === 'success' ? 'Redirecting…' : status === 'error' ? `${error} Request a new code.` : 'One tap to finish signing in.'}
          </p>

          {status === 'error' ? (
            <Link href={`/login?next=${encodeURIComponent(next)}`} className={btn} style={gradient}>
              Get a new code <ArrowRight size={14} />
            </Link>
          ) : status !== 'success' ? (
            <button type="button" onClick={confirm} disabled={status === 'loading'} className={btn} style={gradient}>
              {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <>Continue <ArrowRight size={14} /></>}
            </button>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
