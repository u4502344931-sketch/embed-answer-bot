import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  MessageSquare, 
  MessageCircle,
  Save,
  Sparkles,
  Brain,
  Info,
  Palette,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WidgetSettings = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Widget settings state
  const [widgetTemplate, setWidgetTemplate] = useState<"panel" | "bubble" | "chatgpt">("bubble");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi! How can I help you today?");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [headerTitle, setHeaderTitle] = useState("Chat with us");
  const [aiInstructions, setAiInstructions] = useState("You are a helpful customer support assistant. Be friendly, concise, and professional. Answer questions about our products, pricing, and services.");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadSettings(session.user.id);
        } else {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadSettings(session.user.id);
      } else {
        navigate("/login");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("widget_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setWidgetTemplate(data.widget_template as "panel" | "bubble" | "chatgpt");
        setPosition(data.position as "bottom-right" | "bottom-left");
        setHeaderTitle(data.header_title);
        setWelcomeMessage(data.welcome_message);
        setAiInstructions(data.ai_instructions);
        setPrimaryColor(data.primary_color || "#2563eb");
        setTextColor(data.text_color || "#ffffff");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("widget_settings")
        .upsert({
          user_id: user.id,
          widget_template: widgetTemplate,
          position: position,
          header_title: headerTitle,
          welcome_message: welcomeMessage,
          ai_instructions: aiInstructions,
          primary_color: primaryColor,
          text_color: textColor,
        }, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your widget settings have been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <h1 className="font-serif font-semibold text-lg">Widget Settings</h1>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Widget Template</CardTitle>
                <CardDescription>Choose how your chat widget appears on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={widgetTemplate} 
                  onValueChange={(value) => setWidgetTemplate(value as "panel" | "bubble" | "chatgpt")}
                  className="grid grid-cols-3 gap-4"
                >
                  <Label 
                    htmlFor="bubble" 
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      widgetTemplate === "bubble" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="bubble" id="bubble" className="sr-only" />
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                      <MessageCircle className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-sm">Floating Bubble</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Classic chat icon
                    </span>
                  </Label>
                  <Label 
                    htmlFor="panel" 
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      widgetTemplate === "panel" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="panel" id="panel" className="sr-only" />
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-sm">Chat Panel</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Side panel style
                    </span>
                  </Label>
                  <Label 
                    htmlFor="chatgpt" 
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      widgetTemplate === "chatgpt" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="chatgpt" id="chatgpt" className="sr-only" />
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-sm">ChatGPT Style</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Modern AI prompt
                    </span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Position */}
            <Card>
              <CardHeader>
                <CardTitle>Widget Position</CardTitle>
                <CardDescription>Where should the widget appear on your site?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={position} 
                  onValueChange={(value) => setPosition(value as "bottom-right" | "bottom-left")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottom-right" id="bottom-right" />
                    <Label htmlFor="bottom-right">Bottom Right</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottom-left" id="bottom-left" />
                    <Label htmlFor="bottom-left">Bottom Left</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Color Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <CardTitle>Brand Colors</CardTitle>
                </div>
                <CardDescription>Customize your widget to match your brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <input
                          type="color"
                          id="primaryColor"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <Input 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#2563eb"
                        className="font-mono uppercase"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Button & header background</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                        style={{ backgroundColor: textColor }}
                      >
                        <input
                          type="color"
                          id="textColor"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <Input 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#ffffff"
                        className="font-mono uppercase"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Icon & header text</p>
                  </div>
                </div>
                
                {/* Preset colors */}
                <div className="space-y-2">
                  <Label>Quick Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { primary: "#2563eb", text: "#ffffff", name: "Blue" },
                      { primary: "#7c3aed", text: "#ffffff", name: "Purple" },
                      { primary: "#059669", text: "#ffffff", name: "Green" },
                      { primary: "#dc2626", text: "#ffffff", name: "Red" },
                      { primary: "#ea580c", text: "#ffffff", name: "Orange" },
                      { primary: "#0891b2", text: "#ffffff", name: "Teal" },
                      { primary: "#171717", text: "#ffffff", name: "Black" },
                      { primary: "#fbbf24", text: "#171717", name: "Gold" },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setTextColor(preset.text);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-border/50"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span className="text-xs">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Text & Messages</CardTitle>
                <CardDescription>Customize the text shown in your widget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headerTitle">Header Title</Label>
                  <Input 
                    id="headerTitle"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    placeholder="Chat with us"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea 
                    id="welcomeMessage"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Hi! How can I help you today?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Instructions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <CardTitle>AI Instructions</CardTitle>
                </div>
                <CardDescription>
                  Tell your AI assistant how to behave and what to know
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Let us handle it CTA */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Don't have time? Let us handle it!</p>
                      <p className="text-xs text-muted-foreground">
                        Our team will craft the perfect AI instructions tailored to your business. We'll analyze your website and set everything up for you.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shrink-0 border-primary/30 hover:bg-primary/10"
                      onClick={() => {
                        toast({
                          title: "Request submitted! 🎉",
                          description: "Our team will reach out within 24 hours to set up your AI assistant.",
                        });
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Set it up for me
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or configure yourself</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiInstructions">System Prompt</Label>
                  <Textarea 
                    id="aiInstructions"
                    value={aiInstructions}
                    onChange={(e) => setAiInstructions(e.target.value)}
                    placeholder="You are a helpful customer support assistant..."
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5 mt-2">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    This defines your AI's personality, tone, and knowledge. Be specific about your business, products, and how you want the AI to respond.
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium">Example instructions:</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>• "You are a customer support agent for [Company Name], an e-commerce store selling organic skincare products."</p>
                    <p>• "Always be friendly and use emojis sparingly. Keep responses under 100 words."</p>
                    <p>• "If asked about refunds, explain our 30-day money-back guarantee policy."</p>
                    <p>• "For pricing questions, direct users to our pricing page at /pricing."</p>
                    <p>• "Never make up information. If unsure, offer to connect them with a human agent."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your widget will look on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted/50 rounded-lg h-[500px] border border-dashed border-border overflow-hidden">
                  {/* Mock website background */}
                  <div className="absolute inset-4 bg-background rounded border border-border shadow-sm">
                    <div className="h-8 border-b border-border flex items-center px-3 gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-5/6 bg-muted rounded" />
                      <div className="h-20 w-full bg-muted rounded mt-4" />
                    </div>
                  </div>

                  {/* Widget Preview - Closed State */}
                  <div className={`absolute bottom-6 ${position === "bottom-right" ? "right-6" : "left-6"}`}>
                    {/* Intro bubble */}
                    <div className={`bg-card border border-border rounded-xl shadow-lg p-3 ${position === "bottom-right" ? "pr-10" : "pl-10"} min-w-[160px] mb-3 relative`}>
                      <div className={`absolute top-2 ${position === "bottom-right" ? "right-2" : "left-2"} w-5 h-5 flex items-center justify-center rounded-full bg-muted`}>
                        <X className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-foreground font-medium">
                        {widgetTemplate === "bubble" ? "👋" : "✨"} {welcomeMessage}
                      </p>
                      <div className={`absolute -bottom-2 ${position === "bottom-right" ? "right-5" : "left-5"} w-3 h-3 bg-card border-b border-r border-border rotate-45`} />
                    </div>

                    {/* Floating button - different shape per template */}
                    <div
                      className={`flex items-center justify-center shadow-lg cursor-pointer ${
                        position === "bottom-right" ? "ml-auto" : "mr-auto"
                      } ${
                        widgetTemplate === "bubble"
                          ? "w-12 h-12 rounded-full"
                          : widgetTemplate === "chatgpt"
                          ? "w-12 h-12 rounded-xl"
                          : "w-12 h-12 rounded-lg"
                      }`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      {widgetTemplate === "bubble" ? (
                        <MessageCircle className="w-5 h-5" style={{ color: textColor }} />
                      ) : widgetTemplate === "chatgpt" ? (
                        <Sparkles className="w-5 h-5" style={{ color: textColor }} />
                      ) : (
                        <MessageSquare className="w-5 h-5" style={{ color: textColor }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Open State Preview */}
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Expanded view</p>
                  <div className="relative bg-muted/50 rounded-lg border border-dashed border-border overflow-hidden">
                    {widgetTemplate === "bubble" ? (
                      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: primaryColor, color: textColor }}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs">{headerTitle}</span>
                          </div>
                          <X className="w-3 h-3" />
                        </div>
                        <div className="p-3 h-24 bg-muted/20 flex items-start">
                          <div className="bg-muted rounded-lg p-2 text-xs max-w-[80%]">{welcomeMessage}</div>
                        </div>
                        <div className="border-t border-border p-2">
                          <div className="bg-muted rounded-lg h-8 px-3 flex items-center text-xs text-muted-foreground">Type a message...</div>
                        </div>
                      </div>
                    ) : widgetTemplate === "panel" ? (
                      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-3" style={{ backgroundColor: primaryColor, color: textColor }}>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-semibold text-xs">{headerTitle}</span>
                              <p className="text-[10px] opacity-80">We typically reply instantly</p>
                            </div>
                          </div>
                          <X className="w-3 h-3" />
                        </div>
                        <div className="p-3 h-28 bg-muted/20 flex items-start">
                          <div className="bg-muted rounded-lg p-2 text-xs max-w-[85%]">{welcomeMessage}</div>
                        </div>
                        <div className="border-t border-border p-2">
                          <div className="bg-muted rounded-lg h-8 px-3 flex items-center text-xs text-muted-foreground">Type a message...</div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                              <Sparkles className="w-3 h-3" style={{ color: textColor }} />
                            </div>
                            <span className="text-xs font-medium">{headerTitle}</span>
                          </div>
                          <X className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div className="p-3 h-24 flex flex-col items-center justify-center text-center space-y-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${primaryColor}20` }}>
                            <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                          </div>
                          <p className="text-xs text-foreground font-medium">{welcomeMessage}</p>
                          <p className="text-[10px] text-muted-foreground">Ask me anything to get started</p>
                        </div>
                        <div className="p-3 border-t border-border bg-muted/30">
                          <div className="bg-card border border-border rounded-xl h-8 px-3 flex items-center text-xs text-muted-foreground">Message...</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Powered by SiteWise.ai
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WidgetSettings;
