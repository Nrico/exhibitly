import { getArtists } from './actions'
import { RosterClient } from './roster-client'
import { createClient } from '@/utils/supabase/server'
import { getImpersonatedUser } from '@/utils/impersonation'
import { redirect } from 'next/navigation'

export default async function RosterPage() {
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

    const artists = await getArtists()

    return <RosterClient initialArtists={artists} />
}
