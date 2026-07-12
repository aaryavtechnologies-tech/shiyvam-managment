"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Target, TrendingUp, Users } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

const features = [
  { icon: Target, title: "Precision Matching", desc: "Our proprietary algorithm ensures you only see opportunities that perfectly align with your career trajectory.", color: "text-primary" },
  { icon: ShieldCheck, title: "Verified Partners", desc: "We partner exclusively with vetted, top-tier enterprises to guarantee the quality of every position.", color: "text-accent" },
  { icon: Users, title: "Executive Network", desc: "Gain access to an exclusive network of industry leaders and hiring managers.", color: "text-primary" },
  { icon: TrendingUp, title: "Career Advancement", desc: "Accelerate your professional growth with opportunities designed for high-achievers.", color: "text-accent" },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Professional Image */}
          <div className="relative order-2 lg:order-1 h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
             <FadeIn direction="right" className="w-full h-full relative">
                <Image 
                  src="/business_meeting.png" 
                  alt="Business Meeting" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
               
               {/* Floating elements */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-10 left-[-20px] lg:left-[-30px] bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 z-10"
               >
                 <div className="bg-accent/20 p-2 rounded-full">
                   <CheckCircle2 className="text-accent" size={28} />
                 </div>
                 <div>
                   <span className="font-bold text-gray-800 block text-lg">Premium Tier</span>
                   <span className="text-sm text-gray-500 font-medium">Exclusive Access</span>
                 </div>
               </motion.div>
             </FadeIn>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <FadeIn>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-primary leading-tight">
                Why Industry Leaders <br/> <span className="italic text-accent">Choose Us</span>
              </h2>
              <p className="text-gray-500 text-lg mb-12 max-w-lg font-medium leading-relaxed">
                We provide the premier infrastructure for high-level professionals to discover, connect, and secure roles at the world's most innovative organizations.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
              {features.map((feature, i) => (
                <FadeIn key={i} delay={0.1 * i} direction="up">
                  <div className="group">
                    <div className={`mb-5 inline-flex p-3 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm`}>
                      <feature.icon className={`transition-colors duration-300 group-hover:text-white ${feature.color}`} size={28} />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-primary">{feature.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
