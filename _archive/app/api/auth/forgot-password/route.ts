import { resend } from '@/lib/resend'
import { PasswordResetEmail } from '@/emails/password-reset'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  
  // Create a Supabase admin client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: user, error: userError } = await supabaseAdmin.from('users').select('id').eq('email', email).single()

  if (userError || !user) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/forgot-password?error=${encodeURIComponent(
        'Could not find a user with that email address.'
      )}`
    )
  }

  const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: email,
  })

  if (linkError) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/forgot-password?error=${encodeURIComponent(
        'Could not generate password reset link.'
      )}`
    )
  }

  const resetLink = data.properties.action_link

  try {
    await resend.emails.send({
      from: 'Exhibitly <no-reply@yourdomain.com>', // Replace with your domain
      to: [email],
      subject: 'Reset your Exhibitly password',
      react: PasswordResetEmail({ resetLink }),
    })
  } catch (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/forgot-password?error=${encodeURIComponent(
        'Could not send password reset email.'
      )}`
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/auth/forgot-password?message=Password reset link sent to your email.`
  )
}
