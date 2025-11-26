import { createClient } from '@/utils/supabase/server'
import { InventoryClient } from './inventory-client'
import { getImpersonatedUser } from '@/utils/impersonation'

export default async function InventoryPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    let artworks = []

    if (user && user.id !== 'mock-user-id') {
        const { data } = await supabase
            .from('artworks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            artworks = data
        } else {
            console.error('Error fetching artworks:', await supabase.from('artworks').select('*').eq('user_id', user.id).then(res => res.error))
        }
    } else {
        // Fallback for mock user or if DB connection fails/tables don't exist yet
        artworks = [
            {
                id: '1',
                title: 'Untitled Abstract #9',
                dimensions: '24" x 36"',
                collection: null,
                medium: 'Oil on Canvas',
                price: null,
                status: 'draft',
                image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb39279cdb?q=80&w=100'
            },
            {
                id: '2',
                title: 'Study in Blue',
                dimensions: '18" x 18"',
                collection: 'Blue_Period',
                medium: 'Acrylic',
                price: 850,
                status: 'available',
                image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=100'
            }
        ]
    }

    return <InventoryClient initialArtworks={artworks} />
}
