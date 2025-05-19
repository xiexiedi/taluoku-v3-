/*
  # Journal entries schema update
  
  1. Changes
    - Add journal_level enum type if not exists
    - Create journal_entries table if not exists
    - Enable RLS and add policies
    - Create index for timestamp-based sorting
  
  2. Security
    - Enable RLS on journal_entries table
    - Add policies for CRUD operations
    - Only authenticated users can access their own entries
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
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_timestamp CHECK (timestamp <= now())
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
DROP INDEX IF EXISTS journal_entries_timestamp_idx;

-- Create index for timestamp-based sorting
CREATE INDEX journal_entries_timestamp_idx ON journal_entries (timestamp DESC);