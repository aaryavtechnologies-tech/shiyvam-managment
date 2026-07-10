"use client";

import Link from "next/link";
import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  userEmail: string;
}

export function TopNav({ userEmail }: TopNavProps) {
  return (
    <header className="bg-white border-b-2 border-border h-20 flex items-center px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex-1 flex items-center gap-6">
        <Link href="/dashboard/employer" className="font-heading font-black text-2xl tracking-tight hover:-translate-y-0.5 transition-transform">
          Employer<span className="text-secondary">Portal</span>
        </Link>
        
        <div className="hidden md:flex relative max-w-md w-full ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text"
            placeholder="Search jobs, candidates..."
            className="w-full h-11 pl-10 pr-4 bg-muted/30 border-2 border-border rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl border-2 border-transparent hover:border-border hover:bg-muted/30 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white"></span>
        </Button>
        
        <Link href="/dashboard/employer/jobs/new">
          <Button className="h-11 px-5 rounded-xl border border-border bg-secondary text-secondary-foreground shadow-md hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg transition-all font-bold gap-2">
            <Plus size={18} />
            Post a Job
          </Button>
        </Link>
      </div>
    </header>
  );
}
