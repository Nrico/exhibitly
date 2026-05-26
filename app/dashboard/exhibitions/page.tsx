import { getExhibitions } from './actions'
import { ExhibitionsClient } from './exhibitions-client'
import { createClient } from '@/utils/supabase/server'
import { getImpersonatedUser } from '@/utils/impersonation'
import { redirect } from 'next/navigation'

export default async function ExhibitionsPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) redirect('/auth')

    const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single()

    if (profile?.account_type !== 'gallery') {
        redirect('/dashboard')
    }

    const exhibitions = await getExhibitions()

    let allArtworks: any[] = []
    const { data } = await supabase
        .from('artworks')
        .select('*, artist:artists(full_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (data) allArtworks = data

    return <ExhibitionsClient initialExhibitions={exhibitions} allArtworks={allArtworks} />
}
