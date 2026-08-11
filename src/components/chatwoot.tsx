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
      darkMode?: "light" | "auto";
      locale?: string;
    };
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      toggleBubbleVisibility: (state: "hide" | "show") => void;
      setUser?: (identifier: string, user: Record<string, unknown>) => void;
      reset?: () => void;
    };
  }
}

interface Props {
  /** When true, the launcher bubble is hidden (e.g. on admin routes). */
  hide?: boolean;
}

const BASE_URL = "https://app.chatwoot.com";
const WEBSITE_TOKEN = "1zEDdCc9DsEHC91HtyqrXGkf";
const SCRIPT_ID = "chatwoot-sdk";

/**
 * Loads the Chatwoot live-chat widget once for the app shell.
 * Mount from the root route so visitors can reach support from any public page.
 */
export default function Chatwoot({ hide = false }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.chatwootSettings = {
      position: "right",
      type: "standard",
      hideMessageBubble: hide,
      darkMode: "light",
      locale: "en",
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      window.$chatwoot?.toggleBubbleVisibility(hide ? "hide" : "show");
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      });
      if (hide) {
        window.$chatwoot?.toggleBubbleVisibility("hide");
      }
    };
    document.body.appendChild(script);
  }, [hide]);

  return null;
}
