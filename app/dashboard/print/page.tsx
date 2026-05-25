import { createClient } from '@/utils/supabase/server'
import { getImpersonatedUser } from '@/utils/impersonation'
import { redirect } from 'next/navigation'
import { PrintTools } from '@/components/dashboard/print/PrintTools'

export default async function PrintPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) redirect('/auth')

    // Gate access
    const { data: profile } = await supabase
        .from('profiles')
        .select('account_type, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.account_type !== 'gallery') {
        return redirect('/dashboard')
    }

    // Fetch Inventory
    const { data: inventory } = await supabase
        .from('artworks')
        .select(`
            *,
            artist: artists (
                full_name
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

    return <PrintTools inventory={inventory as any[] || []} profileName={profile?.full_name || ''} />
}
