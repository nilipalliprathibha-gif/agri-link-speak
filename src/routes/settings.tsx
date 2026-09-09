import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app";
import { LANGUAGES, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & accessibility — FarmDirect" },
      { name: "description", content: "Change language, text size, contrast and voice guidance." },
      { property: "og:title", content: "Profile & accessibility — FarmDirect" },
      { property: "og:description", content: "Language, text size, contrast and voice guidance settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const { profile, settings, updateSettings, signOut } = useApp();

  return (
    <AppShell title={t("profile")}>
      <div className="rounded-3xl border bg-card p-4">
        <p className="text-lg font-bold">{profile?.name ?? t("guest")}</p>
        <p className="text-sm text-muted-foreground">
          {profile?.phone ?? "—"} · {profile?.location_name ?? "—"}
        </p>
        {profile && (
          <p className="mt-1 text-sm">
            {t("trustScore")}: <strong>{profile.trust_score}/100</strong>
          </p>
        )}
      </div>

      <section className="mt-4 rounded-3xl border bg-card p-4">
        <h2 className="font-bold">{t("selectLanguage")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-2xl border-2 py-3 font-semibold ${lang === l.code ? "border-primary bg-secondary" : ""}`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-3 rounded-3xl border bg-card p-4">
        <h2 className="font-bold">{t("accessibility")}</h2>
        <label className="grid gap-2">
          <span>
            {t("textSize")}: {Math.round(settings.fontScale * 100)}%
          </span>
          <input
            type="range"
            min={0.9}
            max={1.6}
            step={0.1}
            value={settings.fontScale}
            onChange={(e) => updateSettings({ fontScale: Number(e.target.value) })}
          />
        </label>
        {(
          [
            ["contrast", t("highContrast")],
            ["dark", t("darkMode")],
            ["voice", t("voiceGuidance")],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-3">
            <span>{label}</span>
            <input
              type="checkbox"
              className="size-6"
              checked={settings[key]}
              onChange={(e) => updateSettings({ [key]: e.target.checked })}
            />
          </label>
        ))}
      </section>

      <div className="mt-4 grid gap-3">
        {profile ? (
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="rounded-2xl border-2 py-4 font-bold"
          >
            {t("signOut")}
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="rounded-2xl bg-primary py-4 font-bold text-primary-foreground"
          >
            {t("signIn")}
          </button>
        )}
      </div>
    </AppShell>
  );
}
