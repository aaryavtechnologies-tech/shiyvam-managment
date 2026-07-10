"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  
  const [debouncedQuery] = useDebounce(query, 500);
  const [debouncedLocation] = useDebounce(location, 500);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([name, value]) => {
        if (value === null || value === "") newSearchParams.delete(name);
        else newSearchParams.set(name, value);
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (debouncedQuery !== (searchParams.get("q") || "") || 
        debouncedLocation !== (searchParams.get("location") || "")) {
      router.push(pathname + "?" + createQueryString({
        q: debouncedQuery,
        location: debouncedLocation
      }));
    }
  }, [debouncedQuery, debouncedLocation, pathname, router, searchParams, createQueryString]);

  return (
    <div className="bg-white p-4 rounded-[2rem] border border-border shadow-md flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto w-full">
      <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1 flex items-center px-4 bg-muted/50 rounded-xl h-14">
          <Search className="text-muted-foreground mr-3 shrink-0" size={24} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job Title or Keyword" 
            className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-lg w-full outline-none font-medium"
          />
        </div>
        <div className="w-px bg-border hidden md:block my-2"></div>
        <div className="flex-1 flex items-center px-4 bg-muted/50 rounded-xl h-14">
          <MapPin className="text-muted-foreground mr-3 shrink-0" size={24} />
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Remote, NY)" 
            className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-lg w-full outline-none font-medium"
          />
        </div>
      </div>
    </div>
  );
}

export function JobSidebarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([name, value]) => {
        if (value === null || value === "") newSearchParams.delete(name);
        else newSearchParams.set(name, value);
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleFilterToggle = (key: string, value: string) => {
    const current = searchParams.get(key) || "";
    const values = current ? current.split(",") : [];
    let newValues;
    if (values.includes(value)) {
      newValues = values.filter(v => v !== value);
    } else {
      newValues = [...values, value];
    }
    router.push(pathname + "?" + createQueryString({ [key]: newValues.length ? newValues.join(",") : null }));
  };

  const isChecked = (key: string, value: string) => {
    const current = searchParams.get(key) || "";
    return current.split(",").includes(value);
  };

  const hasFilters = Array.from(searchParams.keys()).filter(k => k !== 'q' && k !== 'location').length > 0;

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-3xl border-2 border-border shadow-md p-6 sticky top-32">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-border">
          <div className="flex items-center gap-2 font-heading font-extrabold text-xl">
            <Filter size={24} />
            Filters
          </div>
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-foreground h-auto px-2 py-1"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.delete("type");
                newSearchParams.delete("mode");
                newSearchParams.delete("exp");
                router.push(pathname + "?" + newSearchParams.toString());
              }}
            >
              Clear
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Job Type</h3>
            <div className="space-y-2">
              {["Full-time", "Part-time", "Contract", "Freelance"].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center shrink-0 \${
                    isChecked("type", type) ? "bg-primary border-primary" : "border-border group-hover:border-primary"
                  }`}>
                    {isChecked("type", type) && <div className="w-2.5 h-2.5 bg-primary-foreground rounded-sm" />}
                  </div>
                  <span className="font-semibold text-muted-foreground group-hover:text-foreground text-sm">{type}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isChecked("type", type)}
                    onChange={() => handleFilterToggle("type", type)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Work Mode</h3>
            <div className="space-y-2">
              {["Remote", "Hybrid", "On-site"].map(mode => (
                <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center shrink-0 \${
                    isChecked("mode", mode) ? "bg-primary border-primary" : "border-border group-hover:border-primary"
                  }`}>
                    {isChecked("mode", mode) && <div className="w-2.5 h-2.5 bg-primary-foreground rounded-sm" />}
                  </div>
                  <span className="font-semibold text-muted-foreground group-hover:text-foreground text-sm">{mode}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isChecked("mode", mode)}
                    onChange={() => handleFilterToggle("mode", mode)}
                  />
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Experience</h3>
            <div className="space-y-2">
              {["Entry Level", "Mid Level", "Senior Level", "Director"].map(exp => (
                <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center shrink-0 \${
                    isChecked("exp", exp) ? "bg-primary border-primary" : "border-border group-hover:border-primary"
                  }`}>
                    {isChecked("exp", exp) && <div className="w-2.5 h-2.5 bg-primary-foreground rounded-sm" />}
                  </div>
                  <span className="font-semibold text-muted-foreground group-hover:text-foreground text-sm">{exp}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isChecked("exp", exp)}
                    onChange={() => handleFilterToggle("exp", exp)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
