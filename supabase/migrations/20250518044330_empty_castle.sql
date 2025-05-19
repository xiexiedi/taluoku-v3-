/*
  # Create readings table for tarot readings

  1. New Tables
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, either 'daily' or 'reading')
      - `timestamp` (timestamptz)
      - `spreadName` (text)
      - `spreadId` (text)
      - `question` (text, optional)
      - `notes` (text, optional)
      - `cards` (jsonb)
      - `interpretation` (jsonb)

  2. Security
    - Enable RLS on `readings` table
    - Add policy for authenticated users to manage their own readings

  3. Indexes
    - Create index on timestamp for efficient sorting
    - Create index on type for filtering
*/

-- Create the readings table
CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'reading')),
  timestamp timestamptz DEFAULT now(),
  spreadName text NOT NULL,
  spreadId text NOT NULL,
  question text,
  notes text,
  cards jsonb NOT NULL,
  interpretation jsonb NOT NULL,
  
  CONSTRAINT valid_timestamp CHECK (timestamp <= now())
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
CREATE INDEX IF NOT EXISTS readings_timestamp_idx ON readings (timestamp DESC);
CREATE INDEX IF NOT EXISTS readings_type_idx ON readings (type);