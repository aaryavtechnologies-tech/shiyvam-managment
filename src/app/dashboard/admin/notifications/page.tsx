"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Check, CheckCircle2, ChevronRight, Briefcase, UserPlus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAlertAsRead, markAllAlertsAsRead } from "@/actions/admin/alerts";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type AdminAlert = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_link: string | null;
  created_at: string;
};

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAlerts() {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("admin_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setAlerts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const res = await markAlertAsRead(id);
    if (res.success) {
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllAlertsAsRead();
    if (res.success) {
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
      toast.success("All notifications marked as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'registration': return <UserPlus className="text-blue-500" size={24} />;
      case 'job': return <Briefcase className="text-purple-500" size={24} />;
      case 'verification': return <ShieldAlert className="text-amber-500" size={24} />;
      default: return <Bell className="text-muted-foreground" size={24} />;
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground font-medium mt-1">
            You have {unreadCount} unread alert{unreadCount !== 1 && 's'}.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={handleMarkAllRead}
            className="font-bold border-2"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border-2 border-border rounded-[2rem] shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white border-2 border-border border-dashed rounded-[2rem] h-64 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Check className="text-muted-foreground w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-extrabold mb-1 text-foreground">All caught up!</h3>
          <p className="text-muted-foreground font-medium">There are no new alerts at this time.</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-6 flex items-start gap-4 transition-colors \${
                  !alert.is_read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
                }`}
              >
                <div className={`mt-1 p-2 rounded-2xl \${!alert.is_read ? 'bg-white shadow-sm' : 'bg-muted'}`}>
                  {getIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-lg font-bold truncate \${!alert.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {alert.title}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 \${!alert.is_read ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {alert.action_link && (
                      <Link href={alert.action_link}>
                        <Button size="sm" className="h-8 rounded-lg font-bold">
                          View Details <ChevronRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    )}
                    
                    {!alert.is_read && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="h-8 rounded-lg font-bold text-muted-foreground hover:text-foreground"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
                
                {!alert.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-3 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}