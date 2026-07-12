"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import {toast} from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    setSaving(true);
    const { error } = await (supabase
      .from("site_statistics") as any)
      .update(stats)
      .eq("id", 1);
    
    if (error) {
      toast.error("Failed to update statistics");
    } else {
      toast.success("Statistics updated successfully");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Platform Statistics</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the numbers shown on the homepage hero section.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-white">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Active Jobs Label</label>
          <Input 
            value={stats.active_jobs}
            onChange={(e) => setStats({...stats, active_jobs: e.target.value})}
            placeholder="e.g. 1500+"
          />
          <p className="text-xs text-gray-500">Displayed in the Hero section</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Hiring Partners Label</label>
          <Input 
            value={stats.companies}
            onChange={(e) => setStats({...stats, companies: e.target.value})}
            placeholder="e.g. 500+"
          />
          <p className="text-xs text-gray-500">Displayed in the Statistics section</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Success Stories Label</label>
          <Input 
            value={stats.success_stories}
            onChange={(e) => setStats({...stats, success_stories: e.target.value})}
            placeholder="e.g. 50K+"
          />
          <p className="text-xs text-gray-500">Displayed in the Statistics section</p>
        </div>
      </div>
    </div>
  );
}