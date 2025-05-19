/*
  # Create readings table for tarot readings

  1. New Tables
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text, either 'daily' or 'reading')
      - `spread_type` (text)
      - `cards` (jsonb)
      - `notes` (text, optional)
      - `is_favorite` (boolean)
      - `created_at` (timestamp with timezone)
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
  user_id uuid REFERENCES users NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'reading')),
  spread_type text NOT NULL,
  cards jsonb NOT NULL,
  notes text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  interpretation jsonb NOT NULL,
  
  CONSTRAINT valid_created_at CHECK (created_at <= now())
);

-- Enable RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
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
CREATE INDEX IF NOT EXISTS readings_user_id_idx ON readings (user_id);
CREATE INDEX IF NOT EXISTS readings_created_at_idx ON readings (created_at DESC);
CREATE INDEX IF NOT EXISTS readings_type_idx ON readings (type);