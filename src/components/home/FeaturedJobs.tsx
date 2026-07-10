"use client";

import { useState } from "react";
import { MapPin, Clock, IndianRupee, Bookmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";

const filters = ["All", "Remote", "Full Time", "Hybrid", "Internship"];

const jobs = [
  {
    company: "Goldman Sachs",
    initials: "GS",
    role: "Vice President – Equity Research",
    salary: "₹40L - ₹65L",
    location: "Mumbai, MH",
    type: "Full Time",
    experience: "8+ Years",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    tag: "Finance",
  },
  {
    company: "McKinsey & Co.",
    initials: "MC",
    role: "Senior Engagement Manager",
    salary: "₹55L - ₹90L",
    location: "New Delhi",
    type: "Hybrid",
    experience: "6+ Years",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    tag: "Consulting",
  },
  {
    company: "Deloitte India",
    initials: "DT",
    role: "Risk Advisory Director",
    salary: "₹45L - ₹70L",
    location: "Bengaluru, KA",
    type: "Full Time",
    experience: "10+ Years",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    tag: "Advisory",
  },
  {
    company: "Accenture",
    initials: "AC",
    role: "Technology Lead – Cloud",
    salary: "₹25L - ₹40L",
    location: "Pune, MH",
    type: "Hybrid",
    experience: "5+ Years",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    tag: "Technology",
  },
  {
    company: "JP Morgan",
    initials: "JP",
    role: "Executive Director – IB",
    salary: "₹80L - ₹1.2Cr",
    location: "Mumbai, MH",
    type: "Full Time",
    experience: "12+ Years",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    tag: "Banking",
  },
  {
    company: "PwC India",
    initials: "PW",
    role: "Partner – Tax & Regulatory",
    salary: "₹1Cr+",
    location: "All India",
    type: "Full Time",
    experience: "15+ Years",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    tag: "Consulting",
  },
];

export function FeaturedJobs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);

  const filteredJobs = activeFilter === "All" ? jobs : jobs.filter(job => job.type === activeFilter);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <FadeIn>
            <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">Now Hiring</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
              Featured <span className="italic text-accent">Positions</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Curated senior-level opportunities from top-tier organizations.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm border transition-all ${
                    activeFilter === filter
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, i) => (
            <FadeIn key={`${job.company}-${job.role}`} delay={i * 0.1} direction="up">
              <div className="border border-gray-100 rounded-2xl p-6 flex flex-col h-full bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-heading font-bold text-base border border-gray-100 shadow-sm ${job.badgeBg} ${job.badgeText}`}>
                      {job.initials}
                    </div>
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${job.badgeBg} ${job.badgeText}`}>{job.tag}</span>
                      <h4 className="font-bold text-base text-primary leading-tight mt-1">{job.role}</h4>
                      <p className="text-gray-400 font-medium text-sm">{job.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSaved(prev => prev.includes(i) ? prev.filter(s => s !== i) : [...prev, i])}
                    className={`p-2 rounded-full transition-colors ${saved.includes(i) ? "text-accent bg-accent/10" : "text-gray-300 hover:text-primary hover:bg-gray-50"}`}
                  >
                    <Bookmark size={18} fill={saved.includes(i) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-100 rounded-lg px-3 py-1.5 font-medium text-xs flex items-center gap-1.5">
                    <MapPin size={12} /> {job.location}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-100 rounded-lg px-3 py-1.5 font-medium text-xs flex items-center gap-1.5">
                    <Clock size={12} /> {job.type}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-100 rounded-lg px-3 py-1.5 font-medium text-xs flex items-center gap-1.5">
                    <IndianRupee size={12} /> {job.salary}
                  </Badge>
                </div>

                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-400">{job.experience} Experience</span>
                  <Button className="rounded-xl bg-primary text-white font-semibold text-sm px-5 py-2 h-auto hover:bg-accent hover:text-primary transition-all group-hover:gap-2 flex items-center gap-1.5">
                    Apply <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <FadeIn>
            <Link href="/jobs">
              <Button variant="outline" className="rounded-xl border-2 border-primary text-primary font-bold text-base px-10 py-6 h-auto hover:bg-primary hover:text-white transition-all">
                View All Positions
              </Button>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
