"use client";

import { Search, Bell, Moon, Sun, Keyboard, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { signOutAction } from "@/actions/auth";
import { useState } from "react";

export function TopNav({ userEmail }: { userEmail: string }) {
  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b-2 border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      
      {/* Left: Search */}
      <div className="flex-1 flex items-center lg:ml-0 ml-12">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search anywhere..." 
            className="w-full pl-10 pr-12 py-2 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all font-medium text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden md:inline-flex items-center justify-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
          <Search size={20} />
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground rounded-full"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-muted p-1 pr-3 rounded-full transition-colors border-2 border-transparent hover:border-border"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold hidden sm:block">Admin</span>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-border shadow-sm rounded-xl py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b-2 border-border mb-2">
                  <p className="font-bold text-sm">Signed in as</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                
                <button className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-2">
                  <User size={16} /> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <div className="h-px bg-border my-2" />
                <form action={signOutAction} className="w-full">
                  <button type="submit" className="w-full text-left px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
