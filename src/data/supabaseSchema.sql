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

-- ------------------------------------------------------------------------------
-- 8. UNIFIED INQUIRIES & SERVICE REQUESTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  email TEXT NOT NULL,
  country TEXT,
  request_type TEXT NOT NULL, -- 'Professional service', 'Academic research collaboration', 'Biomedical engineering consultation', etc.
  selected_service TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  status TEXT DEFAULT 'New', -- 'New', 'In Review', 'Contacted', 'In Progress', 'Completed', 'Archived'
  priority TEXT DEFAULT 'Normal', -- 'Low', 'Normal', 'High', 'Urgent'
  source TEXT DEFAULT 'Website Contact',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  replied_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_request_type ON public.inquiries(request_type);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit inquiries, but CANNOT read or query any inquiries
CREATE POLICY "Public visitors can submit inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can view, update status, and manage inquiries
CREATE POLICY "Authenticated admin can view and manage inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. BHN MEMBERSHIP APPLICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bhn_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  country TEXT,
  background TEXT,
  areas_of_interest TEXT[] DEFAULT '{}',
  statement_of_interest TEXT,
  profile_url TEXT,
  message TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Active', 'Declined', 'Archived'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bhn_status ON public.bhn_applications(status);

ALTER TABLE public.bhn_applications ENABLE ROW LEVEL SECURITY;

-- Public can submit BHN applications, but CANNOT view member lists
CREATE POLICY "Public visitors can submit BHN applications"
  ON public.bhn_applications FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can view, approve, decline, or update status
CREATE POLICY "Authenticated admin can view and manage BHN applications"
  ON public.bhn_applications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 10. STORAGE BUCKETS & RLS POLICIES
-- ------------------------------------------------------------------------------
-- Bucket 'documents': Public read for published documents/CV, Authenticated write
-- Bucket 'collaboration-attachments': Authenticated read/download, Public upload

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('collaboration-attachments', 'collaboration-attachments', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Public can download and read files in the 'documents' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read documents bucket'
  ) THEN
    CREATE POLICY "Public read documents bucket"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'documents');
  END IF;
END $$;

-- Only authenticated administrator can upload, update, or delete in 'documents'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin manage documents bucket'
  ) THEN
    CREATE POLICY "Admin manage documents bucket"
      ON storage.objects FOR ALL
      TO authenticated
      USING (bucket_id = 'documents')
      WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

-- Public can upload proposal attachments during submission into 'collaboration-attachments'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public upload collaboration attachments'
  ) THEN
    CREATE POLICY "Public upload collaboration attachments"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'collaboration-attachments');
  END IF;
END $$;

-- Only authenticated admin can view and download private collaboration attachments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin access collaboration attachments'
  ) THEN
    CREATE POLICY "Admin access collaboration attachments"
      ON storage.objects FOR ALL
      TO authenticated
      USING (bucket_id = 'collaboration-attachments')
      WITH CHECK (bucket_id = 'collaboration-attachments');
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 11. TECHNICAL DOCUMENT METADATA EXTENSIONS
-- ------------------------------------------------------------------------------
ALTER TABLE public.documents 
  ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'Technical document',
  ADD COLUMN IF NOT EXISTS manufacturer TEXT,
  ADD COLUMN IF NOT EXISTS product TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'UNVERIFIED',
  ADD COLUMN IF NOT EXISTS verified_by TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS publication_date TEXT,
  ADD COLUMN IF NOT EXISTS effective_date TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- ------------------------------------------------------------------------------
-- 12. AI CONSULTATION THREADS (TECHNICAL REQUESTS & ESCALATIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  user_name TEXT,
  email TEXT,
  organization TEXT,
  request_category TEXT,
  detected_intent TEXT,
  technical_domain TEXT,
  requested_equipment TEXT,
  user_objective TEXT,
  conversation_summary TEXT,
  important_requirements JSONB DEFAULT '[]',
  questions_raised JSONB DEFAULT '[]',
  relevant_services TEXT[] DEFAULT '{}',
  recommended_service TEXT,
  retrieved_sources JSONB DEFAULT '[]',
  evidence_status TEXT DEFAULT 'UNVERIFIED', -- 'VERIFIED — PRIMARY SOURCE', 'SUPPORTED — SECONDARY SOURCE', 'UNVERIFIED', 'CONFLICTING SOURCES', 'NOT FOUND'
  status TEXT DEFAULT 'New', -- 'New', 'AI-Analyzed', 'Awaiting Admin Review', 'Admin Responded', 'Awaiting User', 'Resolved', 'Archived'
  priority TEXT DEFAULT 'Normal', -- 'Low', 'Normal', 'High', 'Urgent'
  admin_response TEXT,
  admin_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultation_threads_session ON public.consultation_threads(session_token);
CREATE INDEX IF NOT EXISTS idx_consultation_threads_status ON public.consultation_threads(status);

ALTER TABLE public.consultation_threads ENABLE ROW LEVEL SECURITY;

-- Public visitors can insert their own thread
CREATE POLICY "Public visitors can create consultation threads"
  ON public.consultation_threads FOR INSERT
  WITH CHECK (true);

-- Visitors can only read their own thread using their valid session token
CREATE POLICY "Visitors can read own consultation thread"
  ON public.consultation_threads FOR SELECT
  USING (
    session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
  );

-- Visitors can update their own consultation thread (e.g. for escalation)
CREATE POLICY "Visitors can update own consultation thread"
  ON public.consultation_threads FOR UPDATE
  USING (
    session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
  )
  WITH CHECK (
    session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
  );

-- Authenticated administrator can view, analyze, update, and manage all threads
CREATE POLICY "Authenticated admin can manage all consultation threads"
  ON public.consultation_threads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 13. CONSULTATION MESSAGES (MULTI-TURN DIALOGUE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.consultation_threads(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- 'user', 'ai', 'admin', 'system'
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- sources, evidence tags, suggested actions, structured specs
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultation_messages_thread ON public.consultation_messages(thread_id);

ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- Public can append messages only to their own active consultation thread
CREATE POLICY "Public visitors can insert consultation messages"
  ON public.consultation_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.consultation_threads t
      WHERE t.id = consultation_messages.thread_id
        AND t.session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
    )
  );

-- Public can read messages ONLY for their own consultation thread
CREATE POLICY "Public visitors can view own consultation messages"
  ON public.consultation_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.consultation_threads t
      WHERE t.id = consultation_messages.thread_id
        AND t.session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
    )
  );

-- Authenticated admin has unrestricted management of consultation messages
CREATE POLICY "Authenticated admin can manage consultation messages"
  ON public.consultation_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 14. CONSULTATION ACTIONS & INVESTIGATION AUDIT LOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.consultation_threads(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'analyze_request', 'search_sources', 'draft_response', 'send_response', 'status_change'
  performed_by TEXT NOT NULL, -- 'ai_assistant', 'admin', 'system'
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultation_actions_thread ON public.consultation_actions(thread_id);

ALTER TABLE public.consultation_actions ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin can view and create consultation action audit logs
CREATE POLICY "Authenticated admin can view and create consultation actions"
  ON public.consultation_actions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

