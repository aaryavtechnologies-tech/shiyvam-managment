"use client";

import { Card } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const viewsData = [
  { name: 'Mon', views: 400 },
  { name: 'Tue', views: 300 },
  { name: 'Wed', views: 550 },
  { name: 'Thu', views: 450 },
  { name: 'Fri', views: 700 },
  { name: 'Sat', views: 200 },
  { name: 'Sun', views: 350 },
];

const jobsData = [
  { name: 'Frontend Dev', applications: 120 },
  { name: 'Backend Dev', applications: 85 },
  { name: 'UI Designer', applications: 60 },
  { name: 'Product Mgr', applications: 40 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Analytics</h1>
          <p className="text-muted-foreground font-medium mt-1">Track your job posting performance and candidate engagement.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-4 rounded-xl border-2 border-border font-bold gap-2 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
            <Download size={18} />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
          <h3 className="text-muted-foreground font-bold mb-2">Total Job Views</h3>
          <p className="font-heading text-4xl font-black">24.5k</p>
          <p className="text-sm text-green-600 font-bold mt-2">+14.5% vs last month</p>
        </Card>
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
          <h3 className="text-muted-foreground font-bold mb-2">Total Applications</h3>
          <p className="font-heading text-4xl font-black">3,492</p>
          <p className="text-sm text-green-600 font-bold mt-2">+5.2% vs last month</p>
        </Card>
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
          <h3 className="text-muted-foreground font-bold mb-2">Conversion Rate</h3>
          <p className="font-heading text-4xl font-black">14.2%</p>
          <p className="text-sm text-red-600 font-bold mt-2">-1.1% vs last month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
          <h2 className="text-xl font-black font-heading mb-6">Profile Views (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="views" stroke="var(--secondary)" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
          <h2 className="text-xl font-black font-heading mb-6">Applications per Job</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: '2px solid hsl(var(--border))', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold' }}
                  cursor={{fill: 'hsl(var(--muted)/0.3)'}}
                />
                <Bar dataKey="applications" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
