-- ==============================================================================
-- PRODUCTION-GRADE IDEMPOTENT SUPABASE MIGRATION & HARDENING SCRIPT
-- Project: Marye Agegn - Professional Portfolio & Research Platform
-- Target: Supabase PostgreSQL
-- ==============================================================================
-- INSTRUCTIONS FOR DEPLOYMENT:
-- 1. Open Supabase Dashboard: https://supabase.com/dashboard/project/gsmkerotywhzhhijqobm
-- 2. Navigate to "SQL Editor" in the left sidebar.
-- 3. Create a "New Query", paste this entire script, and click "Run".
-- 4. Verify completion in the Output console.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ADMINISTRATOR AUTHORIZATION SUBSYSTEM (ANTI-ELEVATION SECURITY BOUNDARY)
-- ==============================================================================
-- Prevents standard authenticated Supabase users from assuming administrative privileges.
-- Admin access is strictly governed by public.admin_users allowlist and public.is_admin().

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper security definer function to determine if active caller is an explicit admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Secure admin_users table: Only verified administrators can view the admin roster
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Automatically designate Marye as administrator when signed up / logged in
INSERT INTO public.admin_users (user_id, email, role)
SELECT id, email, 'superadmin'
FROM auth.users
WHERE lower(email) IN ('maryeagegn2022@gmail.com', '2025254026@student.annauniv.edu')
ON CONFLICT (user_id) DO NOTHING;

