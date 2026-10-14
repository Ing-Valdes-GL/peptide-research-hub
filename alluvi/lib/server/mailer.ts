// SERVER ONLY
import { Resend } from 'resend'
import type { EmailContent } from '@/lib/email/login'

let resend: Resend | null = null
const getResend = () => (resend ??= new Resend(process.env.RESEND_API_KEY))

// Domaine vérifié sur Resend (même que les mails de commande). Surchargeable par env.
export const FROM_AUTH = process.env.EMAIL_FROM_AUTH || 'Peptides Research Hub <contact@support.vertexbiolabs.com>'
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@peptidesresearchhub.com'

export async function sendEmail(params: { from: string; to: string; content: EmailContent; tag: string }) {
  const { data, error } = await getResend().emails.send({
    from: params.from,
    to: [params.to],
    replyTo: REPLY_TO,
    subject: params.content.subject,
    html: params.content.html,
    text: params.content.text,
    tags: [{ name: 'category', value: params.tag }],
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  return data
}
