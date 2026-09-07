import { useNavigate } from "@tanstack/react-router";
import { Mic, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useApp } from "@/lib/app";
import { listenOnce, parseIntent, recognitionSupported, speak, titleCase } from "@/lib/voice";

/**
 * Floating voice assistant available on every screen, for farmers and buyers.
 * It is automated help — always paired with the visible buttons it triggers.
 */
export function MicAssistant() {
  const navigate = useNavigate();
  const { t, speechLocale, lang } = useI18n();
  const { role, settings } = useApp();
  const [listening, setListening] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const handleRef = useRef<{ stop: () => void } | null>(null);

  const say = useCallback(
    (message: string) => {
      setReply(message);
      if (settings.voice) speak(message, speechLocale);
    },
    [settings.voice, speechLocale],
  );

  const runIntent = useCallback(
    (text: string) => {
      const intent = parseIntent(text);
      switch (intent.kind) {
        case "search":
          say(
            intent.crop
              ? `Showing ${titleCase(intent.crop)} listings near you.`
              : "Showing all available crops.",
          );
          void navigate({ to: "/market", search: { q: intent.crop ?? "" } });
          break;
        case "order":
          say(
            intent.crop
              ? `Opening ${titleCase(intent.crop)}. Choose a farmer and confirm the quantity on screen.`
              : "Which crop would you like to order? Here are the available crops.",
          );
          void navigate({ to: "/market", search: { q: intent.crop ?? "" } });
          break;
        case "cart":
          say("Opening your cart.");
          void navigate({ to: "/cart" });
          break;
        case "orderStatus":
          say("Opening your orders.");
          void navigate({ to: "/orders" });
          break;
        case "complaint":
          say("I'm sorry about that. Open the order and tap Report a problem.");
          void navigate({ to: "/orders" });
          break;
        case "addCrop":
          say("Let's add a crop. I will ask for crop, quantity and price.");
          void navigate({ to: "/farmer/add-crop" });
          break;
        case "earnings":
          say("Opening your earnings summary.");
          void navigate({ to: "/farmer" });
          break;
        case "home":
          say("Going home.");
          void navigate({ to: role === "farmer" ? "/farmer" : "/market" });
          break;
        case "help":
          say(
            "You can say: show tomatoes near me, order 2 kilograms of tomatoes, where is my order, or add crop.",
          );
          break;
        default:
          say("I could not understand that. Please tap a button on the screen, or try again.");
      }
    },
    [navigate, role, say],
  );

  const start = useCallback(() => {
    setPanelOpen(true);
    setTranscript("");
    setReply("");
    if (!recognitionSupported()) {
      say("Voice input is not available in this browser. Please use the buttons on screen.");
      return;
    }
    setListening(true);
    handleRef.current = listenOnce(
      speechLocale,
      (text) => {
        setTranscript(text);
        runIntent(text);
      },
      (error) => {
        setListening(false);
        if (error === "no-speech") say("I did not hear anything. Please try again.");
      },
    );
  }, [runIntent, say, speechLocale]);

  useEffect(() => () => handleRef.current?.stop(), []);
  useEffect(() => {
    if (lang) setReply("");
  }, [lang]);

  return (
    <>
      {panelOpen && (
        <div className="fixed inset-x-0 bottom-36 z-50 mx-auto w-full max-w-screen-sm px-4">
          <div className="rounded-3xl border bg-card p-4 shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-muted-foreground">
                {listening ? t("speakNow") : t("listen")}
              </p>
              <button
                aria-label="Close assistant"
                onClick={() => {
                  handleRef.current?.stop();
                  setPanelOpen(false);
                  setListening(false);
                }}
                className="rounded-full bg-muted p-1"
              >
                <X className="size-4" />
              </button>
            </div>
            {transcript && <p className="mt-2 text-lg font-semibold">“{transcript}”</p>}
            {reply && <p className="mt-2 text-base text-muted-foreground">{reply}</p>}
            <p className="mt-3 text-xs text-muted-foreground">
              Automated assistant — not a person. Every action is shown on screen so you can confirm
              or tap instead.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={start}
        aria-label="Voice assistant"
        className={`fixed bottom-24 right-4 z-50 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift active:scale-95 ${
          listening ? "mic-listening" : ""
        }`}
      >
        <Mic className="size-7" />
      </button>
    </>
  );
}
