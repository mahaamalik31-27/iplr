import { useState, useEffect } from "react";
import { CoreTeamMemberCard } from "./CoreTeamMemberCard";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
}

interface FoundersMessage {
  id: string;
  message: string;
  updated_at: string;
}

const AboutSection = () => {
  const [coreTeamMembers, setCoreTeamMembers] = useState<TeamMember[]>([]);
  const [foundersMessage, setFoundersMessage] = useState<FoundersMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCoreTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

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
      }
    } catch (error) {
      console.error('Error fetching founders message:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchTeamMembers(),
        fetchFoundersMessage()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <section id="about" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-academic font-bold text-foreground mb-6">
            About IPLR
          </h2>
          <div className="w-24 h-px bg-foreground mx-auto mb-8"></div>
          <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The Institute of Policy and Law Reform is dedicated to advancing education 
            through innovative research, publications, and professional development programs.
          </p>
        </div>

        <div className="mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-academic font-semibold text-foreground mb-4">
              Our Mission
            </h3>
            <p className="font-body text-foreground/80 leading-relaxed">
              We strive to bridge the gap between academic research and practical application, 
              fostering innovation in educational methodologies and professional development practices.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              Our interdisciplinary approach brings together experts from various fields to address 
              the evolving challenges in modern education and workplace learning.
            </p>
          </div>
        </div>

        {/* Founders Message Section */}
        {foundersMessage && (
          <div className="mb-16">
            <div className="bg-background/50 border border-border rounded-lg p-8">
              <h3 className="text-2xl font-academic font-semibold text-foreground mb-6 text-center">
                Founders Message
              </h3>
              <div className="w-16 h-px bg-foreground mx-auto mb-6"></div>
              <p className="font-body text-foreground/80 leading-relaxed text-center max-w-4xl mx-auto">
                {foundersMessage.message}
              </p>
            </div>
          </div>
        )}

        {/* Core Team Members Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-academic font-bold text-foreground mb-4">Our Core Team</h3>
            <div className="w-16 h-px bg-foreground mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals who drive our mission forward through their expertise and commitment to legal reform and policy development.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : coreTeamMembers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {coreTeamMembers.map((member) => (
                <CoreTeamMemberCard
                  key={member.id}
                  name={member.name}
                  title={member.title}
                  description={member.description}
                  imageUrl={member.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Team members will be displayed here once added.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;