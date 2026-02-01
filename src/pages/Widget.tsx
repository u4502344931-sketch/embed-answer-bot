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
}

const Widget = () => {
  const { widgetId } = useParams<{ widgetId: string }>();
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!widgetId) {
        setError("Widget ID is required");
        setLoading(false);
        return;
      }

      try {
        // Fetch widget settings based on user_id that starts with widgetId
        const { data, error: fetchError } = await supabase
          .from("widget_settings")
          .select("*")
          .ilike("user_id", `${widgetId}%`)
          .limit(1)
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <EmbeddableWidget widgetId={widgetId || ""} settings={settings} />
    </div>
  );
};

export default Widget;
