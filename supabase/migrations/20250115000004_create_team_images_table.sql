-- Create team_member_images table for storing team member profile images
CREATE TABLE IF NOT EXISTS team_member_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_member_images_name ON team_member_images(name);

-- Enable Row Level Security
ALTER TABLE team_member_images ENABLE ROW LEVEL SECURITY;

-- Create policies for team_member_images
CREATE POLICY "Allow public read access to team member images" ON team_member_images
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to team member images" ON team_member_images
  FOR ALL USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_team_member_images_updated_at 
  BEFORE UPDATE ON team_member_images 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
