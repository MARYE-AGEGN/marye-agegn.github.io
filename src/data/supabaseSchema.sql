-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: DYNAMIC PERSONAL RESEARCH & PROFESSIONAL PLATFORM
-- Author: Marye Agegn
-- Project: marye-agegn.github.io
-- Instructions: Run this script directly in the Supabase SQL Editor
-- ==============================================================================

-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. POSTS / BLOG ARTICLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  reading_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'published'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Index for public query performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts
CREATE POLICY "Public visitors can read published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated admin can manage all posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 2. RESEARCH UPDATES (HIGH-LEVEL MILESTONES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Milestone', 'Presentation', 'Publication', 'Experiment'
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  visibility TEXT DEFAULT 'public', -- 'public', 'private'
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_research_status ON public.research_updates(status, visibility);

ALTER TABLE public.research_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can read published research updates"
  ON public.research_updates FOR SELECT
  USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Authenticated admin can manage all research updates"
  ON public.research_updates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. DOCUMENTS & CV LIBRARY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'CV', 'Resume', 'Presentation', 'Report', 'Certificate'
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'PDF',
  file_size TEXT,
  version TEXT DEFAULT '1.0',
  is_current_cv BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can view published documents"
  ON public.documents FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated admin can manage all documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. MEDIA ITEMS (VIDEO & AUDIO EMBEDS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'video', 'audio', 'image'
  embed_url TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can view published media"
  ON public.media_items FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated admin can manage all media"
  ON public.media_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. CONTACT MESSAGES (INBOUND VISITOR SUBMISSIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  category TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit messages, but CANNOT read anyone else's messages
CREATE POLICY "Public visitors can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can view, mark read, or delete messages
CREATE POLICY "Authenticated admin can view contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 6. COLLABORATION REQUESTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  collaboration_type TEXT NOT NULL,
  website TEXT,
  message TEXT NOT NULL,
  is_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Public can submit collaboration requests
CREATE POLICY "Public visitors can submit collaboration requests"
  ON public.collaboration_requests FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can review collaboration requests
CREATE POLICY "Authenticated admin can view collaboration requests"
  ON public.collaboration_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. SITE CONFIGURATION (DYNAMIC SETTINGS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site config"
  ON public.site_config FOR SELECT
  USING (true);

CREATE POLICY "Authenticated admin can manage site config"
  ON public.site_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
