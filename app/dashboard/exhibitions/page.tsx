import { getExhibitions } from './actions'
import { ExhibitionsClient } from './exhibitions-client'
import { createClient } from '@/utils/supabase/server'
import { getImpersonatedUser } from '@/utils/impersonation'

export default async function ExhibitionsPage() {
    const exhibitions = await getExhibitions()

    // Fetch all artworks for the curator tool
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    let allArtworks: any[] = []
    if (user) {
        const { data } = await supabase
            .from('artworks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) allArtworks = data
    }

    return <ExhibitionsClient initialExhibitions={exhibitions} allArtworks={allArtworks} />
}
