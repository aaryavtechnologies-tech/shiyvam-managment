"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

const stories = [
  {
    name: "Vikram Sharma",
    role: "Finance Executive",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    before: { title: "Senior Analyst", salary: "₹12L/yr", company: "Mid-cap Firm" },
    after: { title: "VP – Finance", salary: "₹42L/yr", company: "Goldman Sachs" },
    increase: "+250%",
  },
  {
    name: "Anjali Kapoor",
    role: "Management Consultant",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    before: { title: "Business Analyst", salary: "₹8L/yr", company: "Regional Firm" },
    after: { title: "Senior Manager", salary: "₹35L/yr", company: "McKinsey & Co." },
    increase: "+340%",
  },
  {
    name: "Rohan Mehta",
    role: "Technology Leader",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    before: { title: "Software Engineer", salary: "₹15L/yr", company: "Startup" },
    after: { title: "Engineering Director", salary: "₹68L/yr", company: "Accenture" },
    increase: "+353%",
  },
];

export function SuccessStories() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">Proven Results</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Career <span className="italic text-accent">Transformations</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Real professionals, real placements, remarkable salary growth.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <FadeIn key={story.name} delay={i * 0.15} direction="up">
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                {/* Top section with photo */}
                <div className="relative h-28 bg-primary">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
                  <div className="absolute -bottom-8 left-6">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-md"
                    />
                  </div>
                  {/* Increase badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent font-bold text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <TrendingUp size={14} />
                    {story.increase} Salary
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 p-6">
                  <h3 className="font-bold text-xl text-primary">{story.name}</h3>
                  <p className="text-gray-400 font-medium text-sm mb-6">{story.role}</p>

                  {/* Before / After */}
                  <div className="flex items-stretch gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Before</p>
                      <p className="font-bold text-gray-700 text-sm">{story.before.title}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{story.before.company}</p>
                      <p className="font-heading font-bold text-primary mt-2 text-sm">{story.before.salary}</p>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <ArrowRight size={14} className="text-accent" />
                      </div>
                    </div>

                    <div className="flex-1 bg-primary/5 rounded-xl p-4 border border-primary/10">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">After</p>
                      <p className="font-bold text-primary text-sm">{story.after.title}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{story.after.company}</p>
                      <p className="font-heading font-bold text-accent mt-2 text-sm">{story.after.salary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
