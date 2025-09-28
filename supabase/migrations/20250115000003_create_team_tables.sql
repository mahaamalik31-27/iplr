-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create founders_message table
CREATE TABLE IF NOT EXISTS founders_message (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders_message ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Allow public read access to active team members" ON team_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to team members" ON team_members
  FOR ALL USING (true);

-- Create policies for founders_message
CREATE POLICY "Allow public read access to founders message" ON founders_message
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to founders message" ON founders_message
  FOR ALL USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_team_members_updated_at 
  BEFORE UPDATE ON team_members 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founders_message_updated_at 
  BEFORE UPDATE ON founders_message 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
