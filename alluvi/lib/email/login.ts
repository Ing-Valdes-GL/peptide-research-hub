// Mail de connexion. Délivrabilité : version texte, un seul domaine de lien, pas d'image,
// pas de vocabulaire médical/pharma (filtres anti-spam).

export interface EmailContent {
  subject: string
  html: string
  text: string
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function loginEmail({ link, code }: { link: string; code: string }): EmailContent {
  const safeLink = escapeHtml(link)
  const spacedCode = escapeHtml(code.split('').join(' '))
  return {
    subject: `Your sign-in code: ${code}`,
    text: [
      'Sign in to your Peptides Research Hub account',
      '',
      `Your code: ${code}`,
      '',
      'Or open this link on the same device:',
      link,
      '',
      'The code and link expire in 1 hour and can be used once.',
      "If you didn't request this, you can ignore this email.",
    ].join('\n'),
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">Your sign-in code is ${escapeHtml(code)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1d1d1f;">
<tr><td style="padding:32px 36px 0;font-size:15px;font-weight:700;letter-spacing:-0.02em;">Peptides <span style="color:#7C3AED;">Research Hub</span></td></tr>
<tr><td style="padding:24px 36px 32px;font-size:15px;line-height:1.6;">
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;letter-spacing:-0.03em;">Sign in to your account</h1>
<p style="margin:0 0 24px;color:#6e6e73;">Enter this code on the sign-in page:</p>
<p style="margin:0 0 28px;padding:18px 0;background:#f5f5f7;border-radius:14px;text-align:center;font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:30px;font-weight:700;letter-spacing:0.3em;color:#1d1d1f;">${spacedCode}</p>
<p style="margin:0 0 16px;color:#6e6e73;">Or sign in with one click:</p>
<p style="margin:0 0 28px;"><a href="${safeLink}" style="display:inline-block;padding:14px 28px;border-radius:980px;background:#1d1d1f;color:#ffffff;text-decoration:none;font-weight:600;">Sign in</a></p>
<p style="margin:0;font-size:13px;color:#86868b;">The code and link expire in 1 hour and work once. If you didn't request this, ignore this email.</p>
</td></tr>
<tr><td style="padding:20px 36px;border-top:1px solid #eeeeef;font-size:12px;line-height:1.5;color:#86868b;">Peptides Research Hub · United Kingdom</td></tr>
</table>
</td></tr></table>
</body></html>`,
  }
}
