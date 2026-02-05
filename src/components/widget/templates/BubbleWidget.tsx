import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import type { ChatMessage, WidgetTemplateProps } from "../types";

const BubbleWidget = ({
  isOpen,
  setIsOpen,
  chatMessages,
  promptValue,
  setPromptValue,
  isLoading,
  handleSendMessage,
  chatContainerRef,
  headerTitle,
  welcomeMessage,
  primaryColor,
  textColor,
  position,
  showBubbleMessage,
  setShowBubbleMessage,
}: WidgetTemplateProps) => {
  const isRight = position === "bottom-right" || position === "top-right";
  const isBottom = position === "bottom-right" || position === "bottom-left";

  const positionClasses = {
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
  };

  return (
    <div className={`fixed ${positionClasses[position as keyof typeof positionClasses] || positionClasses["bottom-right"]} z-50 p-4`}>
      {/* Chat bubble when closed */}
      <AnimatePresence>
        {!isOpen && (
          <>
            {/* Message bubble */}
            {showBubbleMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                className={`absolute ${isBottom ? "bottom-[70px]" : "top-[70px]"} ${isRight ? "right-0" : "left-0"} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 ${isRight ? "pr-10" : "pl-10"} min-w-[180px]`}
              >
                <button
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBubbleMessage(false);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBubbleMessage(false);
                  }}
                  className={`absolute top-2 ${isRight ? "right-2" : "left-2"} z-10 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer`}
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
                <p className="text-sm text-gray-900 dark:text-white font-medium">👋 {welcomeMessage}</p>
                <div className={`absolute ${isBottom ? "-bottom-2" : "-top-2"} ${isRight ? "right-6" : "left-6"} w-4 h-4 bg-white dark:bg-gray-800 ${isBottom ? "border-b border-r" : "border-t border-l"} border-gray-200 dark:border-gray-700 rotate-45`} />
              </motion.div>
            )}

            {/* Floating button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageCircle className="w-6 h-6" style={{ color: textColor }} />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Chat window when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-[360px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: primaryColor, color: textColor }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{headerTitle}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="h-[320px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
            >
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                  <p>{welcomeMessage}</p>
                  <p className="text-xs mt-2">Ask me anything!</p>
                </div>
              )}

              {chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "rounded-br-sm"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm shadow-sm"
                    }`}
                    style={msg.role === "user" ? { backgroundColor: primaryColor, color: textColor } : undefined}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
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
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="relative">
                <Input
                  placeholder="Type a message..."
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="pr-12 h-11 bg-gray-100 dark:bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && promptValue.trim() && !isLoading) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
                  style={{ backgroundColor: primaryColor, color: textColor }}
                  disabled={!promptValue.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Powered by label */}
            <div className="px-4 pb-3 pt-0 bg-white dark:bg-gray-900">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                Powered by{" "}
                <a
                  href="https://sitewise.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-600 dark:hover:text-gray-400 underline"
                >
                  Sitewise.ai
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BubbleWidget;
