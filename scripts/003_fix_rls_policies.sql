-- Remove the overly permissive policy
DROP POLICY IF EXISTS "System can create profiles on signup" ON public.profiles;

-- Keep only the secure policies
-- Users can insert their own profile (for client-side inserts if needed)
-- The trigger will handle automatic profile creation with SECURITY DEFINER

-- Update the profiles table to allow TRIGGER to insert
-- This is handled by the SECURITY DEFINER in the trigger function
