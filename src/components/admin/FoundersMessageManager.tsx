import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, MessageSquare, Upload, X, Image as ImageIcon } from "lucide-react";

interface FoundersMessage {
  id: string;
  message: string;
  image_url: string | null;
  image_alt: string | null;
  updated_at: string;
}

const FoundersMessageManager = () => {
  const [foundersMessage, setFoundersMessage] = useState<FoundersMessage | null>(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchFoundersMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('founders_message')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      if (data) {
        setFoundersMessage(data);
        setMessage(data.message);
        setImageUrl(data.image_url || "");
        setImageAlt(data.image_alt || "");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch founders message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveFoundersMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      if (foundersMessage) {
        // Update existing message
        const { error } = await supabase
          .from('founders_message')
          .update({ 
            message: message.trim(),
            image_url: imageUrl.trim() || null,
            image_alt: imageAlt.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', foundersMessage.id);

        if (error) throw error;
      } else {
        // Create new message
        const { error } = await supabase
          .from('founders_message')
          .insert([{
            message: message.trim(),
            image_url: imageUrl.trim() || null,
            image_alt: imageAlt.trim() || null,
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Founders message saved successfully",
      });

      fetchFoundersMessage();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save founders message",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `founders-message-${Date.now()}.${fileExt}`;
      const filePath = `founders-message/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      setImageAlt(file.name);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setImageAlt("");
  };

  useEffect(() => {
    fetchFoundersMessage();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/5"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Founders Message
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage the founders message that appears on the about page
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Message Content
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the founders message..."
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This message will be displayed in the founders section on the about page
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Founders Image (Optional)
            </label>
            
            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="max-w-full h-64 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Alt Text
                  </label>
                  <Input
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Describe the image for accessibility..."
                    className="text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a founders image (optional)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Choose Image"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Max 5MB. JPG, PNG, GIF supported.
                </p>
              </div>
            )}
          </div>
        </div>

        {foundersMessage && (
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(foundersMessage.updated_at).toLocaleString()}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={saveFoundersMessage}
            disabled={isSaving || !message.trim() || isUploading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoundersMessageManager;
