'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Fetches the active Instagram integration details for the current user.
 */
export async function getInstagramIntegration() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('instagram_integrations')
        .select('instagram_username, expires_at')
        .eq('user_id', user.id)
        .maybeSingle()

    if (error) {
        console.error('Error fetching Instagram integration:', error)
        return null
    }

    return data
}

/**
 * Disconnects/deletes the Instagram integration for the current user.
 */
export async function disconnectInstagram() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('instagram_integrations')
        .delete()
        .eq('user_id', user.id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/inventory')
    return { success: true }
}

/**
 * Fetches recent Instagram posts, filters out duplicates, parses captions using Gemini AI,
 * and imports them into the artist's inventory as drafts.
 */
export async function syncInstagramFeed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    // Retrieve Meta access token
    const { data: integration, error: intError } = await supabase
        .from('instagram_integrations')
        .select('access_token')
        .eq('user_id', user.id)
        .maybeSingle()

    if (intError || !integration) {
        return { success: false, error: 'Instagram accounts are not connected yet.' }
    }

    try {
        // Fetch posts from Meta Graph API
        const res = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=${integration.access_token}`
        )

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            console.error('Meta Graph API returned an error:', err)
            return { success: false, error: 'Meta Graph API call failed. Reconnect your account.' }
        }

        const feedData = await res.json()
        const posts = feedData.data || []

        if (posts.length === 0) {
            return { success: true, count: 0, message: 'No posts found on Instagram.' }
        }

        // Fetch already imported Instagram post IDs to prevent duplicates
        const { data: existingArtworks, error: existError } = await supabase
            .from('artworks')
            .select('instagram_media_id')
            .eq('user_id', user.id)
            .not('instagram_media_id', 'is', null)

        const existingIds = new Set((existingArtworks || []).map((a: { instagram_media_id: string | null }) => a.instagram_media_id))

        // Focus strictly on standard images or albums, bypassing video syncs if desired
        const newPosts = posts.filter(
            (post: any) =>
                (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') &&
                !existingIds.has(post.id)
        )

        if (newPosts.length === 0) {
            return { success: true, count: 0, message: 'All recent Instagram posts are already synced.' }
        }

        // Setup Gemini Generative AI SDK
        const apiKey = process.env.GEMINI_API_KEY
        let genAI: GoogleGenerativeAI | null = null
        if (apiKey) {
            genAI = new GoogleGenerativeAI(apiKey)
        }

        let importCount = 0

        for (const post of newPosts) {
            const caption = post.caption || ''
            let title = 'Untitled Import'
            let medium = 'Instagram Sync'
            let dimensions = '12 x 12 in'
            let price = null
            let status = 'draft' // Default to draft for editorial review

            // Perform AI caption parsing if Gemini is active
            if (genAI && caption) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: 'gemini-1.5-flash',
                        generationConfig: { responseMimeType: 'application/json' }
                    })

                    const prompt = `
                    Analyze this artwork description caption from Instagram:
                    "${caption}"

                    Extract key parameters using standard English terminology. If a property is not defined or cannot be confidently inferred, set it to null.
                    - title: Short title of the artwork. If missing, generate a concise descriptive title based on context.
                    - medium: Material/medium details (e.g. "Oil on canvas", "Bronze sculpture", "Mixed Media on wood").
                    - width: Width numeric value.
                    - height: Height numeric value.
                    - unit: Dimension unit ("in" or "cm").
                    - price: Numeric price, excluding currency symbols.
                    - is_available: Boolean value of whether this piece is available for sale.

                    Format the output strictly as a JSON object matching this schema:
                    {
                      "title": "artwork title or null",
                      "medium": "artwork medium details or null",
                      "width": number or null,
                      "height": number or null,
                      "unit": "in" | "cm" | null,
                      "price": number or null,
                      "is_available": boolean
                    }
                    `
                    const result = await model.generateContent(prompt)
                    const parsed = JSON.parse(result.response.text().trim())

                    if (parsed.title) title = parsed.title
                    if (parsed.medium) medium = parsed.medium
                    if (parsed.width && parsed.height) {
                        dimensions = `${parsed.height} x ${parsed.width} ${parsed.unit || 'in'}`
                    }
                    if (parsed.price) price = parsed.price
                    if (parsed.is_available === false) {
                        status = 'sold'
                    }
                } catch (parseError) {
                    console.error('Gemini caption extraction failed. Using fallback:', parseError)
                    title = caption.split('\n')[0].substring(0, 40) || 'Untitled Import'
                }
            } else if (caption) {
                // Fallback parser: take first caption line
                title = caption.split('\n')[0].substring(0, 40) || 'Untitled Import'
            }

            // Write record into artworks inventory
            const { error: insertError } = await supabase
                .from('artworks')
                .insert({
                    user_id: user.id,
                    title,
                    description: caption,
                    medium,
                    dimensions,
                    price,
                    status,
                    image_url: post.media_url,
                    instagram_media_id: post.id,
                    created_at: post.timestamp || new Date().toISOString()
                })

            if (!insertError) {
                importCount++
            } else {
                console.error('Failed to save synchronized artwork database row:', insertError)
            }
        }

        revalidatePath('/dashboard/inventory')
        return {
            success: true,
            count: importCount,
            message: `Synchronized ${importCount} new artwork drafts successfully.`
        }

    } catch (e) {
        console.error('Instagram Sync process threw an exception:', e)
        return { success: false, error: 'Database or synchronization connection failed.' }
    }
}
