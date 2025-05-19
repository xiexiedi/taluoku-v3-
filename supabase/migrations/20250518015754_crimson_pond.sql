/*
  # Journal Entries Schema Update

  1. New Types
    - `journal_level` enum type for entry importance levels
  
  2. New Tables
    - `journal_entries` table for storing user journal entries
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, max 100 chars)
      - `content` (text, non-empty)
      - `level` (journal_level enum)
      - `created_at` (timestamp with timezone)
  
  3. Security
    - Enable RLS on journal_entries table
    - Add policies for CRUD operations
    
  4. Indexes
    - Add index on created_at for efficient sorting
*/

DO $$ BEGIN
  CREATE TYPE journal_level AS ENUM ('INFO', 'WARNING', 'ERROR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL CHECK (char_length(title) <= 100),
  content text NOT NULL CHECK (content != ''),
  level journal_level NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_created_at CHECK (created_at <= now())
);

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create their own journal entries" ON journal_entries;
  DROP POLICY IF EXISTS "Users can view their own journal entries" ON journal_entries;
  DROP POLICY IF EXISTS "Users can update their own journal entries" ON journal_entries;
  DROP POLICY IF EXISTS "Users can delete their own journal entries" ON journal_entries;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own journal entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own journal entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON journal_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON journal_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing index if it exists
DROP INDEX IF EXISTS journal_entries_created_at_idx;

-- Create index for timestamp-based sorting
CREATE INDEX journal_entries_created_at_idx ON journal_entries (created_at DESC);