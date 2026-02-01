-- Add color customization columns to widget_settings
ALTER TABLE public.widget_settings 
ADD COLUMN primary_color text NOT NULL DEFAULT '#2563eb',
ADD COLUMN text_color text NOT NULL DEFAULT '#ffffff';