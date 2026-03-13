-- ==============================================================================
-- VITRU IA - Database Fix (Skip ENUM creation, focus on trigger)
-- ==============================================================================

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Ensure profiles table exists (skip if already exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  full_name text,
  role user_role DEFAULT 'ATLETA',
  avatar_url text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 3: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop and recreate policy
DROP POLICY IF EXISTS "Enable all access for authenticated users on profiles" ON public.profiles;

CREATE POLICY "Enable all access for authenticated users on profiles"
ON public.profiles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 5: Create the improved trigger function with better error handling
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
      user_role_value := 'ATLETA'::user_role;
      RAISE LOG 'Invalid role for user %, defaulting to ATLETA', NEW.id;
  END;

  -- Extract full name, default to email username if not provided
  user_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    split_part(NEW.email, '@', 1),
    'Usuário'
  );

  -- Insert into profiles table (update on conflict)
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

  RAISE LOG 'Profile created successfully for user %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    -- Don't block user creation even if profile creation fails
    RETURN NEW;
END;
$$;

-- Step 6: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- Success!
SELECT '✓ Setup completed! Trigger recreated with improved error handling.' AS status;
