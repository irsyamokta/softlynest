-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- This will DELETE ALL app data permanently.

-- 1. App tables (in dependency order)
TRUNCATE TABLE
  "PostHashtag",
  "Hashtag",
  "Notification",
  "Message",
  "Favorite",
  "Like",
  "Comment",
  "Follow",
  "Post",
  "User"
CASCADE;

-- 2. Delete all active sessions so logged-in users are forced to re-login
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;

-- 3. Delete all Supabase Auth users
-- (Run this separately after the above succeeds)
DELETE FROM auth.users;
