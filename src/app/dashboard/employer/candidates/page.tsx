import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Search, Filter, MapPin, Briefcase, Mail, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const supabaseAdmin = createAdminClient();

  // Fetch candidate profiles and join with users to get email
  let query = supabaseAdmin
    .from("candidate_profiles")
    .select(`
      *,
      user:users(email)
    `);

  // Basic server-side filtering on headline or skills if search param exists
  if (q) {
    query = query.or(`headline.ilike.%${q}%,skills.cs.{${q}}`);
  }

  const { data: candidates, error } = await query;
  
  if (error) {
    console.error("Error fetching candidates:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Talent Pool</h1>
          <p className="text-muted-foreground font-medium mt-1">Browse and discover top candidates for your company.</p>
        </div>
      </div>

      <Card className="border-2 border-border shadow-md rounded-2xl overflow-hidden bg-white p-6">
        <form className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              name="q"
              defaultValue={q}
              placeholder="Search by role, skills, or keywords..."
              className="pl-10 h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium bg-white"
            />
          </div>
          <Button type="submit" className="h-12 px-8 rounded-xl border border-border bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all font-bold">
            Search
          </Button>
          <Button type="button" variant="outline" className="h-12 px-4 rounded-xl border-2 border-border font-bold bg-white">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {candidates && candidates.length > 0 ? (
            candidates.map((candidate: any) => {
              const name = candidate.headline ? candidate.headline.split(' - ')[0] : 'Candidate'; // Just a fallback if name isn't stored directly here
              const title = candidate.headline || 'Professional';
              
              return (
                <Card key={candidate.id} className="p-6 border-2 border-border shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1 transition-all flex flex-col h-full bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {candidate.profile_image ? (
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-border shadow-sm">
                          <img src={candidate.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-heading font-black text-2xl border-2 border-border shadow-sm">
                          <User size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-1">
                          {candidate.city && <span className="flex items-center gap-1"><MapPin size={14} /> {candidate.city}</span>}
                          {candidate.experience_level && <span className="flex items-center gap-1 ml-2"><Briefcase size={14} /> {candidate.experience_level}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {candidate.bio && (
                      <p className="text-sm font-medium line-clamp-2 text-muted-foreground">
                        {candidate.bio}
                      </p>
                    )}

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {candidate.skills.slice(0, 4).map((skill: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-muted/30 border-2 border-border rounded-full text-xs font-bold text-foreground">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="px-2.5 py-1 bg-muted/10 border-2 border-border rounded-full text-xs font-bold text-muted-foreground">
                            +{candidate.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-border flex gap-3 justify-between">
                    <Button variant="outline" className="flex-1 border-2 border-border rounded-lg font-bold shadow-sm">
                      View Profile
                    </Button>
                    {candidate.resume_url && (
                      <Button variant="secondary" className="px-4 rounded-lg font-bold shadow-sm">
                        <Download size={16} />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
              <div className="w-16 h-16 bg-white rounded-full border-2 border-border shadow-sm flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No candidates found</h3>
              <p className="text-muted-foreground font-medium max-w-md mx-auto">
                {q ? `We couldn't find any candidates matching "${q}". Try adjusting your search.` : "The talent pool is currently empty. Check back later!"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
