import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User, X, Sparkles } from "lucide-react";
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

type DemoMessage = {
  id: number;
  text: string;
  isBot: boolean;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const demoConversation: DemoMessage[] = [
  { id: 1, text: "Hello, I'd like to learn about your pricing.", isBot: false },
  { id: 2, text: "Welcome! We offer three elegant plans tailored to your needs: Essentials at $29/mo, Professional at $79/mo, and Enterprise with bespoke pricing. How may I assist you further?", isBot: true },
  { id: 3, text: "What's included in Professional?", isBot: false },
  { id: 4, text: "Professional includes 2,000 monthly conversations, complete brand customization, priority support, and comprehensive analytics—perfect for growing businesses.", isBot: true },
];

const ChatWidgetDemo = () => {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBubbleMessage, setShowBubbleMessage] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < demoConversation.length) {
        const nextMessage = demoConversation[currentIndex];
        
        if (nextMessage.isBot) {
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => [...prev, nextMessage]);
            setIsTyping(false);
          }, 1200);
        } else {
          setMessages((prev) => [...prev, nextMessage]);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, []);

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

    try {
      await streamChat({
        messages: [...chatMessages, userMessage],
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
    <div className="relative">
      {/* Subtle glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10" />
      
      {/* Chat widget container - Premium styling */}
      <div className="bg-card border border-border rounded-2xl shadow-premium overflow-hidden max-w-md mx-auto">
        {/* Elegant header */}
        <div className="bg-gradient-to-r from-foreground to-foreground/90 px-5 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-card font-medium text-sm">SiteWise Assistant</h3>
            <p className="text-card/60 text-xs">Here to help</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-card/60 text-xs">Online</span>
          </div>
        </div>

        {/* Messages - Refined styling */}
        <div className="h-80 p-5 space-y-4 overflow-y-auto bg-gradient-to-b from-muted/20 to-background">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end space-x-2 ${
                  message.isBot ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot
                      ? "bg-foreground"
                      : "bg-primary/10"
                  }`}
                >
                  {message.isBot ? (
                    <MessageCircle className="w-3.5 h-3.5 text-card" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                    message.isBot
                      ? "bg-card border border-border rounded-bl-sm"
                      : "bg-foreground text-card rounded-br-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator - Refined */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end space-x-2"
            >
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-card" />
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input - Premium styling */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            <Button size="icon" className="flex-shrink-0 rounded-full h-9 w-9">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-3 tracking-wide">
            Powered by SiteWise.ai
          </p>
        </div>
      </div>

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
              className="absolute bottom-16 right-0 bg-card border border-border rounded-xl shadow-premium p-3 pr-8 min-w-[180px] mb-2"
            >
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubbleMessage(false);
                }}
                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
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
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 bg-foreground rounded-full shadow-premium flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6 text-card" />
        </motion.div>
      </div>

      {/* ChatGPT-style prompt dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-transparent border-0 shadow-none fixed bottom-4 top-auto translate-y-0 data-[state=open]:slide-in-from-bottom-4">
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
    </div>
  );
};

export default ChatWidgetDemo;