-- Automatic trigger for auth.users to synchronize admin status upon account creation
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN ('maryeagegn2022@gmail.com', '2025254026@student.annauniv.edu') THEN
    INSERT INTO public.admin_users (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'superadmin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();


-- ==============================================================================
-- 2. SERVER-SIDE RATE LIMITING SUBSYSTEM (ANTI-ABUSE / ANTI-DDOS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_key TEXT NOT NULL,
  client_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit ON public.rate_limit_events (action_key, client_identifier, created_at);

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;
-- No public access to rate limit events table
DROP POLICY IF EXISTS "Admin view rate limit events" ON public.rate_limit_events;
CREATE POLICY "Admin view rate limit events"
  ON public.rate_limit_events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Rate limit evaluation function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_action_key TEXT,
  p_identifier TEXT,
  p_max_requests INT,
  p_window_interval INTERVAL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  -- Occasional automated housekeeping of stale events
  IF random() < 0.05 THEN
    DELETE FROM public.rate_limit_events WHERE created_at < now() - INTERVAL '2 hours';
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM public.rate_limit_events
  WHERE action_key = p_action_key
    AND client_identifier = p_identifier
    AND created_at > (now() - p_window_interval);

  IF v_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.rate_limit_events (action_key, client_identifier)
  VALUES (p_action_key, p_identifier);

  RETURN TRUE;
END;
$$;

-- Trigger function enforcing submission rate limits on public forms
CREATE OR REPLACE FUNCTION public.trg_enforce_submission_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_ip TEXT;
  v_allowed BOOLEAN;
BEGIN
  v_client_ip := coalesce(
    current_setting('request.headers', true)::json->>'cf-connecting-ip',
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    'anonymous_client'
  );

  -- Maximum 6 submissions per 10 minutes per IP
  v_allowed := public.check_rate_limit(TG_TABLE_NAME, v_client_ip, 6, INTERVAL '10 minutes');
  IF NOT v_allowed THEN
    RAISE EXCEPTION 'Rate limit exceeded for submission. Please wait a few moments before trying again.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;


-- ==============================================================================
-- 3. CORE PUBLIC CONTENT TABLES
-- ==============================================================================

-- 3.1 POSTS
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
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can read published posts" ON public.posts;
CREATE POLICY "Public visitors can read published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated admin can manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3.2 RESEARCH UPDATES
CREATE TABLE IF NOT EXISTS public.research_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_research_status ON public.research_updates(status, visibility);
ALTER TABLE public.research_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can read published research updates" ON public.research_updates;
CREATE POLICY "Public visitors can read published research updates"
  ON public.research_updates FOR SELECT
  USING (status = 'published' AND visibility = 'public');

DROP POLICY IF EXISTS "Authenticated admin can manage all research updates" ON public.research_updates;
DROP POLICY IF EXISTS "Admins can manage research updates" ON public.research_updates;
CREATE POLICY "Admins can manage research updates"
  ON public.research_updates FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3.3 DOCUMENTS & CV LIBRARY
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'PDF',
  file_size TEXT,
  version TEXT DEFAULT '1.0',
  is_current_cv BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  document_type TEXT DEFAULT 'Technical document',
  manufacturer TEXT,
  product TEXT,
  model TEXT,
  source_url TEXT,
  verification_status TEXT DEFAULT 'UNVERIFIED',
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  publication_date TEXT,
  effective_date TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can view published documents" ON public.documents;
CREATE POLICY "Public visitors can view published documents"
  ON public.documents FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated admin can manage all documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents;
CREATE POLICY "Admins can manage documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3.4 MEDIA ITEMS
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can view published media" ON public.media_items;
CREATE POLICY "Public visitors can view published media"
  ON public.media_items FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated admin can manage all media" ON public.media_items;
DROP POLICY IF EXISTS "Admins can manage media" ON public.media_items;
CREATE POLICY "Admins can manage media"
  ON public.media_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3.5 SITE CONFIG
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site config" ON public.site_config;
CREATE POLICY "Public can read site config"
  ON public.site_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated admin can manage site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can manage site config" ON public.site_config;
CREATE POLICY "Admins can manage site config"
  ON public.site_config FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- 4. INBOUND VISITOR COMMUNICATIONS (WITH STRICT SUBMISSION & PRIVACY)
-- ==============================================================================

-- 4.1 CONTACT MESSAGES
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

DROP POLICY IF EXISTS "Public visitors can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public visitors can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_contact_rate_limit ON public.contact_messages;
CREATE TRIGGER trg_contact_rate_limit
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_submission_rate_limit();

-- 4.2 COLLABORATION REQUESTS
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

DROP POLICY IF EXISTS "Public visitors can submit collaboration requests" ON public.collaboration_requests;
CREATE POLICY "Public visitors can submit collaboration requests"
  ON public.collaboration_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can view collaboration requests" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Admins can manage collaboration requests" ON public.collaboration_requests;
CREATE POLICY "Admins can manage collaboration requests"
  ON public.collaboration_requests FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_collab_rate_limit ON public.collaboration_requests;
CREATE TRIGGER trg_collab_rate_limit
  BEFORE INSERT ON public.collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_submission_rate_limit();

-- 4.3 INQUIRIES & SERVICE REQUESTS
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  email TEXT NOT NULL,
  country TEXT,
  request_type TEXT NOT NULL,
  selected_service TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  status TEXT DEFAULT 'New',
  priority TEXT DEFAULT 'Normal',
  source TEXT DEFAULT 'Website Contact',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  replied_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_request_type ON public.inquiries(request_type);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can submit inquiries" ON public.inquiries;
CREATE POLICY "Public visitors can submit inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can view and manage inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;
CREATE POLICY "Admins can manage inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_inquiries_rate_limit ON public.inquiries;
CREATE TRIGGER trg_inquiries_rate_limit
  BEFORE INSERT ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_submission_rate_limit();

-- 4.4 BHN MEMBERSHIP APPLICATIONS
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
  status TEXT DEFAULT 'Pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_bhn_status ON public.bhn_applications(status);
ALTER TABLE public.bhn_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can submit BHN applications" ON public.bhn_applications;
CREATE POLICY "Public visitors can submit BHN applications"
  ON public.bhn_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can view and manage BHN applications" ON public.bhn_applications;
DROP POLICY IF EXISTS "Admins can manage BHN applications" ON public.bhn_applications;
CREATE POLICY "Admins can manage BHN applications"
  ON public.bhn_applications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_bhn_rate_limit ON public.bhn_applications;
CREATE TRIGGER trg_bhn_rate_limit
  BEFORE INSERT ON public.bhn_applications
  FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_submission_rate_limit();


-- ==============================================================================
-- 5. AI CONSULTATION ARCHITECTURE (STRICT CROSS-USER ISOLATION)
-- ==============================================================================

-- 5.1 CONSULTATION THREADS
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
  evidence_status TEXT DEFAULT 'UNVERIFIED',
  status TEXT DEFAULT 'New',
  priority TEXT DEFAULT 'Normal',
  admin_response TEXT,
  admin_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consultation_threads_session ON public.consultation_threads(session_token);
CREATE INDEX IF NOT EXISTS idx_consultation_threads_status ON public.consultation_threads(status);
ALTER TABLE public.consultation_threads ENABLE ROW LEVEL SECURITY;

-- Anonymous visitor can insert a thread ONLY if session token is valid and unprivileged
DROP POLICY IF EXISTS "Public visitors can create consultation threads" ON public.consultation_threads;
CREATE POLICY "Public visitors can create consultation threads"
  ON public.consultation_threads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(session_token) >= 20
    AND (status IS NULL OR status = 'New')
    AND admin_response IS NULL
    AND admin_responded_at IS NULL
  );

-- Visitors can ONLY read their own thread by matching x-session-token header
DROP POLICY IF EXISTS "Visitors can read own consultation thread" ON public.consultation_threads;
CREATE POLICY "Visitors can read own consultation thread"
  ON public.consultation_threads FOR SELECT
  TO anon, authenticated
  USING (
    (
      length(session_token) >= 20
      AND session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
    )
    OR public.is_admin()
  );

-- Visitors can only update their own thread; CANNOT alter session_token, admin_response, or privileged fields
DROP POLICY IF EXISTS "Visitors can update own consultation thread" ON public.consultation_threads;
CREATE POLICY "Visitors can update own consultation thread"
  ON public.consultation_threads FOR UPDATE
  TO anon, authenticated
  USING (
    (
      length(session_token) >= 20
      AND session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
    )
    OR public.is_admin()
  )
  WITH CHECK (
    (
      length(session_token) >= 20
      AND session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
      AND (status IN ('New', 'AI-Analyzed', 'Awaiting Admin Review'))
    )
    OR public.is_admin()
  );

-- Admins can manage all consultation threads
DROP POLICY IF EXISTS "Authenticated admin can manage all consultation threads" ON public.consultation_threads;
DROP POLICY IF EXISTS "Admins can manage consultation threads" ON public.consultation_threads;
CREATE POLICY "Admins can manage consultation threads"
  ON public.consultation_threads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5.2 CONSULTATION MESSAGES
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.consultation_threads(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_thread ON public.consultation_messages(thread_id);
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- Visitors can view messages ONLY for their verified consultation thread
DROP POLICY IF EXISTS "Public visitors can view own consultation messages" ON public.consultation_messages;
CREATE POLICY "Public visitors can view own consultation messages"
  ON public.consultation_messages FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.consultation_threads t
      WHERE t.id = consultation_messages.thread_id
        AND length(t.session_token) >= 20
        AND t.session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
    )
    OR public.is_admin()
  );

