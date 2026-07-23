import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Users, Briefcase, Building, FileText, TrendingUp, AlertCircle, ArrowUpRight, Award, IndianRupee, Clock } from "lucide-react";
import { GrowthChart, CategoriesChart } from "@/components/admin/DashboardCharts";

export const metadata = {
  title: "Admin Dashboard | Shivyam Management Services",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Real stats fetch
  const [
    { count: usersCount },
    { count: employersCount },
    { count: jobsCount },
    { count: applicationsCount }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "employer"),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true })
  ]);

  // Real-time Queries for New Metrics
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    { count: monthlyPlacements },
    { count: pendingApprovals },
    { count: newEmployersCount },
    { count: candidatesThisMonth },
    { count: candidatesLastMonth },
  ] = await Promise.all([
    supabaseAdmin.from("applications").select("*", { count: "exact", head: true }).eq("status", "Hired").gte("updated_at", startOfMonth),
    supabaseAdmin.from("jobs").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "employer").gte("created_at", startOfMonth),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "candidate").gte("created_at", startOfMonth),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "candidate").gte("created_at", startOfLastMonth).lt("created_at", startOfMonth),
  ]);

  let candidateGrowthPercentage = 0;
  if (candidatesLastMonth && candidatesLastMonth > 0) {
    candidateGrowthPercentage = Math.round(((candidatesThisMonth || 0) - candidatesLastMonth) / candidatesLastMonth * 100);
  } else if (candidatesThisMonth && candidatesThisMonth > 0) {
    candidateGrowthPercentage = 100; // 100% growth if there were 0 last month and >0 this month
  }
  const candidateGrowth = `${candidateGrowthPercentage >= 0 ? '+' : ''}${candidateGrowthPercentage}%`;
  
  const revenueSummary = "₹ 0"; // TODO: Implement payments table and replace this mock

  // Server-side Aggregations for Charts
  const { data: rawUsers, error: usersErr } = await supabaseAdmin.from("users").select("created_at");
  const { data: rawJobs, error: jobsErr } = await supabaseAdmin.from("jobs").select("created_at, department");

  // Format Growth Data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const growthMap = new Map();
  const currentMonth = new Date().getMonth();
  for (let i = 6; i >= 0; i--) {
    let m = currentMonth - i;
    if (m < 0) m += 12;
    growthMap.set(months[m], { name: months[m], users: 0, jobs: 0 });
  }

  rawUsers?.forEach((u: any) => {
    const d = new Date(u.created_at);
    if (d > new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000)) {
      const monthName = months[d.getMonth()];
      if (growthMap.has(monthName)) {
        growthMap.get(monthName).users += 1;
      }
    }
  });

  rawJobs?.forEach((j: any) => {
    const d = new Date(j.created_at);
    if (d > new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000)) {
      const monthName = months[d.getMonth()];
      if (growthMap.has(monthName)) {
        growthMap.get(monthName).jobs += 1;
      }
    }
  });
  let growthData = Array.from(growthMap.values());
  if (growthData.every((g: any) => g.users === 0 && g.jobs === 0)) {
    // Fallback data so it doesn't appear empty during initial testing
    growthData = [
      { name: months[(currentMonth - 6 + 12) % 12], users: 15, jobs: 5 },
      { name: months[(currentMonth - 5 + 12) % 12], users: 25, jobs: 10 },
      { name: months[(currentMonth - 4 + 12) % 12], users: 40, jobs: 20 },
      { name: months[(currentMonth - 3 + 12) % 12], users: 55, jobs: 25 },
      { name: months[(currentMonth - 2 + 12) % 12], users: 70, jobs: 35 },
      { name: months[(currentMonth - 1 + 12) % 12], users: 95, jobs: 45 },
      { name: months[currentMonth], users: 120, jobs: 60 },
    ];
  }

  // Format Category Data
  const catMap = new Map();
  rawJobs?.forEach((j: any) => {
    const dept = j.department || "Other";
    catMap.set(dept, (catMap.get(dept) || 0) + 1);
  });
  let categoryData = Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (categoryData.length === 0) {
    // Fallback data
    categoryData = [
      { name: "Engineering", count: 45 },
      { name: "Marketing", count: 30 },
      { name: "Design", count: 25 },
      { name: "Sales", count: 20 },
      { name: "Finance", count: 15 },
    ];
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Good Morning, Admin 👋</h1>
          <p className="text-muted-foreground font-medium text-lg mt-2">Here is what's happening on your platform today.</p>
        </div>
        <div className="flex gap-3">
          {usersCount && usersCount > 0 ? (
            <button className="px-4 py-2 bg-white border-2 border-border rounded-xl font-bold hover:bg-muted transition-colors shadow-sm">
              Download Report
            </button>
          ) : (
            <div className="px-4 py-2 bg-muted/50 border-2 border-border border-dashed rounded-xl font-bold text-muted-foreground shadow-sm">
              Not enough data for reports
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={usersCount || 0} 
          icon={<Users className="text-blue-500" />} 
          trend={candidateGrowth} 
          trendUp={true} 
          bg="bg-blue-50" 
          border="border-blue-200" 
        />
        <StatCard 
          title="Employers" 
          value={employersCount || 0} 
          icon={<Building className="text-purple-500" />} 
          trend="+5%" 
          trendUp={true} 
          bg="bg-purple-50" 
          border="border-purple-200" 
        />
        <StatCard 
          title="Active Jobs" 
          value={jobsCount || 0} 
          icon={<Briefcase className="text-emerald-500" />} 
          trend="+18%" 
          trendUp={true} 
          bg="bg-emerald-50" 
          border="border-emerald-200" 
        />
        <StatCard 
          title="Applications" 
          value={applicationsCount || 0} 
          icon={<FileText className="text-amber-500" />} 
          trend="+24%" 
          trendUp={true} 
          bg="bg-amber-50" 
          border="border-amber-200" 
        />
        <StatCard 
          title="Monthly Placements" 
          value={monthlyPlacements || 0} 
          icon={<Award className="text-indigo-500" />} 
          trend={monthlyPlacements && monthlyPlacements > 0 ? "+Active" : "Stable"} 
          trendUp={true} 
          bg="bg-indigo-50" 
          border="border-indigo-200" 
        />
        <StatCard 
          title="Revenue Summary" 
          value={revenueSummary} 
          icon={<IndianRupee className="text-green-500" />} 
          trend="No Data" 
          trendUp={true} 
          bg="bg-green-50" 
          border="border-green-200" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={pendingApprovals || 0} 
          icon={<Clock className="text-orange-500" />} 
          trend={(pendingApprovals || 0) > 0 ? "Needs Action" : "All clear"} 
          trendUp={(pendingApprovals || 0) === 0} 
          bg="bg-orange-50" 
          border="border-orange-200" 
        />
        <StatCard 
          title="New Employers" 
          value={newEmployersCount || 0} 
          icon={<Building className="text-pink-500" />} 
          trend="This Month" 
          trendUp={true} 
          bg="bg-pink-50" 
          border="border-pink-200" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* MAIN CHART */}
        <div className="lg:col-span-2 bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading font-extrabold text-xl">Platform Growth</h2>
              <p className="text-sm font-medium text-muted-foreground">Users vs Jobs over the last 7 months</p>
            </div>
            <select className="border-2 border-border rounded-lg px-3 py-1.5 text-sm font-bold bg-muted/50 focus:outline-none focus:border-primary">
              <option>Last 7 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <GrowthChart data={growthData} />
        </div>

        {/* CATEGORY CHART */}
        <div className="bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-heading font-extrabold text-xl">Top Categories</h2>
            <p className="text-sm font-medium text-muted-foreground">Most active job categories</p>
          </div>
          <CategoriesChart data={categoryData} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QUICK ACTIONS */}
        <div className="bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm">
          <h2 className="font-heading font-extrabold text-xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<Briefcase />} label="Approve Jobs" desc="3 pending approvals" alert />
            <QuickAction icon={<Building />} label="Verify Companies" desc="1 pending verification" alert />
            <QuickAction icon={<FileText />} label="New Blog Post" desc="Create CMS content" />
            <QuickAction icon={<TrendingUp />} label="View Reports" desc="Export CSV data" />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm">
          <h2 className="font-heading font-extrabold text-xl mb-6">Recent Activity</h2>
          <div className="space-y-6">
            <ActivityItem icon={<Users />} title="New user registered" time="2 mins ago" desc="John Doe joined as Candidate." />
            <ActivityItem icon={<Briefcase />} title="New job posted" time="1 hour ago" desc="TechCorp posted 'Senior React Developer'." />
            <ActivityItem icon={<FileText />} title="Application submitted" time="3 hours ago" desc="Sarah applied to 'Backend Engineer'." />
            <ActivityItem icon={<Building />} title="Company updated" time="5 hours ago" desc="Acme Inc updated their profile." />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, bg, border }: any) {
  return (
    <div className={`bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm flex flex-col`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center \${bg} \${border}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg \${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trendUp ? <ArrowUpRight size={16} /> : <AlertCircle size={16} />}
          {trend}
        </div>
      </div>
      <p className="text-muted-foreground font-bold text-sm mb-1">{title}</p>
      <h3 className="font-heading font-extrabold text-4xl">{value}</h3>
    </div>
  );
}

function QuickAction({ icon, label, desc, alert }: any) {
  return (
    <button className="flex flex-col items-start p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-muted/30 transition-colors text-left relative group">
      {alert && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
      <div className="text-muted-foreground group-hover:text-primary transition-colors mb-3">
        {icon}
      </div>
      <p className="font-bold text-foreground mb-1">{label}</p>
      <p className="text-xs font-semibold text-muted-foreground">{desc}</p>
    </button>
  );
}

function ActivityItem({ icon, title, time, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-border bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm">{title}</p>
          <span className="text-xs font-semibold text-muted-foreground">• {time}</span>
        </div>
        <p className="text-sm text-muted-foreground font-medium">{desc}</p>
      </div>
    </div>
  );
}
