import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, widgetId, systemPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the system message - default to generic helpful assistant
    let systemContent = "You are a helpful assistant. Keep your answers concise, helpful, and professional.";
    let hasKnowledgeBase = false;
    
    // If widgetId is provided, try to fetch content sources for context
    if (widgetId) {
      console.log("Fetching content for widgetId:", widgetId);
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Fetch widget settings to get the user_id
        const { data: widgetData, error: widgetError } = await supabase
          .from("widget_settings")
          .select("user_id")
          .eq("id", widgetId)
          .maybeSingle();
        
        console.log("Widget data:", widgetData, "Error:", widgetError);
        
        if (widgetData?.user_id) {
          // Fetch content sources for this user
          const { data: contentSources, error: contentError } = await supabase
            .from("content_sources")
            .select("content, name")
            .eq("user_id", widgetData.user_id)
            .eq("status", "completed")
            .limit(5);
          
          console.log("Content sources found:", contentSources?.length, "Error:", contentError);
          
          if (contentSources && contentSources.length > 0) {
            const contextContent = contentSources
              .filter(source => source.content)
              .map(source => `### ${source.name}\n${source.content}`)
              .join("\n\n");
            
            if (contextContent) {
              hasKnowledgeBase = true;
              console.log("Adding context content, length:", contextContent.length);
              // When we have scraped content, use ONLY that content - ignore user AI instructions
              // This prevents the SiteWise marketing from mixing with website content
              systemContent = `You are a helpful support assistant for this website. You MUST answer questions ONLY based on the knowledge base provided below. Do NOT mention any pricing plans, products, or services that are not in the knowledge base. Do NOT try to sell anything. Simply help users find information from this website.

If the user asks about something not covered in the knowledge base, politely say you don't have that specific information and offer to help with something else from the website.

KNOWLEDGE BASE:
${contextContent}`;
            }
          }
        }
      } catch (dbError) {
        console.error("Error fetching content:", dbError);
        // Continue without content context
      }
    } else {
      console.log("No widgetId provided");
    }
    
    // Only use custom AI instructions if there's NO knowledge base content
    // This prevents mixing SiteWise marketing with actual website content
    if (!hasKnowledgeBase && systemPrompt) {
      systemContent = systemPrompt;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: systemContent
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
