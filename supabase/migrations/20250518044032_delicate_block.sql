/*
  # Add readings table

  1. New Tables
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, either 'daily' or 'reading')
      - `timestamp` (timestamptz)
      - `date` (text)
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
    - Add indexes for timestamp, type, and date columns
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
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'readings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'readings' 
    AND policyname = 'Users can manage own readings'
  ) THEN
    CREATE POLICY "Users can manage own readings"
      ON readings
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS readings_timestamp_idx ON readings (timestamp DESC);
CREATE INDEX IF NOT EXISTS readings_type_idx ON readings (type);
CREATE INDEX IF NOT EXISTS readings_date_idx ON readings (date);