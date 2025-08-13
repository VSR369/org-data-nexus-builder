import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";

const CogniblendEmbed: React.FC = () => {
  useEffect(() => {
    // Basic SEO
    document.title = "Cogniblend | Unified App";

    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta(
      "description",
      "Access the Cogniblend contributor platform directly within the unified Cogniblend app."
    );

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", window.location.href);
  }, []);

  const openInNewTab = () => {
    window.open("https://congiblend.lovable.app/", "_blank", "noopener,noreferrer");
  };

  const refreshEmbed = () => {
    const iframe = document.getElementById("cogniblend-iframe") as HTMLIFrameElement | null;
    try {
      iframe?.contentWindow?.location.reload();
    } catch (e) {
      // Cross-origin may block direct reload; fallback to resetting src
      if (iframe) iframe.src = iframe.src;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="sr-only">Cogniblend Contributor Platform</h1>
          <p className="text-sm text-muted-foreground">Embedded Cogniblend app</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshEmbed}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button size="sm" onClick={openInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" /> Open in new tab
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-6">
        <section aria-label="Cogniblend app" className="mt-3">
          <iframe
            id="cogniblend-iframe"
            title="Cogniblend"
            src="https://congiblend.lovable.app/"
            className="w-full border border-border rounded-md shadow-sm"
            style={{ height: "calc(100vh - 120px)" }}
            loading="lazy"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            If the embedded view does not load, use the “Open in new tab” button above.
          </p>
        </section>
      </main>
    </div>
  );
};

export default CogniblendEmbed;