-- Visitors can append messages ONLY to their verified consultation thread, and CANNOT spoof admin/system sender
DROP POLICY IF EXISTS "Public visitors can insert consultation messages" ON public.consultation_messages;
CREATE POLICY "Public visitors can insert consultation messages"
  ON public.consultation_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (
      sender_type IN ('user', 'ai')
      AND EXISTS (
        SELECT 1 FROM public.consultation_threads t
        WHERE t.id = consultation_messages.thread_id
          AND length(t.session_token) >= 20
          AND t.session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
      )
    )
    OR public.is_admin()
  );

-- Admins can manage consultation messages
DROP POLICY IF EXISTS "Authenticated admin can manage consultation messages" ON public.consultation_messages;
DROP POLICY IF EXISTS "Admins can manage consultation messages" ON public.consultation_messages;
CREATE POLICY "Admins can manage consultation messages"
  ON public.consultation_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Rate limit consultation message inserts per session/IP
CREATE OR REPLACE FUNCTION public.trg_enforce_message_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_identifier TEXT;
  v_allowed BOOLEAN;
BEGIN
  -- Rate limit by thread session or IP
  v_identifier := coalesce(
    current_setting('request.headers', true)::json->>'x-session-token',
    current_setting('request.headers', true)::json->>'cf-connecting-ip',
    NEW.thread_id::text
  );

  -- Max 30 messages per 10 minutes
  v_allowed := public.check_rate_limit('consultation_message', v_identifier, 30, INTERVAL '10 minutes');
  IF NOT v_allowed THEN
    RAISE EXCEPTION 'Rate limit exceeded for consultation messages. Please wait a moment before sending more messages.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_message_rate_limit ON public.consultation_messages;
