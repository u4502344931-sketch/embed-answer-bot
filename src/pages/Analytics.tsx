import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

// Mock data for demo - in production this would come from the database
const mockDailyData = [
  { date: "Jan 24", conversations: 12, messages: 45, visitors: 28 },
  { date: "Jan 25", conversations: 19, messages: 72, visitors: 35 },
  { date: "Jan 26", conversations: 15, messages: 58, visitors: 31 },
  { date: "Jan 27", conversations: 25, messages: 98, visitors: 42 },
  { date: "Jan 28", conversations: 22, messages: 85, visitors: 38 },
  { date: "Jan 29", conversations: 30, messages: 112, visitors: 52 },
  { date: "Jan 30", conversations: 28, messages: 105, visitors: 48 },
];

const mockHourlyData = [
  { hour: "00:00", conversations: 2 },
  { hour: "03:00", conversations: 1 },
  { hour: "06:00", conversations: 3 },
  { hour: "09:00", conversations: 8 },
  { hour: "12:00", conversations: 12 },
  { hour: "15:00", conversations: 15 },
  { hour: "18:00", conversations: 10 },
  { hour: "21:00", conversations: 5 },
];

const Analytics = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Stats state
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    uniqueVisitors: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadAnalytics(session.user.id);
        } else {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadAnalytics(session.user.id);
      } else {
        navigate("/login");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadAnalytics = async (userId: string) => {
    try {
      // Load conversations count
      const { count: conversationsCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // Load messages count through conversations
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", userId);

      let messagesCount = 0;
      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", conversationIds);
        messagesCount = count || 0;
      }

      // Get unique visitors
      const { data: visitorData } = await supabase
        .from("conversations")
        .select("visitor_id")
        .eq("user_id", userId);
      
      const uniqueVisitors = new Set(visitorData?.map(v => v.visitor_id) || []).size;

      setStats({
        totalConversations: conversationsCount || 0,
        totalMessages: messagesCount,
        uniqueVisitors: uniqueVisitors,
        avgResponseTime: 0, // Would calculate from messages table
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Conversations", 
      value: stats.totalConversations.toString(), 
      change: "+12%",
      trend: "up",
      icon: MessageSquare,
      description: "vs last period"
    },
    { 
      title: "Messages Exchanged", 
      value: stats.totalMessages.toString(), 
      change: "+18%",
      trend: "up",
      icon: Activity,
      description: "vs last period"
    },
    { 
      title: "Unique Visitors", 
      value: stats.uniqueVisitors.toString(), 
      change: "+8%",
      trend: "up",
      icon: Users,
      description: "vs last period"
    },
    { 
      title: "Avg Response Time", 
      value: stats.avgResponseTime ? `${stats.avgResponseTime}ms` : "—",
      change: "-5%",
      trend: "down",
      icon: Clock,
      description: "faster is better"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-serif font-semibold text-lg">Analytics</h1>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                <TabsList className="h-9">
                  <TabsTrigger value="7d" className="text-xs">7 Days</TabsTrigger>
                  <TabsTrigger value="30d" className="text-xs">30 Days</TabsTrigger>
                  <TabsTrigger value="90d" className="text-xs">90 Days</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-green-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Conversations Over Time */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Conversations Over Time</CardTitle>
                  <CardDescription>Daily conversation trends</CardDescription>
                </div>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {stats.totalConversations === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversation data yet</p>
                    <p className="text-xs mt-1">Data will appear once visitors start chatting</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockDailyData}>
                    <defs>
                      <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="conversations" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorConversations)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Peak Hours</CardTitle>
                  <CardDescription>When visitors engage most</CardDescription>
                </div>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {stats.totalConversations === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No timing data yet</p>
                    <p className="text-xs mt-1">We'll show peak hours once you have conversations</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockHourlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="conversations" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Visitors & Messages Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Visitors & Messages</CardTitle>
                <CardDescription>Compare visitor traffic with message volume</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {stats.totalConversations === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No visitor data yet</p>
                  <p className="text-xs mt-1">Install the widget on your site to start tracking</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockDailyData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorVisitors)"
                    name="Visitors"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="hsl(var(--muted-foreground))" 
                    fillOpacity={1} 
                    fill="url(#colorMessages)"
                    name="Messages"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Empty State CTA */}
        {stats.totalConversations === 0 && (
          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Tracking Conversations</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Install the SiteWise widget on your website to start collecting analytics data. 
                You'll see real-time metrics as visitors engage with your AI assistant.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => navigate("/dashboard/widget")}>
                  Configure Widget
                </Button>
                <Button onClick={() => navigate("/dashboard/embed")}>
                  Get Embed Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Analytics;