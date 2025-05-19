/*
  # Fix journal entries schema

  1. Changes
    - Drop and recreate journal_entries table with correct structure
    - Add proper constraints and indexes
    - Enable RLS and add policies
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS journal_entries;

-- Create journal_entries table with correct structure
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL CHECK (char_length(title) <= 100),
  content text NOT NULL CHECK (content != ''),
  level text NOT NULL CHECK (level IN ('INFO', 'WARNING', 'ERROR')),
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_timestamp CHECK (timestamp <= now())
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create index for timestamp-based sorting
CREATE INDEX journal_entries_timestamp_idx ON journal_entries (timestamp DESC);