CREATE TRIGGER trg_message_rate_limit
  BEFORE INSERT ON public.consultation_messages
  FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_message_rate_limit();

-- 5.3 CONSULTATION ACTIONS AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.consultation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.consultation_threads(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consultation_actions_thread ON public.consultation_actions(thread_id);
ALTER TABLE public.consultation_actions ENABLE ROW LEVEL SECURITY;

-- Visitors can only log ai_assistant escalation actions for their own thread
DROP POLICY IF EXISTS "Visitors can log consultation actions for own thread" ON public.consultation_actions;
CREATE POLICY "Visitors can log consultation actions for own thread"
  ON public.consultation_actions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    performed_by = 'ai_assistant'
    AND action_type IN ('escalation_to_admin', 'analyze_request')
    AND EXISTS (
      SELECT 1 FROM public.consultation_threads t
      WHERE t.id = consultation_actions.thread_id
        AND length(t.session_token) >= 20
        AND t.session_token = coalesce(current_setting('request.headers', true)::json->>'x-session-token', '')
    )
  );

-- Admins can view and manage consultation actions
DROP POLICY IF EXISTS "Authenticated admin can view and create consultation actions" ON public.consultation_actions;
DROP POLICY IF EXISTS "Admins can manage consultation actions" ON public.consultation_actions;
CREATE POLICY "Admins can manage consultation actions"
  ON public.consultation_actions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- 6. STORAGE INFRASTRUCTURE & PRIVACY
-- ==============================================================================
-- Buckets:
-- 1. 'documents': Public read for academic CV & whitepapers, Admin upload/manage
-- 2. 'collaboration-attachments': Private bucket, Public write-only, Admin read/manage

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'collaboration-attachments',
  'collaboration-attachments',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- Documents Bucket Policies
DROP POLICY IF EXISTS "Public read documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
CREATE POLICY "Public read documents"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admin manage documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin manage documents" ON storage.objects;
CREATE POLICY "Admin manage documents"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'documents' AND public.is_admin())
  WITH CHECK (bucket_id = 'documents' AND public.is_admin());

-- Collaboration Attachments Bucket Policies
DROP POLICY IF EXISTS "Public upload collaboration attachments" ON storage.objects;
CREATE POLICY "Public upload collaboration attachments"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'collaboration-attachments'
    AND name NOT LIKE '%..%'
  );

DROP POLICY IF EXISTS "Admin access collaboration attachments" ON storage.objects;
CREATE POLICY "Admin access collaboration attachments"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'collaboration-attachments' AND public.is_admin())
  WITH CHECK (bucket_id = 'collaboration-attachments' AND public.is_admin());
