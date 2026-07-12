"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export function TrustedBy() {
  const [companies, setCompanies] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await (supabase.from("trusted_companies") as any).select("name").eq("is_active", true);
      if (data && data.length > 0) {
        setCompanies(data.map((c: any) => c.name));
      }
    };
    fetchCompanies();
  }, []);

  if (companies.length === 0) return null;

  // Duplicate for infinite scroll
  const marqueeItems = [...companies, ...companies, ...companies, ...companies];

  return (
    <section className="py-10 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center font-semibold text-gray-400 text-sm tracking-[0.2em] uppercase">
          Trusted by Industry Leaders
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden opacity-60 hover:opacity-100 transition-opacity duration-500">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap gap-16 px-8 items-center"
        >
          {marqueeItems.map((company, index) => (
            <div 
              key={`${company}-${index}`} 
              className="text-2xl font-heading font-bold text-gray-400 hover:text-primary transition-colors cursor-default"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
