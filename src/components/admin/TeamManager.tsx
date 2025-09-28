import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Edit, Save, X, User } from "lucide-react";

interface TeamMemberImage {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  name: string;
  title: string;
  description: string;
}

const TeamManager = () => {
  const [teamMemberImages, setTeamMemberImages] = useState<TeamMemberImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const teamMembers: TeamMember[] = [
    {
      name: "Samaviya Sajjad",
      title: "Founder & Director",
      description: "Samaviya Sajjad is a graduate of the University of California, Berkeley, and the founder of the Institute of Policy and Law Reform (IPLR), a consultancy and research institute committed to legal reform, education, and accessibility."
    },
    {
      name: "Sundus Rauf",
      title: "Senior Research Associate - Legal & Policy Development, PhD Candidate in Forensic Science",
      description: "An experienced legal researcher and academic with a strong background in criminology, human rights law, and legal reform."
    },
    {
      name: "Deeya Farukh Niaz",
      title: "Senior Research Associate - Litigation Department",
      description: "Deeya is a graduate of University of Law, London, UK. A dedicated advocate specializing in human rights, environmental law, and corporate litigation."
    },
    {
      name: "Laiba Bashir",
      title: "Senior Research Associate - Environmental Policy & Sustainability",
      description: "An environmental engineer specializing in climate action, sustainability, and environmental impact assessments."
    },
    {
      name: "Ayesha Imam",
      title: "Research Associate",
      description: "A research associate at IPLR for the past two years, Ayesha has played a key role in researching various environmental aspects."
    },
    {
      name: "Ume Rubab",
      title: "Research Associate - Legal & Policy Initiatives",
      description: "A dedicated legal researcher and active member of IPLR's research team."
    }
  ];

  const fetchTeamMemberImages = async () => {
    try {
      const { data, error } = await supabase
        .from('team_member_images')
        .select('*');

      if (error) throw error;
      setTeamMemberImages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team member images",
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

  const saveTeamMemberImage = async (memberName: string) => {
    if (!selectedFile || !memberName) return;

    try {
      setIsUploading(true);
      
      // Upload image
      const imageUrl = await uploadImage(selectedFile);

      // Check if image already exists for this member
      const existingImage = teamMemberImages.find(img => img.name === memberName);
      
      if (existingImage) {
        // Update existing image
        const { error } = await supabase
          .from('team_member_images')
          .update({ image_url: imageUrl })
          .eq('name', memberName);

        if (error) throw error;
      } else {
        // Create new image record
        const { error } = await supabase
          .from('team_member_images')
          .insert([{
            name: memberName,
            image_url: imageUrl
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Image uploaded successfully for ${memberName}`,
      });

      setEditingMember(null);
      setSelectedFile(null);
      fetchTeamMemberImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteTeamMemberImage = async (memberName: string) => {
    try {
      const { error } = await supabase
        .from('team_member_images')
        .delete()
        .eq('name', memberName);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Image removed for ${memberName}`,
      });

      fetchTeamMemberImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeamMemberImages();
  }, []);

  const getImageForMember = (memberName: string) => {
    const imageData = teamMemberImages.find(img => img.name === memberName);
    return imageData?.image_url;
  };

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Member Images ({teamMembers.length})</h3>
        <p className="text-sm text-muted-foreground">Upload profile images for team members</p>
      </div>

      {/* Edit Image Form */}
      {editingMember && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upload Image for {editingMember.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingMember(null);
                  setSelectedFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                {getImageForMember(editingMember.name) && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                    <img
                      src={getImageForMember(editingMember.name)}
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
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => saveTeamMemberImage(editingMember.name)}
                  disabled={isUploading || !selectedFile}
                >
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => {
          const memberImage = getImageForMember(member.name);
          return (
            <Card key={member.name} className="p-4">
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {memberImage ? (
                    <img
                      src={memberImage}
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
                      <Badge variant={memberImage ? "default" : "secondary"}>
                        {memberImage ? "Image Added" : "No Image"}
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
                      {memberImage ? "Change Image" : "Add Image"}
                    </Button>

                    {memberImage && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTeamMemberImage(member.name)}
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TeamManager;
