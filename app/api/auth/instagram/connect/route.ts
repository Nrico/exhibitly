import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const clientId = process.env.INSTAGRAM_CLIENT_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${appUrl}/api/auth/instagram/callback`

    if (!clientId) {
        // Safe fallback redirect back to inventory dashboard with config error
        return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=missing_keys`)
    }

    // Instagram Basic Display API OAuth authorize url
    const oauthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=user_profile,user_media&response_type=code`

    return NextResponse.redirect(oauthUrl)
}
