/*
  # Tarot Reading History System

  1. New Tables
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `spread_type` (text)
      - `question` (text, nullable)
      - `cards` (jsonb)
      - `interpretation` (jsonb)
      - `notes` (text, nullable)
      - `is_favorite` (boolean)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Add indexes for common queries
*/

CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  spread_type text NOT NULL,
  question text,
  cards jsonb NOT NULL,
  interpretation jsonb NOT NULL,
  notes text,
  is_favorite boolean DEFAULT false,
  
  CONSTRAINT valid_created_at CHECK (created_at <= now())
);

-- Enable RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own readings"
  ON readings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX readings_user_id_idx ON readings (user_id);
CREATE INDEX readings_created_at_idx ON readings (created_at DESC);
CREATE INDEX readings_spread_type_idx ON readings (spread_type);