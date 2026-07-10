import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-3xl border border-border shadow-md">
        <div className="flex justify-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-full">
            <ShieldAlert size={48} strokeWidth={1.5} />
          </div>
        </div>
        
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground font-medium">
            You do not have permission to view this page. If you believe this is a mistake, please contact support.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center justify-center w-full h-12 text-base font-bold rounded-xl border border-border bg-primary text-primary-foreground shadow-md hover:bg-primary hover:-translate-y-1 hover:shadow-lg transition-all"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
