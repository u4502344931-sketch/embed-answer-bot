import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DemoMessage = {
  id: number;
  text: string;
  isBot: boolean;
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
    </div>
  );
};

export default ChatWidgetDemo;
