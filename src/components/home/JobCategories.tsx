"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

const categories: { title: string; jobs: number; img: string }[] = [];

export function JobCategories() {
  if (categories.length === 0) return null;
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">Explore Opportunities</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-primary">
            Find Your <span className="italic">Ideal Sector</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Discover thousands of premium opportunities spanning every major industry sector.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <FadeIn key={cat.title} delay={i * 0.05} direction="up">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-48 shadow-md"
              >
                {/* Background Image */}
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Navy Overlay */}
                <div className="absolute inset-0 bg-primary/70 group-hover:bg-primary/80 transition-all duration-300"></div>
                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="font-heading font-bold text-lg text-white leading-tight">{cat.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-300 font-medium">{cat.jobs} Open Roles</p>
                    <span className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} className="text-accent" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-12 text-center">
          <FadeIn>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-accent transition-colors group">
              Browse All Categories
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
