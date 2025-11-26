export type Profile = {
    id: string
    full_name: string | null
    avatar_url: string | null
    username: string | null
    email: string | null
    account_type: 'artist' | 'gallery'
}

export type SiteSettings = {
    site_title: string | null
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
    created_at?: string
}

export type Artist = {
    id: string
    user_id: string
    full_name: string
    bio: string | null
    avatar_url: string | null
    created_at: string
}

export type Exhibition = {
    id: string
    user_id: string
    title: string
    description: string | null
    start_date: string | null
    end_date: string | null
    is_featured: boolean
    cover_image_url: string | null
    status: 'draft' | 'published' | 'archived'
    created_at: string
}

export type ExhibitionArtwork = {
    exhibition_id: string
    artwork_id: string
    position: number
    artwork?: Artwork // Optional for joined data
}
