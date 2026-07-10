import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopNav } from "@/components/admin/TopNav";

import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify Admin Role
  const adminSupabase = createAdminClient();
  const { data: userData } = await adminSupabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") {
    redirect("/unauthorized");
  }

  // Verify PIN Unlock Cookie
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("admin_unlocked");
  if (!unlocked || unlocked.value !== "true") {
    redirect("/admin-login");
  }

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav userEmail={user.email || ""} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
