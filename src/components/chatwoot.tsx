import { useEffect } from "react";

declare global {
  interface Window {
    chatwootSettings: {
      position?: "left" | "right";
      type?: "standard" | "expanded_bubble";
      launcherTitle?: string;
      hideMessageBubble?: boolean;
      widgetStyle?: "classic" | "flat";
      baseDomain?: string;
      // Positioning offsets
      customAttributes?: Record<string, unknown>;
    };
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
  }
}
interface Props {
  hide?: boolean;
}

export default function Chatwoot({ hide = false }: Props) {
  useEffect(() => {
    const BASE_URL = "https://app.chatwoot.com";

    // Must be set before the SDK script loads
    window.chatwootSettings = {
      position: "right", // "left" | "right"
      type: "standard",
      hideMessageBubble: hide, // "standard" | "expanded_bubble"
      customAttributes: {
        // widgetStyle: "classic",
        offsetX: "120px", // Horizontal offset
        offsetY: "120px",
      },
      // Vertical offset
    };

    const g = document.createElement("script") as HTMLScriptElement;
    const s = document.getElementsByTagName("script")[0];
    g.src = BASE_URL + "/packs/js/sdk.js";
    g.async = true;
    s.parentNode?.insertBefore(g, s);
    g.onload = function () {
      window.chatwootSDK.run({
        websiteToken: "1zEDdCc9DsEHC91HtyqrXGkf",
        baseUrl: BASE_URL,
      });
    };
  }, []);

  return null;
}
