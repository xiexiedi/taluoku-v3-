/*
  # Add type column to readings table

  1. Changes
    - Add `type` column to `readings` table with appropriate constraints
    - Set default value for existing records
    - Add check constraint for valid types
  
  2. Notes
    - The type column will be used to distinguish between different reading types (daily, reading)
    - Existing records will be updated to maintain data consistency
*/

-- Add type column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'readings' AND column_name = 'type'
  ) THEN
    ALTER TABLE readings 
    ADD COLUMN type text NOT NULL DEFAULT 'reading'
    CHECK (type IN ('daily', 'reading'));

    -- Update existing records based on spread_type
    UPDATE readings 
    SET type = 'daily' 
    WHERE spread_type = 'daily';
  END IF;
END $$;