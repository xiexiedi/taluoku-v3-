/*
  # Database Schema Setup

  1. Tables
    - users: Stores user profiles linked to auth.users
    - readings: Stores tarot card readings with user references

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for readings management

  3. Indexes
    - Add indexes for common query patterns
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create readings table if it doesn't exist
CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'reading')),
  spread_type text NOT NULL,
  cards jsonb NOT NULL,
  notes text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_created_at CHECK (created_at <= now())
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Users table policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Readings table policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'readings' AND policyname = 'Users can manage own readings'
  ) THEN
    CREATE POLICY "Users can manage own readings"
      ON readings
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'readings' AND indexname = 'readings_user_id_idx'
  ) THEN
    CREATE INDEX readings_user_id_idx ON readings (user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'readings' AND indexname = 'readings_created_at_idx'
  ) THEN
    CREATE INDEX readings_created_at_idx ON readings (created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'readings' AND indexname = 'readings_type_idx'
  ) THEN
    CREATE INDEX readings_type_idx ON readings (type);
  END IF;
END $$;