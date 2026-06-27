import { cn } from "@/lib/utils";
import {
  BadgePercent,
  Bell,
  Briefcase,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Tags,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";
import { useMenu } from "@/hooks/useMenu";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/offers", label: "Offers", icon: BadgePercent },
  { to: "/ads", label: "Ads", icon: Megaphone },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/areas", label: "Areas", icon: MapPin },
  { to: "/users", label: "Users", icon: Users },
];

const Sidebar = () => {
  const { open, setOpen } = useMenu();

  return (
    <aside
      className={cn(
        "fixed inset-0 h-screen z-40 w-64 transform transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5 text-sidebar-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-bold">
          B
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">BlueMatrouh</div>
          <div className="text-[11px] text-sidebar-foreground/70">
            Admin Console
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
