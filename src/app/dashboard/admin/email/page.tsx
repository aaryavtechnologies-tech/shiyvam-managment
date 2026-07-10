import { Construction } from "lucide-react";

export default function EmailPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight capitalize">Email</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage Email configuration and settings.</p>
      </div>

      <div className="bg-white border-2 border-border border-dashed rounded-[2rem] h-96 flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
          <Construction className="text-muted-foreground w-10 h-10" />
        </div>
        <h3 className="font-heading text-2xl font-extrabold mb-2 text-foreground">Under Construction</h3>
        <p className="text-muted-foreground font-medium max-w-sm">
          The Email module is currently being built. Check back soon for the full feature set.
        </p>
      </div>
    </div>
  );
}