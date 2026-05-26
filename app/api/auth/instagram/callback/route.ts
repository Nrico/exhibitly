import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (errorParam || !code) {
        console.error('Instagram OAuth error or code missing:', errorParam)
        return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=oauth_denied`)
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const clientId = process.env.INSTAGRAM_CLIENT_ID
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
    const redirectUri = `${appUrl}/api/auth/instagram/callback`

    if (!clientId || !clientSecret) {
        return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=missing_keys`)
    }

    try {
        // 1. Exchange OAuth code for a short-lived token
        const tokenFormData = new FormData()
        tokenFormData.append('client_id', clientId)
        tokenFormData.append('client_secret', clientSecret)
        tokenFormData.append('grant_type', 'authorization_code')
        tokenFormData.append('redirect_uri', redirectUri)
        tokenFormData.append('code', code)

        const shortLivedRes = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: tokenFormData,
        })

        if (!shortLivedRes.ok) {
            const errBody = await shortLivedRes.json().catch(() => ({}))
            console.error('Failed to exchange short-lived token:', errBody)
            return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=token_exchange_failed`)
        }

        const shortLivedData = await shortLivedRes.json()
        const shortLivedToken = shortLivedData.access_token

        // 2. Exchange short-lived token for long-lived token (60 days)
        const longLivedRes = await fetch(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortLivedToken}`
        )

        if (!longLivedRes.ok) {
            const errBody = await longLivedRes.json().catch(() => ({}))
            console.error('Failed to swap long-lived token:', errBody)
            return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=long_lived_exchange_failed`)
        }

        const longLivedData = await longLivedRes.json()
        const longLivedToken = longLivedData.access_token
        const expiresIn = longLivedData.expires_in // seconds (usually ~5184000 for 60 days)

        // Calculate expires_at timestamp
        const expiresAt = expiresIn
            ? new Date(Date.now() + expiresIn * 1000).toISOString()
            : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

        // 3. Query the user's username
        const profileRes = await fetch(
            `https://graph.instagram.com/me?fields=id,username&access_token=${longLivedToken}`
        )

        let instagramUsername = 'connected_user'
        if (profileRes.ok) {
            const profileData = await profileRes.json()
            instagramUsername = profileData.username
        }

        // 4. Save to public.instagram_integrations using upsert
        const { error: dbError } = await supabase
            .from('instagram_integrations')
            .upsert({
                user_id: user.id,
                instagram_username: instagramUsername,
                access_token: longLivedToken,
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            })

        if (dbError) {
            console.error('Database error saving Instagram connection:', dbError)
            return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=database_save_failed`)
        }

        return NextResponse.redirect(`${appUrl}/dashboard/inventory?sync=connected`)
    } catch (e) {
        console.error('OAuth Callback network exception:', e)
        return NextResponse.redirect(`${appUrl}/dashboard/inventory?error=network_failure`)
    }
}
