# Supabase Setup Documentation

This document outlines the database schema and security policies setup for the Shape V2 application.

## 1. Tables

### `profiles`
Stores public profile information for all users.
- `id`: UUID (Primary Key, Foreign Key to `auth.users.id`)
- `email`: Text
- `full_name`: Text
- `role`: Text ('ACADEMIA', 'PERSONAL', 'ATLETA')
- `avatar_url`: Text (Optional)
- `created_at`: Timestamp

### `assessments`
Stores physical assessments.
- `id`: UUID (Primary Key)
- `athlete_id`: UUID (Foreign Key to `profiles.id`)
- `professional_id`: UUID (Foreign Key to `profiles.id`, optional)
- `date`: Timestamp
- `weight`: Numeric
- `height`: Numeric
- `age`: Integer
- `gender`: Text
- `measurements`: JSONB (Stores all circumference measurements)
- `results`: JSONB (Stores calculated results like body fat,score, etc.)
- `created_at`: Timestamp

### `user_associations`
Manages relationships between academies, personals, and athletes.
- `id`: UUID
- `academy_id`: UUID (FK to `profiles`)
- `personal_id`: UUID (FK to `profiles`)
- `athlete_id`: UUID (FK to `profiles`)
- `status`: Text ('ACTIVE', 'PENDING', 'INACTIVE')

## 2. Automation (Triggers)

### `handle_new_user`
Automatically creates a `public.profiles` entry when a new user signs up via Supabase Auth.
```sql
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 3. Security (RLS)
Basic policies enable read/write access for authenticated users.
*Note: These should be refined for production to restrict access based on user roles and associations.*

## 4. Next Steps for Data Migration
1. Update `dataStore.ts` to fetch and write to these tables.
2. Replace local mock data with real data from `useDataStore`.
