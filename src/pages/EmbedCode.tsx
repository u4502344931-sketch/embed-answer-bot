import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Copy, 
  Check,
  Code,
  Globe,
  Smartphone,
  ExternalLink,
  Zap,
  Shield,
  Gauge
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmbedCode = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedReact, setCopiedReact] = useState(false);
  const [copiedWordpress, setCopiedWordpress] = useState(false);
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

  const widgetId = user?.id?.slice(0, 8) || "xxxxxxxx";
  
  const scriptCode = `<!-- SiteWise Chat Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['SiteWise']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','sw','https://widget.sitewise.ai/loader.js'));
  sw('init', '${widgetId}');
</script>`;

  const reactCode = `// Install the package
npm install @sitewise/react-widget

// In your App.tsx or layout component
import { SiteWiseWidget } from '@sitewise/react-widget';

function App() {
  return (
    <>
      {/* Your app content */}
      <SiteWiseWidget widgetId="${widgetId}" />
    </>
  );
}`;

  const wordpressCode = `// Method 1: Add to your theme's functions.php
function add_sitewise_widget() {
  wp_enqueue_script(
    'sitewise-widget',
    'https://widget.sitewise.ai/loader.js',
    array(),
    null,
    true
  );
  wp_add_inline_script(
    'sitewise-widget',
    "sw('init', '${widgetId}');"
  );
}
add_action('wp_enqueue_scripts', 'add_sitewise_widget');

// Method 2: Or use our WordPress plugin
// Download from: wordpress.org/plugins/sitewise-chat`;

  const handleCopy = async (code: string, type: 'script' | 'react' | 'wordpress') => {
    await navigator.clipboard.writeText(code);
    
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else if (type === 'react') {
      setCopiedReact(true);
      setTimeout(() => setCopiedReact(false), 2000);
    } else {
      setCopiedWordpress(true);
      setTimeout(() => setCopiedWordpress(false), 2000);
    }
    
    toast({
      title: "Copied to clipboard",
      description: "The embed code has been copied.",
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
              <h1 className="font-serif font-semibold text-lg">Embed Code</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Hero section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-semibold mb-3">Add SiteWise to Your Website</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Copy the embed code below and paste it into your website. The chat widget will appear automatically.
          </p>
        </div>

        {/* Widget ID */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Widget ID</p>
                <p className="font-mono text-lg font-medium">{widgetId}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Active
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation tabs */}
        <Tabs defaultValue="script" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="script" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">HTML / Script</span>
              <span className="sm:hidden">HTML</span>
            </TabsTrigger>
            <TabsTrigger value="react" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              React
            </TabsTrigger>
            <TabsTrigger value="wordpress" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              WordPress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HTML Script Tag</CardTitle>
                <CardDescription>
                  Add this code just before the closing <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag on every page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{scriptCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3"
                    onClick={() => handleCopy(scriptCode, 'script')}
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="react" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">React Component</CardTitle>
                <CardDescription>
                  Install our React package and add the component to your app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{reactCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3"
                    onClick={() => handleCopy(reactCode, 'react')}
                  >
                    {copiedReact ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wordpress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">WordPress Integration</CardTitle>
                <CardDescription>
                  Use our plugin or add the code to your theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{wordpressCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3"
                    onClick={() => handleCopy(wordpressCode, 'wordpress')}
                  >
                    {copiedWordpress ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Lightweight</h3>
              <p className="text-sm text-muted-foreground">
                Only 8kb gzipped. Won't slow down your site.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Secure</h3>
              <p className="text-sm text-muted-foreground">
                All data encrypted. GDPR compliant.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Gauge className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Fast Loading</h3>
              <p className="text-sm text-muted-foreground">
                Async loading. Zero layout shift.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Help section */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Need help with installation?</h3>
                <p className="text-sm text-muted-foreground">
                  Check our documentation or contact our support team.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  View Docs
                </Button>
                <Button size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmbedCode;