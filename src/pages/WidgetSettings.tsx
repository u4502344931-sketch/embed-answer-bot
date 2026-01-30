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
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WidgetSettings = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Widget settings state
  const [widgetTemplate, setWidgetTemplate] = useState<"panel" | "bubble">("bubble");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi! How can I help you today?");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [headerTitle, setHeaderTitle] = useState("Chat with us");

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

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to database
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    toast({
      title: "Settings saved",
      description: "Your widget settings have been updated.",
    });
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
                  onValueChange={(value) => setWidgetTemplate(value as "panel" | "bubble")}
                  className="grid grid-cols-2 gap-4"
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
                    <span className="font-medium">Floating Bubble</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Small icon that expands on click
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
                    <span className="font-medium">Chat Panel</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Full sliding panel from side
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

                  {/* Widget Preview */}
                  {widgetTemplate === "bubble" ? (
                    <div 
                      className={`absolute bottom-6 ${position === "bottom-right" ? "right-6" : "left-6"}`}
                    >
                      {/* Chat window (expanded state preview) */}
                      <div className="bg-card border border-border rounded-xl shadow-lg w-72 mb-4 overflow-hidden">
                        <div className="bg-primary text-primary-foreground p-3">
                          <p className="font-medium text-sm">{headerTitle}</p>
                        </div>
                        <div className="p-3 h-32 flex items-start">
                          <div className="bg-muted rounded-lg p-2 text-xs max-w-[80%]">
                            {welcomeMessage}
                          </div>
                        </div>
                        <div className="border-t border-border p-2">
                          <div className="bg-muted rounded-lg h-8 px-3 flex items-center text-xs text-muted-foreground">
                            Type your message...
                          </div>
                        </div>
                      </div>
                      {/* Bubble */}
                      <div className={`w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer ${position === "bottom-right" ? "ml-auto" : "mr-auto"}`}>
                        <MessageCircle className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`absolute bottom-6 top-12 ${position === "bottom-right" ? "right-6" : "left-6"} w-72`}
                    >
                      <div className="bg-card border border-border rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
                        <div className="bg-primary text-primary-foreground p-4">
                          <p className="font-medium">{headerTitle}</p>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="bg-muted rounded-lg p-3 text-sm max-w-[85%]">
                            {welcomeMessage}
                          </div>
                        </div>
                        <div className="border-t border-border p-3">
                          <div className="bg-muted rounded-lg h-10 px-3 flex items-center text-sm text-muted-foreground">
                            Type your message...
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
