import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const widgetId = url.searchParams.get("id");

  if (!widgetId) {
    return new Response("Widget ID required", { 
      status: 400, 
      headers: { ...corsHeaders, "Content-Type": "text/plain" } 
    });
  }

  // Get the base URL for the widget page
  const baseUrl = Deno.env.get("WIDGET_BASE_URL") || "https://embed-answer-bot.lovable.app";

  // Generate the loader script
  const loaderScript = `
(function() {
  // Prevent multiple initializations
  if (window.__sitewiseLoaded) return;
  window.__sitewiseLoaded = true;

  var widgetId = "${widgetId}";
  var baseUrl = "${baseUrl}";

  // Create widget container
  var container = document.createElement('div');
  container.id = 'sitewise-widget-container';
  container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:2147483647;pointer-events:none;';
  document.body.appendChild(container);

  // Create iframe - start larger so shadows/intro bubble aren't clipped
  var iframe = document.createElement('iframe');
  iframe.id = 'sitewise-widget-iframe';
  iframe.src = baseUrl + '/widget/' + widgetId;
  iframe.style.cssText = 'border:none;width:300px;height:180px;background:transparent !important;background-color:transparent !important;pointer-events:auto;';
  iframe.allow = 'microphone';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  container.appendChild(iframe);

  // Handle messages from widget
  window.addEventListener('message', function(event) {
    if (event.origin !== baseUrl) return;
    
    var data = event.data;
    if (data.type === 'sitewise-resize') {
      iframe.style.width = data.width + 'px';
      iframe.style.height = data.height + 'px';
    }
  });

  // Expose API
  window.SiteWise = {
    open: function() {
      iframe.contentWindow.postMessage({ type: 'sitewise-open' }, baseUrl);
    },
    close: function() {
      iframe.contentWindow.postMessage({ type: 'sitewise-close' }, baseUrl);
    },
    toggle: function() {
      iframe.contentWindow.postMessage({ type: 'sitewise-toggle' }, baseUrl);
    }
  };
})();
`;

  return new Response(loaderScript, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
