/*
  # Fix readings table schema

  1. Changes
    - Drop existing readings table if exists
    - Create new readings table with correct schema
    - Add required columns and constraints
    - Enable RLS and add policies
    - Create necessary indexes

  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS readings;

CREATE TABLE readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'reading')),
  spread_type text NOT NULL,
  cards jsonb NOT NULL,
  interpretation jsonb NOT NULL,
  notes text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_created_at CHECK (created_at <= now())
);

-- Enable RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can manage own readings"
  ON readings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for efficient querying
CREATE INDEX readings_user_id_idx ON readings (user_id);
CREATE INDEX readings_created_at_idx ON readings (created_at DESC);
CREATE INDEX readings_type_idx ON readings (type);
CREATE INDEX readings_spread_type_idx ON readings (spread_type);