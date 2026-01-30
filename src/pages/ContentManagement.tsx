import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { 
  Globe, 
  Upload, 
  FileText, 
  Loader2, 
  Check, 
  X, 
  RefreshCw,
  Trash2,
  ArrowLeft,
  Plus
} from "lucide-react";

type ContentSource = {
  id: string;
  type: 'url' | 'document' | 'text';
  name: string;
  source_url: string | null;
  file_path: string | null;
  content: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  pages_crawled: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

const ContentManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [textName, setTextName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      fetchSources();
    };
    checkAuth();
  }, [navigate]);

  const fetchSources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sources:', error);
      toast({
        title: "Error",
        description: "Failed to load content sources",
        variant: "destructive",
      });
    } else {
      setSources(data as ContentSource[]);
    }
    setLoading(false);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !user) return;

    setIsSubmitting(true);
    
    try {
      // First, create the source record
      const { data: source, error: insertError } = await supabase
        .from('content_sources')
        .insert({
          user_id: user.id,
          type: 'url',
          name: new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`).hostname,
          source_url: urlInput,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Start scraping
      const result = await firecrawlApi.scrape(urlInput);
      
      if (result.success) {
        const markdown = result.data?.markdown || result.markdown;
        await supabase
          .from('content_sources')
          .update({
            status: 'completed',
            content: markdown,
            pages_crawled: 1,
          })
          .eq('id', source.id);

        toast({
          title: "Success",
          description: "Website content crawled successfully",
        });
      } else {
        await supabase
          .from('content_sources')
          .update({
            status: 'failed',
            error_message: result.error || 'Failed to crawl website',
          })
          .eq('id', source.id);

        toast({
          title: "Error",
          description: result.error || "Failed to crawl website",
          variant: "destructive",
        });
      }

      setUrlInput("");
      fetchSources();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !textName.trim() || !user) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('content_sources')
        .insert({
          user_id: user.id,
          type: 'text',
          name: textName,
          content: textInput,
          status: 'completed',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Text content added successfully",
      });

      setTextInput("");
      setTextName("");
      fetchSources();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setIsSubmitting(true);

    try {
      const filePath = `${user.id}/${Date.now()}-${selectedFile.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Read file content if it's a text file
      let content = null;
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
        content = await selectedFile.text();
      }

      // Create source record
      const { error: insertError } = await supabase
        .from('content_sources')
        .insert({
          user_id: user.id,
          type: 'document',
          name: selectedFile.name,
          file_path: filePath,
          content: content,
          status: 'completed',
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setSelectedFile(null);
      fetchSources();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, filePath?: string | null) => {
    try {
      if (filePath) {
        await supabase.storage.from('documents').remove([filePath]);
      }

      const { error } = await supabase
        .from('content_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Content source removed",
      });

      fetchSources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete",
        variant: "destructive",
      });
    }
  };

  const handleRecrawl = async (source: ContentSource) => {
    if (!source.source_url) return;

    try {
      await supabase
        .from('content_sources')
        .update({ status: 'processing' })
        .eq('id', source.id);

      fetchSources();

      const result = await firecrawlApi.scrape(source.source_url);
      
      if (result.success) {
        const markdown = result.data?.markdown || result.markdown;
        await supabase
          .from('content_sources')
          .update({
            status: 'completed',
            content: markdown,
            pages_crawled: 1,
            error_message: null,
          })
          .eq('id', source.id);

        toast({
          title: "Success",
          description: "Content recrawled successfully",
        });
      } else {
        await supabase
          .from('content_sources')
          .update({
            status: 'failed',
            error_message: result.error || 'Failed to recrawl',
          })
          .eq('id', source.id);
      }

      fetchSources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'failed':
        return <X className="w-4 h-4 text-destructive" />;
      default:
        return <Loader2 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url':
        return <Globe className="w-4 h-4" />;
      case 'document':
        return <Upload className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-serif text-xl font-semibold">Content Sources</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Add Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="font-serif text-2xl font-medium mb-6">Add Content</h2>
            
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website URL
                </TabsTrigger>
                <TabsTrigger value="document" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url">
                <Card className="p-6">
                  <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Website URL</label>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter the URL of the website you want to crawl. We'll extract the main content.
                      </p>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Crawling...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Website
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="document">
                <Card className="p-6">
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Document</label>
                      <Input
                        type="file"
                        accept=".txt,.md,.pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: TXT, MD, PDF. Maximum size: 10MB.
                      </p>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !selectedFile} className="w-full sm:w-auto">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="text">
                <Card className="p-6">
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Name</label>
                      <Input
                        type="text"
                        placeholder="e.g., Product FAQ, Company Info"
                        value={textName}
                        onChange={(e) => setTextName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <Textarea
                        placeholder="Paste your content here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={8}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Content
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Content Sources List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium">Your Content</h2>
              <Button variant="outline" size="sm" onClick={fetchSources}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : sources.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No content yet</h3>
                <p className="text-muted-foreground">
                  Add your first content source using the options above.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {sources.map((source) => (
                  <Card key={source.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {getTypeIcon(source.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{source.name}</h4>
                            {getStatusIcon(source.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {source.type === 'url' && source.source_url}
                            {source.type === 'document' && 'Uploaded document'}
                            {source.type === 'text' && 'Manual text entry'}
                            {source.status === 'failed' && source.error_message && (
                              <span className="text-destructive ml-2">• {source.error_message}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {source.type === 'url' && source.status !== 'processing' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRecrawl(source)}
                            title="Recrawl"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(source.id, source.file_path)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;
