"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import CountUp from "react-countup";
import { FadeIn } from "@/components/animations/FadeIn";

export function Stats() {
  const [dbStats, setDbStats] = useState({
    active_jobs: { value: 0, suffix: "+" },
    companies: { value: 0, suffix: "+" },
    success_stories: { value: 0, suffix: "+" }
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await (supabase.from("site_statistics") as any).select("*").eq("id", 1).single();
      if (data) {
        const parseValue = (str: string) => {
          const value = parseInt(str.replace(/[^0-9]/g, "")) || 0;
          const suffix = str.replace(/[0-9]/g, "");
          return { value, suffix };
        };
        setDbStats({
          active_jobs: parseValue(data.active_jobs),
          companies: parseValue(data.companies),
          success_stories: parseValue(data.success_stories)
        });
      }
    };
    fetchStats();
  }, []);

  if (dbStats.active_jobs.value === 0) return null;

  const stats = [
    { value: dbStats.active_jobs.value, suffix: dbStats.active_jobs.suffix, label: "Active Jobs", desc: "Across premium sectors" },
    { value: dbStats.companies.value, suffix: dbStats.companies.suffix, label: "Verified Companies", desc: "Top tier enterprises" },
    { value: 0, suffix: "+", label: "Global Locations", desc: "Opportunities worldwide" },
    { value: dbStats.success_stories.value, suffix: dbStats.success_stories.suffix, label: "Success Stories", desc: "Careers transformed" },
  ];

  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          alt="Corporate Office" 
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Delivering <span className="text-accent italic">Excellence</span> at Scale
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
              Our platform is trusted by thousands of professionals and enterprises to bridge the gap between elite talent and world-class organizations.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full hover:-translate-y-2 transition-transform duration-300 group">
                <h3 className="text-5xl md:text-6xl font-heading font-bold text-accent mb-2">
                  <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />
                  {stat.suffix}
                </h3>
                <p className="font-bold text-white text-lg">{stat.label}</p>
                <p className="text-sm text-gray-400 mt-2">{stat.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
