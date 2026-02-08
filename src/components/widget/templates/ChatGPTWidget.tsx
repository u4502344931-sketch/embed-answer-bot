import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import type { WidgetTemplateProps } from "../types";

const ChatGPTWidget = ({
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
}: WidgetTemplateProps) => {
  const isRight = position === "bottom-right" || position === "top-right";

  const positionClasses = {
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
  };

  return (
    <div
      className={`fixed ${positionClasses[position as keyof typeof positionClasses] || positionClasses["bottom-right"]} z-50 p-4`}
    >
      {/* Prompt bar (visible when chat is NOT open) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden w-[340px] max-w-[calc(100vw-2rem)]">
              {/* Mini header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: textColor }} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {headerTitle}
                </span>
              </div>

              {/* Input area */}
              <div className="p-3">
                <div className="relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <Input
                    placeholder="Ask me anything..."
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    className="pr-12 h-11 bg-transparent border-0 focus-visible:ring-0 rounded-xl text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && promptValue.trim() && !isLoading) {
                        setIsOpen(true);
                        handleSendMessage();
                      }
                    }}
                    onFocus={() => {
                      // Open chat on focus if there are existing messages
                      if (chatMessages.length > 0) {
                        setIsOpen(true);
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                    style={{ backgroundColor: primaryColor, color: textColor }}
                    disabled={!promptValue.trim() || isLoading}
                    onClick={() => {
                      setIsOpen(true);
                      handleSendMessage();
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  Try: &quot;{welcomeMessage.length > 30 ? "What are your pricing plans?" : welcomeMessage}&quot;
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating sparkle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer shadow-lg ${
              isRight ? "ml-auto" : "mr-auto"
            }`}
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            }}
          >
            <Sparkles className="w-6 h-6" style={{ color: textColor }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full chat window (opens when user interacts) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-[400px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: textColor }} />
                </div>
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {headerTitle}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="h-[350px] overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900"
            >
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
                    }}
                  >
                    <Sparkles className="w-8 h-8" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {welcomeMessage}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Ask me anything to get started
                    </p>
                  </div>
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
                    className={`max-w-[85%] px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md"
                    }`}
                    style={
                      msg.role === "user"
                        ? { backgroundColor: primaryColor, color: textColor }
                        : undefined
                    }
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
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1.5">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <Input
                  placeholder="Message..."
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="pr-12 h-12 bg-transparent border-0 focus-visible:ring-0 rounded-xl text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && promptValue.trim() && !isLoading) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  style={{ backgroundColor: primaryColor, color: textColor }}
                  disabled={!promptValue.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
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

export default ChatGPTWidget;
