/*
  # Fix readings table interpretation column

  1. Changes
    - Ensure interpretation column exists and is properly typed
    - Refresh schema cache
    - Add indexes for performance
*/

-- Recreate the readings table with all required columns
CREATE TABLE IF NOT EXISTS readings_new (
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

-- Copy data if old table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'readings') THEN
    INSERT INTO readings_new 
    SELECT * FROM readings;
  END IF;
END $$;

-- Drop old table and rename new one
DROP TABLE IF EXISTS readings;
ALTER TABLE readings_new RENAME TO readings;

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

-- Notify system of schema changes
NOTIFY pgrst, 'reload schema';