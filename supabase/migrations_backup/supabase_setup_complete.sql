-- ==============================================================================
-- VITRU IA - Complete Database Setup (Safe to run multiple times)
-- ==============================================================================

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create or replace the user_role enum (safe to run multiple times)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ACADEMIA', 'PERSONAL', 'ATLETA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  full_name text,  -- Allow NULL for now
  role user_role DEFAULT 'ATLETA',
  avatar_url text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 4: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies and recreate them
DROP POLICY IF EXISTS "Enable all access for authenticated users on profiles" ON public.profiles;

CREATE POLICY "Enable all access for authenticated users on profiles"
ON public.profiles FOR ALL
TO authenticated
USING (true);

-- Step 6: Create the improved trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role_value user_role;
  user_full_name text;
BEGIN
  -- Extract and validate role from metadata
  BEGIN
    user_role_value := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'ATLETA'::user_role
    );
  EXCEPTION
    WHEN invalid_text_representation THEN
      -- If role is invalid, default to ATLETA
      user_role_value := 'ATLETA'::user_role;
      RAISE WARNING 'Invalid role provided for user %, defaulting to ATLETA', NEW.id;
  END;

  -- Extract full name, default to email username if not provided
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1),
    'Usuário'
  );

  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_role_value,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Error in handle_new_user for user %: % %', NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Step 7: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Database setup completed successfully!';
  RAISE NOTICE '✓ Profiles table ready';
  RAISE NOTICE '✓ Trigger configured';
  RAISE NOTICE '✓ Permissions granted';
END $$;
