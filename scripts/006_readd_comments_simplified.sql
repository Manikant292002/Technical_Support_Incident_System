-- Re-add simplified comments table
CREATE TABLE IF NOT EXISTS public.issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT 'User',
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON public.issue_comments(issue_id);

-- Disable RLS
ALTER TABLE public.issue_comments DISABLE ROW LEVEL SECURITY;
