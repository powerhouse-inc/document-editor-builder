import { useEffect, useRef } from "react";
import type { Theme } from "../../../document-models/document-editor-builder/index.js";

interface ThemeConfiguratorProps {
  theme?: Theme | null;
}

export function ThemeConfigurator({ theme }: ThemeConfiguratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    if (theme?.primaryColor) {
      container.style.setProperty("--color-primary", theme.primaryColor);
    }

    if (theme?.backgroundColor) {
      container.style.setProperty("--background", theme.backgroundColor);
    }

    if (theme?.textColor) {
      container.style.setProperty("--foreground", theme.textColor);
    }

    if (theme?.secondaryTextColor) {
      container.style.setProperty("--secondary", theme.secondaryTextColor);
    }

    // Cleanup function to remove CSS variables when component unmounts or theme changes
    return () => {
      container.style.removeProperty("--color-primary");
      container.style.removeProperty("--background");
      container.style.removeProperty("--foreground");
      container.style.removeProperty("--secondary");
    };
  }, [theme]);

  return <div ref={containerRef} style={{ display: "contents" }} />;
}
