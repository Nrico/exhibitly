import { SupabaseClient, User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const IMPERSONATION_COOKIE = 'x-impersonate-id'

export async function getImpersonatedUser(supabase: SupabaseClient) {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()

    if (error || !authUser) {
        return { user: null, isImpersonating: false }
    }

    // Check for impersonation cookie
    const cookieStore = await cookies()
    const impersonateId = cookieStore.get(IMPERSONATION_COOKIE)?.value

    if (!impersonateId) {
        return { user: authUser, isImpersonating: false }
    }

    // Verify the real user is an admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authUser.id)
        .single()

    if (!profile?.is_admin) {
        // Not an admin, ignore the cookie
        return { user: authUser, isImpersonating: false }
    }

    // Fetch target user's profile to populate metadata
    const { data: targetProfile } = await supabase
        .from('profiles')
        .select('account_type, full_name, email')
        .eq('id', impersonateId)
        .single()

    return {
        user: {
            ...authUser,
            id: impersonateId,
            email: targetProfile?.email || 'impersonated@example.com',
            user_metadata: {
                ...authUser.user_metadata,
                account_type: targetProfile?.account_type || 'artist',
                full_name: targetProfile?.full_name || 'Impersonated User',
            }
        } as User,
        isImpersonating: true,
        realUser: authUser
    }
}
