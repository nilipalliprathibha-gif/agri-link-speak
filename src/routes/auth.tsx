import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { credentialsFor, useApp, type Role } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FarmDirect" },
      { name: "description", content: "Sign in to FarmDirect with your mobile number and a 4-digit PIN." },
      { property: "og:title", content: "Sign in — FarmDirect" },
      { property: "og:description", content: "Mobile number and a 4-digit PIN is all you need." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit mobile number"),
  pin: z.string().regex(/^\d{4}$/, "Enter a 4-digit PIN"),
  name: z.string().trim().max(60).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { role, refreshProfile } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const parsed = schema.safeParse({ phone, pin, name });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setBusy(true);
    const creds = credentialsFor(phone, pin);
    try {
      if (mode === "signup") {
        if (!name.trim()) {
          toast.error("Please tell us your name");
          return;
        }
        const { data, error } = await supabase.auth.signUp(creds);
        if (error) throw error;
        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: data.user.id,
            name: name.trim(),
            phone,
            role: (role ?? "customer") as Role,
            language: window.localStorage.getItem("fd.lang") ?? "en",
          });
          if (profileError) throw profileError;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword(creds);
        if (error) throw error;
      }
      await refreshProfile();
      toast.success(t("welcomeBack"));
      navigate({ to: role === "farmer" ? "/farmer" : "/market", replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(
        /already registered/i.test(message)
          ? "This number already has an account. Please sign in."
          : /invalid login/i.test(message)
            ? "That number and PIN did not match. Please try again."
            : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-sm px-5 py-10">
      <h1 className="text-3xl font-extrabold">
        {mode === "signin" ? t("signIn") : t("createAccount")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {role === "farmer" ? "🧑‍🌾 " : "🛒 "}
        Only your mobile number and a 4-digit PIN.
      </p>

      <div className="mt-8 grid gap-4">
        {mode === "signup" && (
          <label className="grid gap-2">
            <span className="font-semibold">{t("yourName")}</span>
            <input
              className="field"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ramesh"
            />
          </label>
        )}
        <label className="grid gap-2">
          <span className="font-semibold">{t("phone")}</span>
          <input
            className="field"
            inputMode="numeric"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="9000000001"
          />
        </label>
        <label className="grid gap-2">
          <span className="font-semibold">{t("pin")}</span>
          <input
            className="field tracking-[0.5em]"
            inputMode="numeric"
            type="password"
            value={pin}
            maxLength={4}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
          />
        </label>

        <button
          onClick={submit}
          disabled={busy}
          className="rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-soft active:scale-95 disabled:opacity-60"
        >
          {busy ? "…" : mode === "signin" ? t("signIn") : t("createAccount")}
        </button>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="py-2 font-semibold text-primary"
        >
          {mode === "signin" ? t("newHere") : t("haveAccount")}
        </button>
        <button
          onClick={() => navigate({ to: "/market" })}
          className="py-2 font-semibold text-muted-foreground"
        >
          {t("browseAsGuest")}
        </button>
      </div>
    </div>
  );
}
