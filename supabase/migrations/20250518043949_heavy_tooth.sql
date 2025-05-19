/*
  # Add readings table

  1. New Tables
    - `readings`
      - `id` (uuid, primary key)
      - `type` (text, either 'daily' or 'reading')
      - `timestamp` (timestamptz)
      - `date` (text)
      - `spreadName` (text)
      - `spreadId` (text)
      - `question` (text, nullable)
      - `notes` (text, nullable)
      - `cards` (jsonb)
      - `interpretation` (jsonb)

  2. Security
    - Enable RLS on `readings` table
    - Add policies for authenticated users to manage their own readings
*/

CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('daily', 'reading')),
  timestamp timestamptz DEFAULT now(),
  date text NOT NULL,
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

-- Create policies
CREATE POLICY "Users can manage own readings"
  ON readings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for timestamp-based sorting
CREATE INDEX readings_timestamp_idx ON readings (timestamp DESC);
CREATE INDEX readings_type_idx ON readings (type);
CREATE INDEX readings_date_idx ON readings (date);