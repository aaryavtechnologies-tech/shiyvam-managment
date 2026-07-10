"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Building, Briefcase, FileText, 
  BarChart, Settings, LifeBuoy, Bell, Mail, Shield, 
  Activity, ChevronLeft, ChevronRight, Menu, Image as ImageIcon, Box
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/employers", label: "Employers", icon: Building },
  { href: "/dashboard/admin/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/admin/applications", label: "Applications", icon: FileText },
];

const contentNavItems = [
  { href: "/dashboard/admin/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/dashboard/admin/email", label: "Email Center", icon: Mail },
  { href: "/dashboard/admin/notifications", label: "Notifications", icon: Bell },
];

const settingsNavItems = [
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/admin/system-status", label: "System Status", icon: Activity },
  { href: "/dashboard/admin/help", label: "Help Center", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavGroup = ({ title, items }: { title: string, items: typeof mainNavItems }) => (
    <div className="mb-6">
      {!isCollapsed && <h4 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{title}</h4>}
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold \${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} className={isActive ? "text-primary-foreground" : ""} />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border-2 border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? (isMobileOpen ? 0 : -320) : 0
        }}
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r-2 border-border z-50 flex flex-col transition-shadow shadow-sm lg:shadow-none \${isMobileOpen ? 'shadow-2xl' : ''}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b-2 border-border shrink-0">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 font-heading font-extrabold text-2xl"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">S</div>
                <span>Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-heading font-extrabold mx-auto">S</div>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors absolute -right-4 top-4 bg-white border-2 border-border shadow-sm"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin">
          <NavGroup title="Main" items={mainNavItems} />
          <NavGroup title="Content" items={contentNavItems} />
          <NavGroup title="System" items={settingsNavItems} />
        </div>
      </motion.aside>
    </>
  );
}
