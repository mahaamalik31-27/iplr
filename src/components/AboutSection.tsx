import { useState, useEffect } from "react";
import { CoreTeamMemberCard } from "./CoreTeamMemberCard";
import { supabase } from "@/integrations/supabase/client";

interface TeamMemberImage {
  name: string;
  image_url: string;
}

interface FoundersMessage {
  id: string;
  message: string;
  updated_at: string;
}

const AboutSection = () => {
  const [teamMemberImages, setTeamMemberImages] = useState<TeamMemberImage[]>([]);
  const [foundersMessage, setFoundersMessage] = useState<FoundersMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const coreTeamMembers = [
    {
      name: "Samaviya Sajjad",
      title: "Founder & Director",
      description: "Samaviya Sajjad is a graduate of the University of California, Berkeley, and the founder of the Institute of Policy and Law Reform (IPLR), a consultancy and research institute committed to legal reform, education, and accessibility. Samaviya has an extensive legal background, having worked with institutions such as RIAA Barker Gillette, Lahore Transport Company, and the University of California, Berkeley's Law Clinic. Her work at the clinic included drafting an observation report on the Convention Against Torture, which was later published by the United Nations Human Rights Council. She has also contributed to reports and legal memoranda for UN Peacekeeping Operations, the Department of Field Support, and Political and Legal Affairs at the UN. As a visiting professor at LUMS, she teaches Legal Reasoning. She is also a regular guest on television panels, raising awareness about various legal rights, with a particular focus on environmental law and sustainability. Through IPLR, she spearheads awareness campaigns on environmental issues via social media, training programs, and workshops. Additionally, IPLR has launched a Green Ambassadors Program across 35 schools, appointing a student from each institution to lead efforts in eliminating single-use plastic from their school canteens. This initiative empowers students to take actionable steps toward sustainability and instills long-term environmental responsibility."
    },
    {
      name: "Sundus Rauf",
      title: "Senior Research Associate - Legal & Policy Development, PhD Candidate in Forensic Science",
      description: "An experienced legal researcher and academic with a strong background in criminology, human rights law, and legal reform. She has been deeply involved in policy analysis, legislative drafting, and advocacy for social and environmental justice. Over the years, she has contributed to research on climate change policy, global warming impacts, and legal frameworks for environmental protection. She focuses on policy development, legislative analysis, and legal consultancy, particularly in areas concerning human rights, environmental law, and corporate governance. Sundus has also presented her research at national and international conferences, solidifying her expertise in legal policy development and reform."
    },
    {
      name: "Deeya Farukh Niaz",
      title: "Senior Research Associate - Litigation Department",
      description: "Deeya is a graduate of University of Law, London, UK. A dedicated advocate specializing in human rights, environmental law, and corporate litigation. She is an Advocate of the High Court Pakistan and leads IPLR's Litigation Department, managing legal strategies, petitions, and pro bono litigation and policy advocacy efforts. Deeya has successfully initiated legal collaborations with the Lahore Development Authority for dust control policies and played a significant role in IPLR's Fast Fashion Waste Initiative."
    },
    {
      name: "Laiba Bashir",
      title: "Senior Research Associate - Environmental Policy & Sustainability",
      description: "An environmental engineer specializing in climate action, sustainability, and environmental impact assessments. With experience in green energy solutions, urban sustainability projects, and eco-friendly corporate strategies, she brings a technical and research-driven approach to sustainability initiatives. She has played a key role in researching E-bike feasibility in Pakistan's delivery sector and assessing sustainable business models for urban development. Laiba's work focuses on environmental policy research, corporate sustainability assessments, and sustainable business integration strategies, with an emphasis on helping businesses transition toward eco-conscious practices."
    },
    {
      name: "Ayesha Imam",
      title: "Research Associate",
      description: "A research associate at IPLR for the past two years, Ayesha has played a key role in researching various environmental aspects, including fast fashion waste, E-bikes, and smog. She has provided insights for consultancy projects and collaborated on the preparation of consultancy documents for sustainability initiatives. Known for her efficiency, Ayesha delivers high-quality research under tight deadlines, often producing in-depth analyses within minutes when needed."
    },
    {
      name: "Ume Rubab",
      title: "Research Associate - Legal & Policy Initiatives",
      description: "A dedicated legal researcher and active member of IPLR's research team. She has contributed extensively to IPLR's projects, including the Canteen Plastic Initiative and other sustainability-driven policy reforms. Ume plays an important role in IPLR's Annual Environmental Boot Camp, where she helps onboard participants and facilitates engagement between students and expert mentors. She has also accompanied IPLR's leadership in national television interviews, contributing to discussions on policy and environmental law."
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
      console.error('Error fetching team member images:', error);
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
        fetchTeamMemberImages(),
        fetchFoundersMessage()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getImageForMember = (memberName: string) => {
    const imageData = teamMemberImages.find(img => img.name === memberName);
    return imageData?.image_url;
  };

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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreTeamMembers.map((member, index) => (
              <CoreTeamMemberCard
                key={index}
                name={member.name}
                title={member.title}
                description={member.description}
                imageUrl={getImageForMember(member.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;