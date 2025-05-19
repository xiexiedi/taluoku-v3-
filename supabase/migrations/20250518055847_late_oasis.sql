/*
  # Create readings and users tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `created_at` (timestamp with timezone)
    
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text, either 'daily' or 'reading')
      - `spread_type` (text)
      - `cards` (jsonb)
      - `notes` (text, nullable)
      - `is_favorite` (boolean)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create readings table
CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'reading')),
  spread_type text NOT NULL,
  cards jsonb NOT NULL,
  notes text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_created_at CHECK (created_at <= now())
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Readings table policies
CREATE POLICY "Users can manage own readings"
  ON readings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX readings_user_id_idx ON readings (user_id);
CREATE INDEX readings_created_at_idx ON readings (created_at DESC);
CREATE INDEX readings_type_idx ON readings (type);