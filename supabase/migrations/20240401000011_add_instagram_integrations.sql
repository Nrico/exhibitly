-- Create instagram_integrations table
CREATE TABLE IF NOT EXISTS public.instagram_integrations (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    instagram_username TEXT NOT NULL,
    access_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.instagram_integrations ENABLE ROW LEVEL SECURITY;

-- Policies for instagram_integrations
CREATE POLICY "Users can view their own instagram integrations"
    ON public.instagram_integrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own instagram integrations"
    ON public.instagram_integrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own instagram integrations"
    ON public.instagram_integrations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own instagram integrations"
    ON public.instagram_integrations FOR DELETE
    USING (auth.uid() = user_id);
