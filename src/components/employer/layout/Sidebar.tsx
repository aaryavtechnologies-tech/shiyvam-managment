"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

interface SidebarProps {
  items: { label: string; href: string; icon: React.ReactNode }[];
  companyName: string;
}

export function Sidebar({ items, companyName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-[2rem] border-2 border-border shadow-md overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-24">
      <div className="p-6 border-b-2 border-border bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary rounded-xl border-2 border-border shadow-sm flex items-center justify-center text-secondary-foreground font-heading font-extrabold text-xl">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-lg truncate">{companyName}</h3>
            <p className="text-sm font-medium text-muted-foreground truncate">Employer</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard/employer' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-secondary text-secondary-foreground shadow-sm -translate-y-0.5' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t-2 border-border bg-muted/20">
        <form action={signOutAction}>
          <Button type="submit" variant="outline" className="w-full justify-start h-12 rounded-xl border border-border font-bold text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
