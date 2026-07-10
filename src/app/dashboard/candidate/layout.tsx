import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Navbar } from "@/components/home/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { User, Briefcase, Bookmark, Home } from "lucide-react";

export const metadata = {
  title: "Candidate Dashboard",
};

export default async function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore(); // Always fetch fresh data — never cache onboarding_completed
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware already handles unauthenticated users, but guard here too
  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = createAdminClient();
  const { data: profile, error } = await supabaseAdmin
    .from("users")
    .select("role, full_name, onboarding_completed")
    .eq("id", user.id)
    .single() as any;
    
  if (error) {
    console.error("Layout Profile Fetch Error:", error);
  }

  // Wrong role → redirect to their correct dashboard
  if (profile?.role && profile.role !== "candidate") {
    redirect(`/dashboard/${profile.role}`);
  }

  // Onboarding not complete → send to onboarding
  // NOTE: /onboarding is NOT guarded by the dashboard middleware,
  // so this will not cause a redirect loop.
  if (!profile?.onboarding_completed) {
    redirect("/onboarding/candidate");
  }

  const navItems = [
    { label: "Overview", href: "/dashboard/candidate", icon: <Home size={20} /> },
    { label: "My Profile", href: "/dashboard/candidate/profile", icon: <User size={20} /> },
    { label: "Applications", href: "/dashboard/candidate/applications", icon: <Briefcase size={20} /> },
    { label: "Saved Jobs", href: "/dashboard/candidate/saved", icon: <Bookmark size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Navbar />

      {/* Add pt-24 (padding top) to push content below the fixed Navbar */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 pt-24 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <Sidebar items={navItems} userName={profile?.full_name || "Candidate"} />
        </aside>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
