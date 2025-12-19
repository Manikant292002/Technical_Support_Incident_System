-- Drop existing tables and policies
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

DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.issue_comments;
DROP TABLE IF EXISTS public.issues;
DROP TYPE IF EXISTS user_role;

-- Simplified issues table - removed user_id foreign key, use generic strings instead
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

-- Simplified comments table - removed user_id foreign key
CREATE TABLE IF NOT EXISTS public.issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  commenter_name TEXT NOT NULL DEFAULT 'Support',
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at);
CREATE INDEX IF NOT EXISTS idx_issue_comments_issue_id ON public.issue_comments(issue_id);

-- Disable RLS - no authentication needed
ALTER TABLE public.issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments DISABLE ROW LEVEL SECURITY;
