import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { streamChat } from "@/lib/chat-stream";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const FloatingChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBubbleMessage, setShowBubbleMessage] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!promptValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: promptValue.trim() };
    setChatMessages(prev => [...prev, userMessage]);
    setPromptValue("");
    setIsLoading(true);

    let assistantContent = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setChatMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    const sitewisePrompt = `You are SiteWise AI, a friendly and helpful assistant that helps people and businesses create their own AI chatbots. 

Your personality:
- Be enthusiastic and supportive about helping users get their own AI chatbot
- Make users feel they are getting great value by chatting with you
- Be conversational and approachable, not robotic

Pricing Information (use these exact prices):
- Starter Plan: €29/month - Perfect for small businesses getting started
- Pro Plan: €79/month - For growing businesses with more traffic  
- Enterprise Plan: Custom pricing - For large organizations with specific needs

Key benefits to highlight:
- Easy to set up, no coding required
- Train the AI on your website content automatically
- Customize the look and feel to match your brand
- 24/7 automated customer support
- Reduce support workload and response times

Always be helpful, answer questions about SiteWise features, and gently guide interested users toward trying out a plan that fits their needs.`;

    try {
      await streamChat({
        messages: [...chatMessages, userMessage],
        systemPrompt: sitewisePrompt,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Fixed widget at bottom right of screen */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Message bubble dialog */}
        <AnimatePresence>
          {!isChatOpen && showBubbleMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: [0, -4, 0], 
                scale: 1 
              }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ 
                delay: 2,
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                y: {
                  delay: 2.5,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute bottom-16 right-0 bg-card border border-border rounded-xl shadow-premium p-3 pr-10 min-w-[180px] mb-2"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowBubbleMessage(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors z-10 cursor-pointer"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
              <p className="text-sm text-foreground font-medium">👋 Need help?</p>
              <p className="text-xs text-muted-foreground mt-1">Chat with us now!</p>
              {/* Speech bubble arrow */}
              <div className="absolute -bottom-2 right-5 w-4 h-4 bg-card border-b border-r border-border rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Floating chat button */}
        <motion.button
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 bg-foreground rounded-full shadow-premium flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-card" />
        </motion.button>
      </div>

      {/* ChatGPT-style prompt dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-transparent border-0 shadow-none fixed bottom-4 top-auto translate-y-0 data-[state=open]:slide-in-from-bottom-4 [&>button]:hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Chat with SiteWise Assistant</DialogTitle>
          </VisuallyHidden.Root>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-card border border-border rounded-2xl shadow-premium overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-sm">SiteWise Assistant</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat messages area */}
            {chatMessages.length > 0 && (
              <div 
                ref={chatContainerRef}
                className="max-h-80 overflow-y-auto p-4 space-y-3"
              >
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-foreground text-card rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && chatMessages[chatMessages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Prompt input area */}
            <div className="p-4 border-t border-border">
              <div className="relative">
                <Input
                  placeholder="Ask me anything..."
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="pr-12 h-12 text-base bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && promptValue.trim() && !isLoading) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button 
                  size="icon" 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
                  disabled={!promptValue.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {chatMessages.length === 0 && (
                <div className="flex items-center justify-center gap-4 mt-3">
                  <span className="text-[10px] text-muted-foreground">Try: "What are your pricing plans?"</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">"How do I get started?"</span>
                </div>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatWidget;
