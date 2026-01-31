-- Create widget_settings table to store user widget configurations
CREATE TABLE public.widget_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  widget_template TEXT NOT NULL DEFAULT 'bubble',
  position TEXT NOT NULL DEFAULT 'bottom-right',
  header_title TEXT NOT NULL DEFAULT 'Chat with us',
  welcome_message TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
  ai_instructions TEXT NOT NULL DEFAULT 'You are a helpful customer support assistant. Be friendly, concise, and professional. Answer questions about our products, pricing, and services.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own widget settings" 
ON public.widget_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own widget settings" 
ON public.widget_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own widget settings" 
ON public.widget_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_widget_settings_updated_at
BEFORE UPDATE ON public.widget_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();