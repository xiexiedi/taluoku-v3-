/*
  # Add type column to readings table

  1. Changes
    - Add `type` column to `readings` table
      - Type: TEXT
      - Not nullable
      - Default: 'spread' (for backward compatibility with existing records)
    
  2. Notes
    - The type column will be used to distinguish between different types of readings (e.g., daily, spread)
    - Default value ensures existing records remain valid
*/

ALTER TABLE readings 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'spread';

-- Update existing records to have appropriate type
UPDATE readings 
SET type = spread_type 
WHERE type = 'spread';