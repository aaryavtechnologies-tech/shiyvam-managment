

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Building, Briefcase, FileText, 
  BarChart, Settings, LifeBuoy, Bell, Mail, Shield, 
  Activity, ChevronLeft, ChevronRight, Menu, Image as ImageIcon, Box, Star, MessageSquare, TrendingUp
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/employers", label: "Employers", icon: Building },
  { href: "/dashboard/admin/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/admin/applications", label: "Applications", icon: FileText },
];

const contentNavItems = [
  { href: "/dashboard/admin/companies", label: "Trusted Partners", icon: Star },
  { href: "/dashboard/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/dashboard/admin/success-stories", label: "Success Stories", icon: TrendingUp },
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
    <div className="mb-8">
      {!isCollapsed && <h4 className="px-5 text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">{title}</h4>}
      <nav className="space-y-1.5 px-3">
        {items.map((item) => {
          const isActive = item.href === "/dashboard/admin" 
            ? pathname === "/dashboard/admin" 
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                isActive 
                  ? "bg-accent text-primary shadow-lg shadow-accent/20 font-bold" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={18} className={isActive ? "text-primary" : "text-white/70 group-hover:text-white"} />
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-primary text-white rounded-xl shadow-lg border border-white/10"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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
        className={`fixed lg:sticky top-0 left-0 h-screen bg-primary border-r border-white/5 z-50 flex flex-col transition-shadow shadow-xl \${isMobileOpen ? 'shadow-2xl' : ''}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 shrink-0 bg-white/5">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 font-heading font-extrabold text-2xl text-white tracking-tight"
              >
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary shadow-lg shadow-accent/20">S</div>
                <span>Admin<span className="text-accent">.</span></span>
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary font-heading font-extrabold text-xl mx-auto shadow-lg shadow-accent/20">S</div>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors absolute -right-3.5 top-6 border border-white/10 shadow-sm backdrop-blur-md"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          <NavGroup title="Main" items={mainNavItems} />
          <NavGroup title="Content" items={contentNavItems} />
          <NavGroup title="System" items={settingsNavItems} />
        </div>
        
        {/* Footer Area */}
        {!isCollapsed && (
          <div className="p-5 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">SuperAdmin</p>
                <p className="text-xs font-medium text-white/50">Full Access</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
