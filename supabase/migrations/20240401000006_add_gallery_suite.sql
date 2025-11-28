-- Create viewing_rooms table
CREATE TABLE IF NOT EXISTS viewing_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'archived'
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_items table
CREATE TABLE IF NOT EXISTS room_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES viewing_rooms(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    is_highlight BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE viewing_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_items ENABLE ROW LEVEL SECURITY;

-- Policies for viewing_rooms
CREATE POLICY "Galleries can view their own rooms" ON viewing_rooms
    FOR SELECT USING (auth.uid() = gallery_id);

CREATE POLICY "Galleries can insert their own rooms" ON viewing_rooms
    FOR INSERT WITH CHECK (auth.uid() = gallery_id);

CREATE POLICY "Galleries can update their own rooms" ON viewing_rooms
    FOR UPDATE USING (auth.uid() = gallery_id);

CREATE POLICY "Galleries can delete their own rooms" ON viewing_rooms
    FOR DELETE USING (auth.uid() = gallery_id);

-- Public access for active rooms via slug (handled in app logic, but policy allows read if needed)
CREATE POLICY "Public can view active rooms" ON viewing_rooms
    FOR SELECT USING (status = 'active' AND (expires_at IS NULL OR expires_at > NOW()));


-- Policies for room_items
CREATE POLICY "Galleries can manage items in their rooms" ON room_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM viewing_rooms
            WHERE viewing_rooms.id = room_items.room_id
            AND viewing_rooms.gallery_id = auth.uid()
        )
    );

CREATE POLICY "Public can view items in active rooms" ON room_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM viewing_rooms
            WHERE viewing_rooms.id = room_items.room_id
            AND viewing_rooms.status = 'active'
            AND (viewing_rooms.expires_at IS NULL OR viewing_rooms.expires_at > NOW())
        )
    );
