import { useState, useEffect, useRef } from "react";
import { streamChat } from "@/lib/chat-stream";
import type { ChatMessage, WidgetSettings } from "./types";
import BubbleWidget from "./templates/BubbleWidget";
import PanelWidget from "./templates/PanelWidget";
import ChatGPTWidget from "./templates/ChatGPTWidget";

interface EmbeddableWidgetProps {
  widgetId: string;
  settings?: WidgetSettings | null;
}

const EmbeddableWidget = ({ widgetId, settings }: EmbeddableWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBubbleMessage, setShowBubbleMessage] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const headerTitle = settings?.header_title || "Chat Assistant";
  const welcomeMessage = settings?.welcome_message || "Hi! How can I help you today?";
  const position = settings?.position || "bottom-right";
  const primaryColor = settings?.primary_color || "#2563eb";
  const textColor = settings?.text_color || "#ffffff";
  const widgetTemplate = settings?.widget_template || "bubble";

  // Auto-scroll chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Listen for parent window messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "sitewise-open") setIsOpen(true);
      if (event.data.type === "sitewise-close") setIsOpen(false);
      if (event.data.type === "sitewise-toggle") setIsOpen((prev) => !prev);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Notify parent of size changes
  useEffect(() => {
    let width = 380;
    let height = 540;

    if (!isOpen) {
      switch (widgetTemplate) {
        case "chatgpt":
          // Prompt bar + floating button
          width = 360;
          height = 230;
          break;
        default:
          // Bubble/Panel: just the button + optional intro bubble
          width = 300;
          height = showBubbleMessage ? 230 : 160;
      }
    } else {
      switch (widgetTemplate) {
        case "panel":
          width = 380;
          height = 560;
          break;
        case "chatgpt":
          width = 420;
          height = 520;
          break;
        default:
          width = 380;
          height = 540;
      }
    }

    window.parent.postMessage(
      { type: "sitewise-resize", width, height },
      "*"
    );
  }, [isOpen, showBubbleMessage, widgetTemplate]);

  const handleSendMessage = async () => {
    if (!promptValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: promptValue.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    setPromptValue("");
    setIsLoading(true);

    try {
      let assistantContent = "";

      const upsertAssistant = (nextChunk: string) => {
        assistantContent += nextChunk;
        setChatMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      };

      await streamChat({
        messages: [...chatMessages, userMessage],
        widgetId,
        systemPrompt: settings?.ai_instructions,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (err) => {
          throw new Error(err);
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const templateProps = {
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
  };

  // Render the appropriate template
  switch (widgetTemplate) {
    case "panel":
      return <PanelWidget {...templateProps} />;
    case "chatgpt":
      return <ChatGPTWidget {...templateProps} />;
    default:
      return <BubbleWidget {...templateProps} />;
  }
};

export default EmbeddableWidget;
