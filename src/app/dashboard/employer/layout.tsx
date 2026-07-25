import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

import { Sidebar } from "@/components/employer/layout/Sidebar";
import { TopNav } from "@/components/employer/layout/TopNav";
import { LayoutDashboard, Briefcase, Users, FileText, BarChart3, Settings, Building2 } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

export default async function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = createAdminClient();
  const { data: profile, error } = await supabaseAdmin
    .from("users")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .single() as any;
    
  if (error) {
    console.error("Layout Profile Fetch Error:", error);
  }

  if (profile?.role !== "employer") {
    redirect(`/dashboard/${profile?.role || 'candidate'}`);
  }

  if (!profile?.onboarding_completed) {
    redirect("/onboarding/employer");
  }

  // Fetch company basic info for the sidebar
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("employer_id", user.id)
    .single();

  const sidebarItems = [
    { label: "Dashboard", href: "/dashboard/employer", icon: <LayoutDashboard size={20} /> },
    { label: "Company Profile", href: "/dashboard/employer/profile", icon: <Building2 size={20} /> },
    { label: "Jobs", href: "/dashboard/employer/jobs", icon: <Briefcase size={20} /> },
    { label: "Applications", href: "/dashboard/employer/applications", icon: <FileText size={20} /> },
    { label: "Candidates", href: "/dashboard/employer/candidates", icon: <Users size={20} /> },
    { label: "Analytics", href: "/dashboard/employer/analytics", icon: <BarChart3 size={20} /> },
    { label: "Settings", href: "/dashboard/employer/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-foreground font-sans selection:bg-secondary/30 selection:text-secondary-foreground">
      <TopNav userEmail={user.email || ""} />
      
      <div className="max-w-[1600px] mx-auto p-6 pt-12 md:p-8 md:pt-16 flex gap-8 relative items-start">
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <Sidebar items={sidebarItems} companyName={company?.name || "Company"} />
        </aside>
        
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
