-- Drop all RLS policies and tables that depend on auth.users
DROP POLICY IF EXISTS "Users can view their own issues" ON public.issues;
DROP POLICY IF EXISTS "Engineers can view all issues" ON public.issues;
DROP POLICY IF EXISTS "Users can create issues" ON public.issues;
DROP POLICY IF EXISTS "Engineers can update issues" ON public.issues;
DROP POLICY IF EXISTS "Only issue creator can delete their issue" ON public.issues;
DROP POLICY IF EXISTS "Comments are viewable to issue participants" ON public.issue_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.issue_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.issue_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.issue_comments;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Engineers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "System can create profiles on signup" ON public.profiles;

-- Drop tables and types
DROP TABLE IF EXISTS public.issue_comments CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS user_role;

-- Create simple issues table without auth references
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_name TEXT NOT NULL DEFAULT 'User',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL,
  assigned_engineer TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at);

-- Disable RLS for public access (no authentication needed)
ALTER TABLE public.issues DISABLE ROW LEVEL SECURITY;
