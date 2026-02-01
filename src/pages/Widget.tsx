import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EmbeddableWidget from "@/components/widget/EmbeddableWidget";

interface WidgetSettings {
  header_title: string;
  welcome_message: string;
  ai_instructions: string;
  position: string;
  widget_template: string;
  primary_color: string;
  text_color: string;
}

const Widget = () => {
  const { widgetId } = useParams<{ widgetId: string }>();
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Make the entire document transparent for iframe embedding
    // Use !important to override Tailwind's bg-background on body
    document.documentElement.style.setProperty("background", "transparent", "important");
    document.body.style.setProperty("background", "transparent", "important");
    document.body.style.setProperty("background-color", "transparent", "important");
    document.body.classList.add("widget-embed");
    
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
      document.body.classList.remove("widget-embed");
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!widgetId) {
        setError("Widget ID is required");
        setLoading(false);
        return;
      }

      try {
        // Fetch widget settings by the widget's own ID
        const { data, error: fetchError } = await supabase
          .from("widget_settings")
          .select("*")
          .eq("id", widgetId)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching settings:", fetchError);
        }

        if (data) {
          setSettings({
            header_title: data.header_title,
            welcome_message: data.welcome_message,
            ai_instructions: data.ai_instructions,
            position: data.position,
            widget_template: data.widget_template,
            primary_color: data.primary_color || "#2563eb",
            text_color: data.text_color || "#ffffff",
          });
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load widget");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [widgetId]);

  if (loading) {
    return null; // Don't show loading spinner for embedded widget
  }

  if (error) {
    return null; // Don't show errors for embedded widget
  }

  return <EmbeddableWidget widgetId={widgetId || ""} settings={settings} />;
};

export default Widget;
