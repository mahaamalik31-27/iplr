-- Add image support to founders_message table
ALTER TABLE founders_message ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE founders_message ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Update the comment to reflect the new columns
COMMENT ON COLUMN founders_message.image_url IS 'URL of the founders message image';
COMMENT ON COLUMN founders_message.image_alt IS 'Alt text for the founders message image';
