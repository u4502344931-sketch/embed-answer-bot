import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: number;
  text: string;
  isBot: boolean;
};

const demoConversation: Message[] = [
  { id: 1, text: "Hi! I'm looking for pricing information.", isBot: false },
  { id: 2, text: "Hi there! 👋 I'd be happy to help with pricing. We offer three plans: Starter at $29/mo, Pro at $79/mo, and Enterprise with custom pricing. Which plan interests you?", isBot: true },
  { id: 3, text: "What's included in the Pro plan?", isBot: false },
  { id: 4, text: "The Pro plan includes 2,000 monthly conversations, full widget customization (colors, avatar), priority support, and advanced analytics. Perfect for growing businesses!", isBot: true },
];

const ChatWidgetDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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
          }, 1000);
        } else {
          setMessages((prev) => [...prev, nextMessage]);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl -z-10" />
      
      {/* Chat widget container */}
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
        {/* Header */}
        <div className="bg-primary px-4 py-3 flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-primary-foreground font-semibold text-sm">SiteWise Assistant</h3>
            <p className="text-primary-foreground/80 text-xs">Always here to help</p>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-primary-foreground/80 text-xs">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 p-4 space-y-4 overflow-y-auto bg-muted/30">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-2 ${
                  message.isBot ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.isBot ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${
                    message.isBot
                      ? "bg-card border border-border rounded-tl-none"
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" className="flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Powered by SiteWise.ai
          </p>
        </div>
      </div>

      {/* Floating bubble preview */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 -right-4 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-pointer glow"
      >
        <Bot className="w-7 h-7 text-primary-foreground" />
      </motion.div>
    </div>
  );
};

export default ChatWidgetDemo;
