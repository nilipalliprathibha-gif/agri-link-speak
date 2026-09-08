import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShoppingBasket, Sprout, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp, type Role } from "@/lib/app";
import { LANGUAGES, useI18n, type LangCode } from "@/lib/i18n";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FarmDirect — Buy straight from the farmer" },
      {
        name: "description",
        content:
          "Farmers list their crops, customers and bulk buyers order directly. Voice guided in 8 Indian languages.",
      },
      { property: "og:title", content: "FarmDirect — Buy straight from the farmer" },
      {
        property: "og:description",
        content: "A simple, voice-guided marketplace connecting farmers directly with buyers.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const { t, lang, setLang, speechLocale } = useI18n();
  const { role, setRolePreference, profile, settings } = useApp();
  const [step, setStep] = useState<"role" | "language">("role");
  const [chosenRole, setChosenRole] = useState<Role | null>(null);

  useEffect(() => {
    if (profile) {
      void navigate({ to: profile.role === "farmer" ? "/farmer" : "/market", replace: true });
    }
  }, [profile, navigate]);

  const pickRole = (next: Role) => {
    setChosenRole(next);
    setRolePreference(next);
    setStep("language");
  };

  const pickLanguage = (code: LangCode) => {
    setLang(code);
    const label = LANGUAGES.find((l) => l.code === code);
    if (settings.voice) {
      speak(
        `You have selected ${label?.label}. ${chosenRole === "farmer" ? "Let's list your crops." : "Let's find fresh crops near you."}`,
        label?.speech ?? speechLocale,
      );
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-5 pb-10 pt-10">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sprout className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold">{t("appName")}</h1>
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
      </div>

      {step === "role" ? (
        <section className="mt-10 flex-1">
          <h2 className="text-3xl font-extrabold">{t("whoAreYou")}</h2>
          <div className="mt-6 grid gap-4">
            <button onClick={() => pickRole("farmer")} className="tile !min-h-40 !text-xl">
              <span className="text-5xl">🧑‍🌾</span>
              {t("iAmFarmer")}
            </button>
            <button onClick={() => pickRole("customer")} className="tile !min-h-40 !text-xl">
              <span className="text-5xl">🛒</span>
              {t("iAmCustomer")}
            </button>
          </div>
          <button
            onClick={() => speak(t("whoAreYou"), speechLocale)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-3 font-semibold"
          >
            <Volume2 className="size-5" /> Read this screen aloud
          </button>
        </section>
      ) : (
        <section className="mt-10 flex-1">
          <h2 className="text-3xl font-extrabold">{t("selectLanguage")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => pickLanguage(l.code)}
                className={`tile ${lang === l.code ? "border-primary bg-secondary" : ""}`}
              >
                <span className="text-xl">{l.native}</span>
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-3">
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-soft active:scale-95"
            >
              {t("continue")}
            </button>
            {(chosenRole ?? role) !== "farmer" && (
              <button
                onClick={() => navigate({ to: "/market" })}
                className="rounded-2xl border-2 py-4 text-lg font-bold active:scale-95"
              >
                {t("browseAsGuest")}
              </button>
            )}
            <button onClick={() => setStep("role")} className="py-2 font-semibold text-muted-foreground">
              {t("back")}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
