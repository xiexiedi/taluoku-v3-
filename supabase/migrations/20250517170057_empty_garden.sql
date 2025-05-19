/*
  # Create journal entries table
  
  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, max 100 chars)
      - `content` (text)
      - `level` (text, enum: INFO, WARNING, ERROR)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on journal_entries table
    - Add policies for authenticated users to manage their own entries
*/

CREATE TYPE journal_level AS ENUM ('INFO', 'WARNING', 'ERROR');

CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL CHECK (char_length(title) <= 100),
  content text NOT NULL CHECK (content != ''),
  level journal_level NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_timestamp CHECK (timestamp <= now())
);

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

-- Create index for timestamp-based sorting
CREATE INDEX journal_entries_timestamp_idx ON journal_entries (timestamp DESC);