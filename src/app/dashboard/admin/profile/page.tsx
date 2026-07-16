"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAdminProfile, changeAdminPassword } from "@/app/actions/admin-management";
import { toast } from "sonner";
import { Loader2, User, Lock, Save, Mail, Phone, Shield } from "lucide-react";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: ""
  });

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (data) {
        setProfile({
          email: data.email,
          full_name: data.full_name || "",
          phone: data.phone || "",
          role: data.role || "Admin"
        });
      }
    }
    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateAdminProfile(formData);
    
    if (result.success) {
      toast.success("Profile updated successfully");
      fetchProfile();
    } else {
      toast.error(result.error || "Failed to update profile");
    }
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingPassword(true);
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      setSavingPassword(false);
      return;
    }
    
    const result = await changeAdminPassword(formData);
    
    if (result.success) {
      toast.success("Password changed successfully");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Failed to change password");
    }
    setSavingPassword(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl pb-10">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-primary">My Profile</h1>
        <p className="text-muted-foreground font-medium mt-2">
          Manage your personal information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center text-center relative overflow-hidden">
             <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary relative">
               <User size={40} />
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-accent rounded-full border-2 border-white flex items-center justify-center text-white">
                 <Shield size={12} />
               </div>
             </div>
             <h2 className="text-xl font-bold text-foreground">{profile.full_name || "Admin User"}</h2>
             <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">{profile.role}</p>
             <div className="w-full h-px bg-border my-4"></div>
             <div className="w-full text-left space-y-3">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Mail size={16} className="text-gray-400" />
                 <span className="truncate">{profile.email}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Phone size={16} className="text-gray-400" />
                 <span>{profile.phone || "No phone added"}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Personal Information */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gray-50/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User size={20} className="text-primary" /> Personal Information
              </h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <Input name="fullName" defaultValue={profile.full_name} required placeholder="John Doe" className="bg-gray-50 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address (Read Only)</label>
                  <Input value={profile.email} disabled className="bg-gray-100 h-12 cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                <Input name="phone" defaultValue={profile.phone} placeholder="+1 234 567 890" className="bg-gray-50 h-12" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={savingProfile} className="bg-primary text-white h-11 px-8 rounded-xl">
                  {savingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security / Password */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gray-50/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Lock size={20} className="text-accent" /> Security
              </h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Current Password</label>
                <Input type="password" name="currentPassword" required placeholder="••••••••" className="bg-gray-50 h-12" />
              </div>
              <div className="w-full h-px bg-border/50"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">New Password</label>
                  <Input type="password" name="newPassword" required placeholder="••••••••" className="bg-gray-50 h-12" minLength={6} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <Input type="password" name="confirmPassword" required placeholder="••••••••" className="bg-gray-50 h-12" minLength={6} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={savingPassword} className="bg-accent text-primary h-11 px-8 rounded-xl hover:bg-accent/90 hover:text-white transition-colors">
                  {savingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                  Update Password
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
