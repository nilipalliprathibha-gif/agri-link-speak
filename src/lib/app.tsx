import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "farmer" | "customer" | "bulk_buyer";

export type Profile = {
  id: string;
  user_id: string | null;
  role: string;
  name: string;
  phone: string | null;
  language: string;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  trust_score: number;
  badges: string[];
};

export type CartLine = {
  cropId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
};

type Settings = { fontScale: number; contrast: boolean; dark: boolean; voice: boolean };

const DEFAULT_SETTINGS: Settings = { fontScale: 1, contrast: false, dark: false, voice: true };

type AppValue = {
  loading: boolean;
  profile: Profile | null;
  role: Role | null;
  setRolePreference: (role: Role) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  cart: CartLine[];
  addToCart: (line: CartLine) => void;
  removeFromCart: (cropId: string) => void;
  clearCart: () => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
};

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const loadProfile = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", auth.user.id)
      .maybeSingle();
    if (data) {
      setProfile(data as Profile);
      setRole(data.role as Role);
    }
  }, []);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("fd.role") as Role | null;
    if (storedRole) setRole(storedRole);
    const storedCart = window.localStorage.getItem("fd.cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart) as CartLine[]);
      } catch {
        /* ignore corrupt cart */
      }
    }
    const storedSettings = window.localStorage.getItem("fd.settings");
    if (storedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...(JSON.parse(storedSettings) as Settings) });
      } catch {
        /* ignore */
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void loadProfile();
      }
    });
    void loadProfile().finally(() => setLoading(false));
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-scale", String(settings.fontScale));
    root.classList.toggle("dark", settings.dark);
    root.classList.toggle("contrast-boost", settings.contrast);
  }, [settings]);

  const setRolePreference = useCallback((next: Role) => {
    setRole(next);
    window.localStorage.setItem("fd.role", next);
  }, []);

  const persistCart = useCallback((next: CartLine[]) => {
    setCart(next);
    window.localStorage.setItem("fd.cart", JSON.stringify(next));
  }, []);

  const value = useMemo<AppValue>(
    () => ({
      loading,
      profile,
      role,
      setRolePreference,
      refreshProfile: loadProfile,
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
        persistCart([]);
      },
      cart,
      addToCart: (line) => {
        const existing = cart.find((l) => l.cropId === line.cropId);
        persistCart(
          existing
            ? cart.map((l) =>
                l.cropId === line.cropId ? { ...l, quantity: l.quantity + line.quantity } : l,
              )
            : [...cart, line],
        );
      },
      removeFromCart: (cropId) => persistCart(cart.filter((l) => l.cropId !== cropId)),
      clearCart: () => persistCart([]),
      settings,
      updateSettings: (patch) => {
        const next = { ...settings, ...patch };
        setSettings(next);
        window.localStorage.setItem("fd.settings", JSON.stringify(next));
      },
    }),
    [loading, profile, role, setRolePreference, loadProfile, cart, persistCart, settings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/** Phone + PIN sign-in, mapped onto a stable internal account id. */
export function credentialsFor(phone: string, pin: string) {
  const clean = phone.replace(/\D/g, "");
  return { email: `${clean}@farmdirect.app`, password: `fd-${clean}-${pin}` };
}

export function distanceKm(
  a: { lat: number | null; lng: number | null },
  b: { lat: number | null; lng: number | null },
) {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10;
}

export const rupees = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
