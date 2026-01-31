import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// More compelling demo conversation showing real value
const demoConversation: DemoMessage[] = [
  { id: 1, text: "Hi! I saw your product but I'm not sure if it integrates with Shopify?", isBot: false },
  { id: 2, text: "Great question! Yes, SiteWise integrates seamlessly with Shopify. Just paste one line of code in your theme, and your AI assistant will instantly know your entire product catalog, shipping policies, and FAQs. Most stores are live within 5 minutes!", isBot: true },
  { id: 3, text: "That's amazing! Can it handle refund questions automatically?", isBot: false },
  { id: 4, text: "Absolutely! It learns your refund policy and handles those queries 24/7. Our merchants report 73% fewer support tickets within the first month. Would you like to start a free trial?", isBot: true },
];

const ChatWidgetDemo = () => {
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Demo animation effect
  useEffect(() => {
    if (isInteractive) return; // Stop demo when interactive
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < demoConversation.length) {
        const nextMessage = demoConversation[currentIndex];
        
        if (nextMessage.isBot) {
          setIsTyping(true);
          setTimeout(() => {
            setDemoMessages((prev) => [...prev, nextMessage]);
            setIsTyping(false);
          }, 1200);
        } else {
          setDemoMessages((prev) => [...prev, nextMessage]);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isInteractive]);

  // Auto-scroll chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, demoMessages]);

  // Handle input focus - trigger Thanos snap effect
  const handleInputFocus = () => {
    if (!isInteractive && demoMessages.length > 0) {
      setIsDissolving(true);
      setTimeout(() => {
        setIsInteractive(true);
        setDemoMessages([]);
        setIsDissolving(false);
      }, 600);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: inputValue.trim() };
    setChatMessages(prev => [...prev, userMessage]);
    setInputValue("");
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

  // Thanos snap dissolve animation variant
  const dissolveVariant = {
    initial: { opacity: 1, scale: 1, filter: "blur(0px)" },
    dissolve: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(8px)",
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
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
            <p className="text-card/60 text-xs">
              {isInteractive ? "Try it yourself!" : "See it in action"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-card/60 text-xs">Online</span>
          </div>
        </div>

        {/* Messages area */}
        <div 
          ref={chatContainerRef}
          className="h-80 p-5 space-y-4 overflow-y-auto bg-gradient-to-b from-muted/20 to-background"
        >
          {/* Demo messages with dissolve effect */}
          <AnimatePresence>
            {!isInteractive && demoMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={isDissolving ? "dissolve" : { opacity: 1, y: 0 }}
                variants={dissolveVariant}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end space-x-2 ${
                  message.isBot ? "" : "flex-row-reverse space-x-reverse"
                }`}
                style={isDissolving ? {
                  background: "linear-gradient(90deg, transparent 0%, transparent 100%)",
                } : {}}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? "bg-foreground" : "bg-primary/10"
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

          {/* Interactive chat messages */}
          {isInteractive && (
            <>
              {chatMessages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center px-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Try it yourself!</p>
                  <p className="text-xs text-muted-foreground">
                    Ask anything about SiteWise
                  </p>
                </motion.div>
              )}
              
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end space-x-2 ${
                    msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "assistant" ? "bg-foreground" : "bg-primary/10"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <MessageCircle className="w-3.5 h-3.5 text-card" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                      msg.role === "assistant"
                        ? "bg-card border border-border rounded-bl-sm"
                        : "bg-foreground text-card rounded-br-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </>
          )}

          {/* Typing indicator */}
          {(isTyping || (isLoading && chatMessages[chatMessages.length - 1]?.role === "user")) && (
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

        {/* Input area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-3">
            <Input
              placeholder={isInteractive ? "Ask me anything..." : "Click here to try it yourself..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleInputFocus}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim() && !isLoading && isInteractive) {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            <Button 
              size="icon" 
              className="flex-shrink-0 rounded-full h-9 w-9"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isInteractive}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-3 tracking-wide">
            {isInteractive ? "Powered by SiteWise.ai" : "👆 Click to try the live demo"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetDemo;
