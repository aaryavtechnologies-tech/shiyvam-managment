"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Lock, Shield, UserX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">

        <Card className="p-8 border-2 border-border shadow-md rounded-2xl bg-white space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-border pb-4">
            <Lock className="text-secondary" />
            <h2 className="text-xl font-black font-heading">Security &amp; Password</h2>
          </div>
          
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label className="font-bold">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="border-2 border-border rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">New Password</Label>
              <Input type="password" placeholder="••••••••" className="border-2 border-border rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" className="border-2 border-border rounded-xl font-medium" />
            </div>
            <Button className="mt-2 font-bold border-2 border-border shadow-sm rounded-xl">Update Password</Button>
          </div>
        </Card>

        <Card className="p-8 border-2 border-border shadow-md rounded-2xl bg-white space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-border pb-4">
            <Bell className="text-secondary" />
            <h2 className="text-xl font-black font-heading">Email Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="notif-1" defaultChecked className="border-2 border-border rounded" />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="notif-1" className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  New Applications
                </label>
                <p className="text-sm text-muted-foreground font-medium">Receive an email when a candidate applies to your job.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="notif-2" defaultChecked className="border-2 border-border rounded" />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="notif-2" className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Weekly Summary
                </label>
                <p className="text-sm text-muted-foreground font-medium">Receive a weekly performance report of your active jobs.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="notif-3" className="border-2 border-border rounded" />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="notif-3" className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Marketing & Tips
                </label>
                <p className="text-sm text-muted-foreground font-medium">Receive emails about new features and hiring tips.</p>
              </div>
            </div>
            <Button className="mt-4 font-bold border-2 border-border shadow-sm rounded-xl">Save Preferences</Button>
          </div>
        </Card>

        <Card className="p-8 border-2 border-red-200 bg-red-50 shadow-md rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-red-200 pb-4">
            <Shield className="text-red-600" />
            <h2 className="text-xl font-black font-heading text-red-900">Danger Zone</h2>
          </div>
          
          <div>
            <h3 className="font-bold text-red-900 mb-1">Deactivate Account</h3>
            <p className="text-sm text-red-700 font-medium mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive" className="font-bold border-2 border-red-700 rounded-xl gap-2 shadow-sm">
              <UserX size={18} /> Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
