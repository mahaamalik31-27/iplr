import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Edit, Trash2, Save, X, Plus, User } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const TeamManager = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `team-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error("Failed to upload image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const saveTeamMember = async (memberData: Partial<TeamMember>) => {
    try {
      setIsUploading(true);
      let imageUrl = memberData.image_url;

      // Upload image if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const dataToSave = {
        ...memberData,
        image_url: imageUrl,
      };

      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from('team_members')
          .update(dataToSave)
          .eq('id', editingMember.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        // Create new member
        const { error } = await supabase
          .from('team_members')
          .insert([{
            ...dataToSave,
            order_index: teamMembers.length,
            is_active: true
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team member added successfully",
        });
      }

      setEditingMember(null);
      setShowAddForm(false);
      setSelectedFile(null);
      fetchTeamMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });

      fetchTeamMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const toggleMemberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Team member ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchTeamMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Team Member Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Members ({teamMembers.length})</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingMember) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingMember(null);
                  setShowAddForm(false);
                  setSelectedFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    value={editingMember?.name || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, name: e.target.value }))}
                    placeholder="Enter team member name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={editingMember?.title || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev!, title: e.target.value }))}
                    placeholder="Enter team member title"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={editingMember?.description || ''}
                  onChange={(e) => setEditingMember(prev => ({ ...prev!, description: e.target.value }))}
                  placeholder="Enter team member description"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Profile Image</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <Badge variant="secondary">
                      {selectedFile.name}
                    </Badge>
                  )}
                </div>
                {editingMember?.image_url && !selectedFile && (
                  <div className="mt-2">
                    <img
                      src={editingMember.image_url}
                      alt="Current image"
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingMember(null);
                    setShowAddForm(false);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => saveTeamMember(editingMember || {})}
                  disabled={isUploading || !editingMember?.name || !editingMember?.title}
                >
                  {isUploading ? "Saving..." : editingMember?.id ? "Update" : "Add"} Team Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
            <p className="text-muted-foreground mb-4">Add your first team member to get started</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </Card>
        ) : (
          teamMembers.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium truncate">{member.name}</h4>
                      <p className="text-sm text-primary font-medium">{member.title}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant={member.is_active ? "default" : "secondary"}>
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {member.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMember(member)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleMemberStatus(member.id, member.is_active)}
                    >
                      {member.is_active ? "Deactivate" : "Activate"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {member.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTeamMember(member.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamManager;
