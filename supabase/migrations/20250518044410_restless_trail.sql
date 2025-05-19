/*
  # Update readings table and policies

  1. Changes
    - Create readings table if it doesn't exist
    - Enable RLS
    - Add policy for authenticated users if it doesn't exist
    - Create indexes for timestamp and type columns
  
  2. Security
    - Enable RLS on readings table
    - Add policy for authenticated users to manage their own readings
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

-- Create policy for authenticated users if it doesn't exist
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

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS readings_timestamp_idx ON readings (timestamp DESC);
CREATE INDEX IF NOT EXISTS readings_type_idx ON readings (type);