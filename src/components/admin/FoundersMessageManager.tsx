import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, MessageSquare } from "lucide-react";

interface FoundersMessage {
  id: string;
  message: string;
  updated_at: string;
}

const FoundersMessageManager = () => {
  const [foundersMessage, setFoundersMessage] = useState<FoundersMessage | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
      <CardContent className="space-y-4">
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

        {foundersMessage && (
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(foundersMessage.updated_at).toLocaleString()}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={saveFoundersMessage}
            disabled={isSaving || !message.trim()}
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
