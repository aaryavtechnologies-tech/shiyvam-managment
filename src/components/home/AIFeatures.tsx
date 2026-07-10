"use client";

import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, LineChart, Target } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

const features = [
  { icon: BrainCircuit, title: "Resume Intelligence", desc: "AI-powered feedback that optimizes your profile for ATS systems and human reviewers alike." },
  { icon: Sparkles, title: "Executive Coaching", desc: "Personalized AI guidance to help you articulate your value proposition and ace senior-level interviews." },
  { icon: LineChart, title: "Market Intelligence", desc: "Real-time salary benchmarking and compensation data to ensure you negotiate from a position of strength." },
  { icon: Target, title: "Precision Matching", desc: "Proprietary algorithms surface only the highest-relevance opportunities for your unique profile." },
];

export function AIFeatures() {
  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
          alt="Technology"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 font-semibold text-sm backdrop-blur-sm">
                <Sparkles className="text-accent" size={16} />
                <span>AI-Powered Platform</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Intelligent Tools for <br />
                <span className="text-accent italic">Elite Placement</span>
              </h2>
              <p className="text-gray-300 text-lg mb-12 max-w-lg font-medium leading-relaxed">
                Leverage cutting-edge AI to position yourself ahead of the competition and connect with roles that truly match your executive potential.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((feature, i) => (
                <FadeIn key={feature.title} delay={i * 0.1} direction="up">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm">
                    <div className="w-11 h-11 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center mb-5 text-accent group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                      <feature.icon size={22} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Right: Corporate image with floating overlay cards */}
          <div className="relative h-[600px] hidden lg:block">
            <FadeIn direction="left" delay={0.3} className="w-full h-full relative">
              <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop"
                  alt="AI Technology Dashboard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/40"></div>
              </div>

              {/* Match Score Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 -left-8 bg-white p-5 rounded-xl shadow-xl border border-gray-100 z-20"
              >
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">AI Match Score</p>
                <p className="text-3xl font-heading font-bold text-accent">98%</p>
                <p className="text-xs text-primary font-medium mt-1">Perfect Alignment</p>
              </motion.div>

              {/* Roles Matched Card */}
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-20 -right-6 bg-white p-5 rounded-xl shadow-xl border border-gray-100 z-20"
              >
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">New Matches Today</p>
                <p className="text-3xl font-heading font-bold text-primary">47</p>
                <p className="text-xs text-accent font-medium mt-1">Senior Roles</p>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
