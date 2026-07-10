"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminTopbar({ userEmail }: { userEmail: string }) {
  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
        
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border w-64 max-w-sm cursor-text">
          <Search size={16} />
          <span className="flex-1">Search... (⌘K)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold leading-none">{userEmail.split('@')[0]}</p>
            <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
          </div>
          <Avatar className="w-9 h-9 border-2 border-primary">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {userEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
