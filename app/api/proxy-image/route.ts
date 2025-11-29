import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 })
    }

    // Security: Only allow fetching from known domains
    const allowedDomains = ['exhibitly.co', 'r2.dev', 'images.unsplash.com', 'supabase.co']
    const urlObj = new URL(url)
    const isAllowed = allowedDomains.some(domain => urlObj.hostname.endsWith(domain))

    if (!isAllowed) {
        return new NextResponse('Forbidden domain', { status: 403 })
    }

    try {
        const response = await fetch(url)
        if (!response.ok) {
            return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status })
        }

        const blob = await response.blob()
        const headers = new Headers()
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg')
        headers.set('Cache-Control', 'public, max-age=3600')

        return new NextResponse(blob, { headers })
    } catch (error) {
        console.error('Proxy Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
