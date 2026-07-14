"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animations/FadeIn";

const tags = ["Leadership", "Management", "Finance", "Operations", "Consulting", "HR"];

export function Hero() {
  const [stats, setStats] = useState({ active_jobs: "0+", success_stories: "0% Success" });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await (supabase.from("site_statistics") as any).select("*").eq("id", 1).single();
      if (data) {
        setStats({
          active_jobs: data.active_jobs,
          success_stories: data.success_stories
        });
      }
    };
    fetchStats();
  }, []);
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center bg-primary">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/40 to-transparent"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-start gap-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm font-semibold text-sm text-white">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> 
                Trusted by Top Enterprises
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                Connecting <br />
                <span className="text-accent relative inline-block italic pr-4">
                  Top Talent
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl mt-2 block">with India's Leading Companies</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
                Connect with elite organizations and discover premium opportunities in management, finance, and operations. Your next big career move starts here.
              </p>
            </FadeIn>

            {/* Search Box */}
            <FadeIn delay={0.3} className="w-full max-w-2xl">
              <div className="bg-white p-3 rounded-xl shadow-2xl flex flex-col md:flex-row gap-3 relative z-20">
                <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-accent/50 transition-all">
                  <Search className="text-gray-400 mr-3" size={20} />
                  <Input 
                    placeholder="Job Title or Keyword" 
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-gray-700 text-base h-12"
                  />
                </div>
                <div className="w-px bg-gray-200 hidden md:block my-2"></div>
                <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-accent/50 transition-all">
                  <MapPin className="text-gray-400 mr-3" size={20} />
                  <Input 
                    placeholder="Location" 
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-gray-700 text-base h-12"
                  />
                </div>
                <Button className="rounded-lg bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-8 h-12 shadow-md transition-all">
                  Search
                </Button>
              </div>
            </FadeIn>

            {/* Popular Tags */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-400">Trending:</span>
                {tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Image Area */}
          <div className="relative h-[600px] hidden lg:block">
            <FadeIn delay={0.2} direction="left" className="w-full h-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[85%] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" 
                  alt="Corporate Professionals" 
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              </div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-24 left-0 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4 border border-gray-100"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Active Jobs</p>
                  <p className="font-heading font-bold text-2xl text-primary">{stats.active_jobs}</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 -left-8 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Premium Placements</p>
                  <p className="font-heading font-bold text-2xl text-primary">{stats.success_stories}</p>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
