import { SupabaseClient } from '@supabase/supabase-js'

export const PLAN_LIMITS = {
    free: {
        artworks: 20,
        artists: 4,
        exhibitions: 3,
    },
    active: {
        artworks: Infinity,
        artists: Infinity,
        exhibitions: Infinity,
    }
}

export type ResourceType = 'artworks' | 'artists' | 'exhibitions'

export async function checkLimit(supabase: SupabaseClient, userId: string, resource: ResourceType): Promise<{ allowed: boolean; count: number; limit: number }> {
    // 1. Get user's subscription status
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userId)
        .single()

    const status = (profile?.subscription_status || 'free') as keyof typeof PLAN_LIMITS
    const limit = PLAN_LIMITS[status]?.[resource] ?? PLAN_LIMITS.free[resource]

    // If limit is infinite, no need to count
    if (limit === Infinity) {
        return { allowed: true, count: 0, limit }
    }

    // 2. Count current usage
    const { count, error } = await supabase
        .from(resource)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (error) {
        console.error(`Error checking limit for ${resource}:`, error)
        // Fail safe: allow if error? Or block? Let's block to be safe, or allow to be nice.
        // Blocking prevents abuse.
        return { allowed: false, count: 0, limit }
    }

    const currentCount = count || 0

    return {
        allowed: currentCount < limit,
        count: currentCount,
        limit
    }
}

export async function getUsage(supabase: SupabaseClient, userId: string) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userId)
        .single()

    const status = (profile?.subscription_status || 'free') as keyof typeof PLAN_LIMITS

    const [artworks, artists, exhibitions] = await Promise.all([
        supabase.from('artworks').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('artists').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('exhibitions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ])

    return {
        status,
        usage: {
            artworks: artworks.count || 0,
            artists: artists.count || 0,
            exhibitions: exhibitions.count || 0,
        },
        limits: PLAN_LIMITS[status] || PLAN_LIMITS.free
    }
}
