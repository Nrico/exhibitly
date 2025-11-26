import { SupabaseClient } from '@supabase/supabase-js'
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

    // Fetch the impersonated user
    // We can't use auth.getUser(id) because that requires service role and returns a User object
    // But for our app purposes, we mostly need the ID and metadata.
    // However, Supabase Auth doesn't let us easily "get" another user object without admin API.
    // BUT, we can just return a mock User object with the ID, or fetch the profile.

    // Actually, for RLS to work with `auth.uid() = user_id`, we need to be careful.
    // RLS checks the JWT. We can't easily forge a JWT for another user without signing it ourselves.
    // BUT, we just updated RLS to allow Admins to access everything!
    // So, we don't need to "become" the user in the database sense.
    // We just need the application code to *think* we are that user.

    // So we return a constructed User object with the impersonated ID.

    return {
        user: {
            ...authUser,
            id: impersonateId,
            email: 'impersonated@example.com', // Placeholder or fetch real email if needed
        },
        isImpersonating: true,
        realUser: authUser
    }
}
