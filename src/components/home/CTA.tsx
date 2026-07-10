"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/88"></div>
      </div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm font-semibold text-sm text-accent mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Join 50,000+ Professionals Today
          </div>

          <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            Your Next Chapter <br />
            <span className="text-accent italic">Starts Here.</span>
          </h2>

          <p className="text-xl font-medium max-w-2xl mx-auto mb-14 text-gray-300 leading-relaxed">
            Connect with elite organizations, unlock exclusive opportunities, and take the most important step in your career journey today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto text-base font-bold px-10 py-5 rounded-xl bg-accent text-primary hover:bg-accent/90 shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              Get Started — It's Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto text-base font-bold px-10 py-5 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              Browse Positions
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
