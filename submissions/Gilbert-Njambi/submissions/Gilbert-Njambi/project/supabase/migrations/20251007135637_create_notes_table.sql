/*
  # Create Notes Table

  ## Overview
  This migration sets up the core notes table for the Notes App, enabling users to create,
  read, update, and delete their personal notes.

  ## New Tables
  
  ### `notes`
  - `id` (uuid, primary key) - Unique identifier for each note
  - `title` (text, required) - The title of the note
  - `content` (text, required) - The main content/body of the note
  - `user_id` (uuid, required) - Foreign key to auth.users, tracks note ownership
  - `created_at` (timestamptz) - Timestamp when note was created
  - `updated_at` (timestamptz) - Timestamp when note was last updated

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the notes table to ensure data isolation
  
  ### Policies
  1. **"Users can view own notes"** - SELECT policy
     - Authenticated users can only view their own notes
     - Uses auth.uid() to match user_id
  
  2. **"Users can create own notes"** - INSERT policy
     - Authenticated users can create notes
     - Ensures user_id matches authenticated user
  
  3. **"Users can update own notes"** - UPDATE policy
     - Authenticated users can only update their own notes
     - Validates ownership on both USING and WITH CHECK
  
  4. **"Users can delete own notes"** - DELETE policy
     - Authenticated users can only delete their own notes
     - Validates ownership before deletion

  ## Notes
  - All notes are scoped to individual users
  - Timestamps automatically track creation and modification times
  - Title and content are required fields with basic validation
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) > 0),
  content text NOT NULL DEFAULT '',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notes
CREATE POLICY "Users can view own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own notes
CREATE POLICY "Users can create own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own notes
CREATE POLICY "Users can update own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries on user_id
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

-- Create index for sorting by creation date
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at DESC);