"use client";

import { Users, Briefcase, Building2, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const stats = [
  { label: "Total Users", value: "24,592", change: "+12.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Active Jobs", value: "3,402", change: "+5.2%", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Applications", value: "89,402", change: "+18.2%", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
  { label: "Companies", value: "1,204", change: "+2.4%", icon: Building2, color: "text-orange-600", bg: "bg-orange-100" },
];

const chartData = [
  { name: "Jan", applications: 4000, jobs: 2400 },
  { name: "Feb", applications: 3000, jobs: 1398 },
  { name: "Mar", applications: 2000, jobs: 9800 },
  { name: "Apr", applications: 2780, jobs: 3908 },
  { name: "May", applications: 1890, jobs: 4800 },
  { name: "Jun", applications: 2390, jobs: 3800 },
  { name: "Jul", applications: 3490, jobs: 4300 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Overview</h1>
          <p className="text-muted-foreground font-medium mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2 text-sm font-semibold text-muted-foreground bg-white px-3 py-1.5 rounded-lg border border-border">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> System Healthy</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.1}>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={16} />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-semibold mb-1">{stat.label}</p>
                <h3 className="font-heading font-extrabold text-3xl">{stat.value}</h3>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Activity Metrics</h3>
            <select className="text-sm font-semibold border-border rounded-lg bg-muted/50 px-3 py-1">
              <option>Last 7 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-start relative">
                {i !== 5 && <div className="absolute top-8 left-[19px] bottom-[-24px] w-px bg-border"></div>}
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                  <TrendingUp size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">New employer registered</p>
                  <p className="text-xs text-muted-foreground mt-0.5">TechCorp Inc. joined the platform</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-medium">{i * 12} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
