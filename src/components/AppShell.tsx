import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Home,
  Leaf,
  ListOrdered,
  Search,
  Settings,
  ShoppingBasket,
  Sprout,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { MicAssistant } from "@/components/MicAssistant";
import { useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

type NavItem = { to: string; icon: LucideIcon; label: string };

export function AppShell({
  title,
  children,
  right,
}: {
  title?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  const { role, cart } = useApp();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const farmerNav: NavItem[] = [
    { to: "/farmer", icon: Home, label: t("home") },
    { to: "/farmer/crops", icon: Sprout, label: t("myCrops") },
    { to: "/farmer/orders", icon: ListOrdered, label: t("orders") },
    { to: "/bulk", icon: TrendingUp, label: t("demand") },
    { to: "/settings", icon: Settings, label: t("profile") },
  ];

  const customerNav: NavItem[] = [
    { to: "/market", icon: Home, label: t("home") },
    { to: "/secondary", icon: Leaf, label: t("secondaryMarket") },
    { to: "/cart", icon: ShoppingBasket, label: t("cart") },
    { to: "/orders", icon: ListOrdered, label: t("orders") },
    { to: "/settings", icon: Settings, label: t("profile") },
  ];

  const nav = role === "farmer" ? farmerNav : customerNav;
  const cartCount = cart.reduce((sum, line) => sum + 1, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-sm items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sprout className="size-5" />
            </span>
          </Link>
          <h1 className="flex-1 truncate text-xl font-bold">{title ?? t("appName")}</h1>
          {right}
          <Link to="/notifications" aria-label={t("notifications")} className="rounded-full p-2">
            <Bell className="size-6" />
          </Link>
        </div>
      </header>

      <main className="page">{children}</main>

      <MicAssistant />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card">
        <div className="mx-auto flex w-full max-w-screen-sm">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-[0.7rem] font-semibold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="size-6" />
                  {item.icon === ShoppingBasket && cartCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[0.6rem] text-accent-foreground">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate px-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function SearchHint() {
  const { t } = useI18n();
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Search className="size-4" /> {t("listen")}
    </p>
  );
}
