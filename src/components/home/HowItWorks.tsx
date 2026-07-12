"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Build a comprehensive professional profile highlighting your skills, experience, and career ambitions.",
    img: "https://images.unsplash.com/photo-1565728744382-61accd4aa148?q=80&w=800&auto=format&fit=crop",
  },
  {
    step: "02",
    title: "Discover Opportunities",
    desc: "Our intelligent matching engine surfaces only the most relevant, high-value positions for your profile.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    step: "03",
    title: "Apply with Confidence",
    desc: "Submit polished applications with one click, backed by our expert preparation resources.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    step: "04",
    title: "Land Your Role",
    desc: "Get placed in a premium position and accelerate your career to new heights.",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="text-center mb-20">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">The Process</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            How Shivyam <span className="italic text-accent">Works</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            A streamlined, four-step journey from profile creation to your next career milestone.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-primary via-accent to-primary z-0"></div>

          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.15} direction="up">
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Image Circle */}
                <div className="relative mb-8 z-10">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-accent/30 group-hover:ring-accent transition-all duration-300">
                    <Image
                      src={step.img}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="144px"
                    />
                    <div className="absolute inset-0 bg-primary/30 rounded-full group-hover:bg-primary/10 transition-all duration-300"></div>
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-accent text-primary font-heading font-bold text-sm flex items-center justify-center border-2 border-white shadow-md">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-primary mb-3">{step.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed px-2">{step.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
