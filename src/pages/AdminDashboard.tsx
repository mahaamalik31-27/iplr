import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, FileText, Image, Video, Users, Settings, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ArticleUpload from "@/components/admin/ArticleUpload";
import MediaUpload from "@/components/admin/MediaUpload";
import EnhancedArticleUpload from "@/components/admin/EnhancedArticleUpload";
import EnhancedMediaUpload from "@/components/admin/EnhancedMediaUpload";
import ArticleManager from "@/components/admin/ArticleManager";
import MediaGallery from "@/components/admin/MediaGallery";
import HeroCarouselManager from "@/components/admin/HeroCarouselManager";
import TestMediaUpload from "@/components/admin/TestMediaUpload";
import PasswordChange from "@/components/admin/PasswordChange";
import TeamManager from "@/components/admin/TeamManager";
import FoundersMessageManager from "@/components/admin/FoundersMessageManager";

interface DashboardMetrics {
  totalArticles: number;
  mediaFiles: number;
  videoLinks: number;
  visitors: number;
  articlesChange: number;
  mediaChange: number;
  videoChange: number;
  visitorsChange: number;
}

const AdminDashboard = () => {
  const [adminSession, setAdminSession] = useState<any>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalArticles: 0,
    mediaFiles: 0,
    videoLinks: 0,
    visitors: 0,
    articlesChange: 0,
    mediaChange: 0,
    videoChange: 0,
    visitorsChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("articles");
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch articles count
      const { count: articlesCount, error: articlesError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      // Fetch media files count
      const { count: mediaCount, error: mediaError } = await supabase
        .from('media_uploads')
        .select('*', { count: 'exact', head: true });

      // Fetch video links count (media with video type)
      const { count: videoCount, error: videoError } = await supabase
        .from('media_uploads')
        .select('*', { count: 'exact', head: true })
        .eq('file_type', 'video_link');

      if (articlesError) throw articlesError;
      if (mediaError) throw mediaError;
      if (videoError) throw videoError;

      // Calculate changes (simplified - in real app you'd compare with previous period)
      const articlesChange = Math.floor(Math.random() * 10) + 1; // Random for demo
      const mediaChange = Math.floor(Math.random() * 20) + 5;
      const videoChange = Math.floor(Math.random() * 8) + 1;
      const visitorsChange = Math.floor(Math.random() * 25) + 10;

      setMetrics({
        totalArticles: articlesCount || 0,
        mediaFiles: mediaCount || 0,
        videoLinks: videoCount || 0,
        visitors: Math.floor(Math.random() * 5000) + 2000, // Simulated visitor count
        articlesChange,
        mediaChange,
        videoChange,
        visitorsChange,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      navigate("/admin/login");
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      // Check if session is valid (within 24 hours)
      const isValid = Date.now() - sessionData.loginTime < 24 * 60 * 60 * 1000;
      
      if (!isValid) {
        localStorage.removeItem("admin_session");
        navigate("/admin/login");
        return;
      }
      
      setAdminSession(sessionData);
      // Fetch metrics when session is valid
      fetchMetrics();
    } catch {
      localStorage.removeItem("admin_session");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Refresh metrics every 30 seconds
  useEffect(() => {
    if (!adminSession) return;
    
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [adminSession]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  // Function to refresh metrics (can be called from child components)
  const refreshMetrics = () => {
    fetchMetrics();
  };

  if (!adminSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-academic font-bold" style={{ color: 'hsl(var(--logo-teal))' }}>
                IPLR Admin
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Welcome back, {adminSession.username}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="font-body"
              >
                View Site
              </Button>
              <Button
                variant="ghost"
                onClick={fetchMetrics}
                disabled={loading}
                className="font-body"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="font-body"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : metrics.totalArticles}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{metrics.articlesChange} from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workshop & Training Files</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : metrics.mediaFiles}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{metrics.mediaChange} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Video Links</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : metrics.videoLinks}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{metrics.videoChange} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : metrics.visitors.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{metrics.visitorsChange}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="enhanced-articles">Enhanced Articles</TabsTrigger>
              <TabsTrigger value="media">Workshops & Trainings</TabsTrigger>
              <TabsTrigger value="hero">Hero Carousel</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Upload New Article
                    </CardTitle>
                    <CardDescription>
                      Upload PDF/Word documents that will be processed and added to the site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ArticleUpload onUploadSuccess={refreshMetrics} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                    <CardDescription>
                      Latest articles uploaded to the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ArticleManager onUpdate={refreshMetrics} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="enhanced-articles" className="space-y-6">
              <EnhancedArticleUpload onUploadSuccess={refreshMetrics} />
            </TabsContent>
            
            <TabsContent value="media" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Upload Workshop & Training Content
                    </CardTitle>
                    <CardDescription>
                      Upload images and add video links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MediaUpload />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Workshops & Training Gallery</CardTitle>
                    <CardDescription>
                      View and manage all uploaded media
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MediaGallery />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Workshop & Training Upload Diagnostics</CardTitle>
                  <CardDescription>
                    Test database and storage connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestMediaUpload />
                </CardContent>
              </Card>
              
              {/* Enhanced Workshop & Training Upload */}
              <EnhancedMediaUpload />
            </TabsContent>
            
            <TabsContent value="hero" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Hero Carousel Management
                  </CardTitle>
                  <CardDescription>
                    Manage the rotating images and content on the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HeroCarouselManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Management
                    </CardTitle>
                    <CardDescription>
                      Manage team members and their profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TeamManager />
                  </CardContent>
                </Card>
                
                <FoundersMessageManager />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PasswordChange />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Site Settings
                    </CardTitle>
                    <CardDescription>
                      Configure website settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Site settings coming soon
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;