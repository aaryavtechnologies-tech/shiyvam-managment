"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2, 
  FileText, 
  Settings, 
  ShieldAlert, 
  MapPin, 
  Tags,
  MessageSquare,
  LogOut,
  Bell,
  LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users/employers", label: "Employers", icon: Users },
  { href: "/admin/users/candidates", label: "Candidates", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/cms", label: "CMS", icon: LayoutTemplate },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/reports", label: "Reports", icon: ShieldAlert },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white text-foreground">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <ShieldAlert size={20} strokeWidth={2.5} />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight">
            SuperAdmin
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-primary" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start text-muted-foreground font-bold">
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
