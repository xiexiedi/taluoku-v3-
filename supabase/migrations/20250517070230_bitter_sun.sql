/*
  # Initial schema for Tarot Reading App

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `username` (text, unique)
      - `created_at` (timestamp)
    
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `spread_type` (text)
      - `cards` (jsonb)
      - `notes` (text)
      - `is_favorite` (boolean)
      - `created_at` (timestamp)
    
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `title` (text)
      - `content` (text)
      - `mood` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

-- Create readings table
CREATE TABLE readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  spread_type text NOT NULL,
  cards jsonb NOT NULL,
  notes text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own readings"
  ON readings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create journal entries table
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  mood text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries"
  ON journal_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);