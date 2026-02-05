export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface WidgetSettings {
  header_title: string;
  welcome_message: string;
  ai_instructions: string;
  position: string;
  widget_template: string;
  primary_color: string;
  text_color: string;
}

export interface WidgetTemplateProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  promptValue: string;
  setPromptValue: (value: string) => void;
  isLoading: boolean;
  handleSendMessage: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  headerTitle: string;
  welcomeMessage: string;
  primaryColor: string;
  textColor: string;
  position: string;
  showBubbleMessage: boolean;
  setShowBubbleMessage: (show: boolean) => void;
}
