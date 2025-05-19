/*
  # Fix Journal Entries Schema

  1. Changes
    - Drop and recreate journal_level enum type
    - Drop and recreate journal_entries table with correct structure
    - Re-enable RLS and add policies
  
  2. Security
    - Enable RLS on journal_entries table
    - Add policies for CRUD operations
    - Only authenticated users can access their own entries
*/

-- Drop existing table and type
DROP TABLE IF EXISTS journal_entries;
DROP TYPE IF EXISTS journal_level;

-- Create enum type
CREATE TYPE journal_level AS ENUM ('INFO', 'WARNING', 'ERROR');

-- Create table with correct structure
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL CHECK (char_length(title) <= 100),
  content text NOT NULL CHECK (content != ''),
  level journal_level NOT NULL,
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