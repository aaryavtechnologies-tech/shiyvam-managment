import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { createClient } from "@/lib/supabase/server";
import { Building, Briefcase, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function CompaniesPage(props: { searchParams: Promise<{ page?: string; query?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1", 10);
  const query = searchParams.query || "";
  const limit = 9; // 9 companies per page
  
  const from = (page - 1) * limit;
  const to = page * limit - 1;

  const supabase = await createClient();
  let dbQuery = supabase
    .from("companies")
    .select("id, name, logo_url, industry, location, jobs(id)", { count: "exact" });
    
  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data: companies, count, error } = await dbQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* HEADER SECTION */}
      <div className="bg-muted/20 border-b-2 border-border pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase mb-4 text-foreground tracking-tight">
            Top Companies
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8">
            Discover and apply to top employers. Find the workplace that fits your career goals.
          </p>

          <form className="max-w-xl mx-auto flex gap-3 relative" action="/companies" method="GET">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                name="query"
                defaultValue={query}
                placeholder="Search companies by name..." 
                className="w-full h-14 pl-12 rounded-2xl border-2 border-border shadow-sm text-lg font-bold bg-white"
              />
            </div>
            <Button type="submit" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-lg">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* COMPANIES GRID */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
        {error ? (
          <div className="p-8 text-center bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 font-bold">
            Error loading companies. Please try again later.
          </div>
        ) : !companies || companies.length === 0 ? (
          <div className="p-16 text-center border-2 border-border border-dashed rounded-[2rem] bg-muted/30">
            <Building className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-heading text-2xl font-extrabold mb-2">No companies found</h3>
            <p className="text-muted-foreground font-medium">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {companies.map((company: any) => (
                <Link key={company.id} href={`/companies/${company.id}`} className="group bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading text-2xl font-bold text-muted-foreground">
                          {company.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-extrabold group-hover:text-primary transition-colors line-clamp-1">{company.name}</h3>
                      <p className="text-muted-foreground font-medium text-sm flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {company.location || "Multiple Locations"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t-2 border-border flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-xl text-sm font-bold">
                      {company.industry || "General"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-primary font-bold">
                      <Briefcase size={16} />
                      {company.jobs ? company.jobs.length : 0} Jobs
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                {page > 1 ? (
                  <Link href={`/companies?page=${page - 1}${query ? `&query=${query}` : ""}`}>
                    <Button variant="outline" className="border-2 border-border shadow-sm font-bold">
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="border-2 border-border opacity-50 font-bold">
                    Previous
                  </Button>
                )}
                
                <span className="font-bold text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link href={`/companies?page=${page + 1}${query ? `&query=${query}` : ""}`}>
                    <Button variant="outline" className="border-2 border-border shadow-sm font-bold">
                      Next
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="border-2 border-border opacity-50 font-bold">
                    Next
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
