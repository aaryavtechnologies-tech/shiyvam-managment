"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createAdminUser } from "@/app/actions/admin-management";
import { Save, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingStats, setSavingStats] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [stats, setStats] = useState({
    active_jobs: "",
    companies: "",
    success_stories: ""
  });
  
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_statistics")
      .select("*")
      .eq("id", 1)
      .single();
    
    if (data) {
      const d = data as any;
      setStats({
        active_jobs: d.active_jobs,
        companies: d.companies,
        success_stories: d.success_stories
      });
    }
    setLoading(false);
  };

  const handleSaveStats = async () => {
    setSavingStats(true);
    const { error } = await (supabase
      .from("site_statistics") as any)
      .update(stats)
      .eq("id", 1);
    
    if (error) {
      toast.error("Failed to update statistics");
    } else {
      toast.success("Statistics updated successfully");
    }
    setSavingStats(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatingAdmin(true);
    const formData = new FormData(e.currentTarget);
    const result = await createAdminUser(formData);
    
    if (result.success) {
      toast.success("New admin user created successfully");
      formRef.current?.reset();
    } else {
      toast.error(result.error || "Failed to create admin user");
    }
    setCreatingAdmin(false);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage platform configuration and administrative users.</p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="stats" className="w-40">Platform Statistics</TabsTrigger>
          <TabsTrigger value="admins" className="w-40">Admin Management</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 max-w-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Hero Section Numbers</h2>
              <Button onClick={handleSaveStats} disabled={savingStats} className="bg-primary text-white h-9 px-4 rounded-xl text-sm">
                {savingStats ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Stats
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Active Jobs Label</label>
              <Input 
                value={stats.active_jobs}
                onChange={(e) => setStats({...stats, active_jobs: e.target.value})}
                placeholder="e.g. 1500+"
                className="bg-gray-50 h-11"
              />
              <p className="text-xs text-gray-500">Displayed in the Hero section</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Hiring Partners Label</label>
              <Input 
                value={stats.companies}
                onChange={(e) => setStats({...stats, companies: e.target.value})}
                placeholder="e.g. 500+"
                className="bg-gray-50 h-11"
              />
              <p className="text-xs text-gray-500">Displayed in the Statistics section</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Success Stories Label</label>
              <Input 
                value={stats.success_stories}
                onChange={(e) => setStats({...stats, success_stories: e.target.value})}
                placeholder="e.g. 50K+"
                className="bg-gray-50 h-11"
              />
              <p className="text-xs text-gray-500">Displayed in the Statistics section</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="admins">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
            <div className="pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-900">Create New Admin</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new user with full administrative privileges.</p>
            </div>
            
            <form ref={formRef} onSubmit={handleCreateAdmin} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <Input name="fullName" required placeholder="John Doe" className="bg-gray-50 h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <Input name="phone" placeholder="+1 234 567 890" className="bg-gray-50 h-11" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <Input type="email" name="email" required placeholder="admin@example.com" className="bg-gray-50 h-11" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password <span className="text-red-500">*</span></label>
                <Input type="password" name="password" required placeholder="••••••••" minLength={6} className="bg-gray-50 h-11" />
                <p className="text-xs text-gray-500">Minimum 6 characters required.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={creatingAdmin} className="bg-primary text-white h-11 px-8 rounded-xl">
                  {creatingAdmin ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Create Admin
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}