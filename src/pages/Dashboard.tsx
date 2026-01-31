import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  FileText, 
  Code, 
  LogOut,
  Bot,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          navigate("/login");
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: "Total Conversations", value: "0", icon: MessageSquare, change: "+0%" },
    { label: "Active Visitors", value: "0", icon: Users, change: "+0%" },
    { label: "Response Rate", value: "0%", icon: TrendingUp, change: "+0%" },
  ];

  const quickActions = [
    { 
      title: "Manage Content", 
      description: "Add or update your website content", 
      icon: FileText, 
      href: "/dashboard/content" 
    },
    { 
      title: "Widget Settings", 
      description: "Customize your chat widget", 
      icon: Bot, 
      href: "/dashboard/widget" 
    },
    { 
      title: "Get Embed Code", 
      description: "Add the widget to your site", 
      icon: Code, 
      href: "/dashboard/embed" 
    },
    { 
      title: "Analytics", 
      description: "Track conversations & engagement", 
      icon: BarChart3, 
      href: "/dashboard/analytics" 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-serif font-semibold text-lg">S</span>
              </div>
              <span className="font-serif font-semibold text-xl tracking-tight">SiteWise</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section with plan indicator */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl font-semibold mb-2">Welcome to SiteWise</h1>
            <p className="text-muted-foreground">
              Get started by adding your content and customizing your assistant.
            </p>
          </div>
          
          {/* Plan indicator */}
          <Card className="sm:min-w-[280px] border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                    Starter Plan
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => navigate("/dashboard/pricing")}
                >
                  Upgrade
                </Button>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Conversations</span>
                  <span className="font-medium text-foreground">0 / 500</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Pages crawled</span>
                  <span className="font-medium text-foreground">0 / 10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-primary">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate(action.href)}
            >
              <CardHeader className="pb-2">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-2">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Getting started */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to launch your AI chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: 1, title: "Add your website content", done: false },
                { step: 2, title: "Customize your widget", done: false },
                { step: 3, title: "Copy embed code to your site", done: false },
              ].map((item) => (
                <div key={item.step} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    item.done 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {item.step}
                  </div>
                  <span className={item.done ? "line-through text-muted-foreground" : ""}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
