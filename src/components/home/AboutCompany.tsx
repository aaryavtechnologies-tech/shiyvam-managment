"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { Briefcase, Users, FileSearch, TrendingUp, UserPlus } from "lucide-react";

const services = [
  { icon: Briefcase, title: "Recruitment Services", desc: "End-to-end talent acquisition tailored to your unique organizational needs." },
  { icon: Users, title: "Executive Hiring", desc: "Discrete and specialized search for C-suite and senior leadership roles." },
  { icon: UserPlus, title: "Staffing Solutions", desc: "Flexible, scalable staffing models from contract to permanent placements." },
  { icon: TrendingUp, title: "Career Guidance", desc: "Expert counseling and resources to help professionals navigate their career paths." },
  { icon: FileSearch, title: "Employer Hiring Support", desc: "Comprehensive support for HR teams to streamline the hiring process." },
];

export function AboutCompany() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2">
            <FadeIn>
              <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">About Us</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                About <span className="italic text-accent">Shivyam</span> Management Services Pvt Ltd
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We are a premier recruitment and staffing firm dedicated to bridging the gap between top-tier talent and industry-leading organizations. Our holistic approach ensures long-term success for both candidates and employers.
              </p>
              
              <div className="space-y-6">
                {services.map((service, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                      <service.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{service.title}</h4>
                      <p className="text-gray-500">{service.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2">
            <FadeIn delay={0.2} className="relative">
              <div className="absolute inset-0 bg-accent/10 rounded-[2rem] transform rotate-3 translate-x-4 translate-y-4"></div>
              <div className="relative w-full h-[600px] rounded-[2rem] shadow-2xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                  alt="Our Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  10+
                </div>
                <div>
                  <p className="font-bold text-gray-900">Years of</p>
                  <p className="text-accent font-semibold">Excellence</p>
                </div>
              </div>
            </FadeIn>
          </div>
          
        </div>
      </div>
    </section>
  );
}
