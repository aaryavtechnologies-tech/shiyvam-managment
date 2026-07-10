"use client";

import { Card } from "@/components/ui/card";
import { Briefcase, Users, FileText, TrendingUp, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', applications: 4 },
  { name: 'Tue', applications: 7 },
  { name: 'Wed', applications: 5 },
  { name: 'Thu', applications: 12 },
  { name: 'Fri', applications: 8 },
  { name: 'Sat', applications: 15 },
  { name: 'Sun', applications: 10 },
];

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground font-medium mt-1">Here's what's happening with your job postings today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/employer/jobs/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all border-2 border-border bg-secondary text-secondary-foreground hover:bg-secondary hover:-translate-y-0.5 shadow-md hover:shadow-lg h-11 px-6">
            Post New Job
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Jobs", value: "12", icon: Briefcase, color: "bg-blue-100 text-blue-700 border-blue-200", trend: "+2 this week" },
          { label: "Total Applications", value: "248", icon: FileText, color: "bg-purple-100 text-purple-700 border-purple-200", trend: "+14% this month" },
          { label: "Shortlisted", value: "45", icon: Users, color: "bg-green-100 text-green-700 border-green-200", trend: "3 awaiting interview" },
          { label: "Profile Views", value: "1.2k", icon: TrendingUp, color: "bg-orange-100 text-orange-700 border-orange-200", trend: "+5% vs last week" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-2 border-border shadow-md rounded-2xl hover:-translate-y-1 transition-transform cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-3xl font-black font-heading mb-1">{stat.value}</h3>
            <p className="font-bold text-muted-foreground mb-2">{stat.label}</p>
            <p className="text-sm font-medium text-primary/70">{stat.trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 p-6 border-2 border-border shadow-md rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black font-heading">Applications Overview</h2>
              <p className="text-sm text-muted-foreground font-medium">Last 7 days performance</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: '2px solid hsl(var(--border))', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="applications" stroke="var(--secondary)" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black font-heading">Recent Activity</h2>
          </div>
          <div className="space-y-6 flex-1">
            {[
              { text: "New application for Senior React Developer", time: "2 hours ago", color: "bg-blue-500" },
              { text: "Interview scheduled with Sarah Jenkins", time: "5 hours ago", color: "bg-green-500" },
              { text: "Job 'Product Manager' is expiring soon", time: "1 day ago", color: "bg-orange-500" },
              { text: "5 candidates shortlisted for UI Designer", time: "2 days ago", color: "bg-purple-500" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 3 && <div className="absolute left-2.5 top-7 bottom-[-24px] w-0.5 bg-border"></div>}
                <div className={`w-5 h-5 rounded-full border-2 border-border mt-1 z-10 shrink-0 shadow-sm ${activity.color}`}></div>
                <div>
                  <p className="font-bold text-sm">{activity.text}</p>
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock size={12} /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/employer/applications" className="mt-6 flex items-center justify-center gap-2 font-bold text-sm text-secondary hover:text-secondary/80 transition-colors">
            View all activity <ChevronRight size={16} />
          </Link>
        </Card>
      </div>
    </div>
  );
}
