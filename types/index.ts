export type Profile = {
    id: string
    full_name: string | null
    avatar_url: string | null
    username: string | null
    email: string | null
    account_type: 'artist' | 'gallery'
    subscription_status?: string
}

export type SiteSettings = {
    user_id: string
    site_title: string | null
    site_subtitle: string | null
    site_bio: string | null
    site_bio_long: string | null
    theme: string | null
    custom_domain: string | null
    contact_email: string | null
    phone: string | null
    address: string | null
    social_instagram: string | null
    social_twitter: string | null
    social_facebook: string | null
}

export type Artwork = {
    id: string
    title: string
    medium: string | null
    dimensions: string | null
    price: number | null
    status: string | null
    image_url: string | null
    description: string | null
    collection: string | null
    artist_id?: string | null
    position?: number
    year?: string | null
    created_at?: string
}

export type Artist = {
    id: string
    user_id: string
    full_name: string
    bio: string | null
    avatar_url: string | null
    created_at: string
    artworks?: Artwork[]
}

export type Exhibition = {
    id: string
    user_id: string
    title: string
    start_date: string
    end_date: string
    location: string
    description: string | null
    status: 'draft' | 'published' | 'archived'
    cover_image_url: string | null
    created_at: string
    artworks?: Artwork[]
}

export type ViewingRoom = {
    id: string
    gallery_id: string
    title: string
    slug: string
    status: 'draft' | 'active' | 'archived'
    expires_at: string | null
    created_at: string
    updated_at: string
}

export type RoomItem = {
    id: string
    room_id: string
    artwork_id: string
    is_highlight: boolean
    sort_order: number
    created_at: string
    artwork?: Artwork // For joined queries
}

export type ExhibitionArtwork = {
    exhibition_id: string
    artwork_id: string
    position: number
    artwork?: Artwork // Optional for joined data
}
