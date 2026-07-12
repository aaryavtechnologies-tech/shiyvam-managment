"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { ArrowRight, TrendingUp, User } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function SuccessStories() {
  const [stories, setStories] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await (supabase.from("success_stories") as any).select("*").eq("is_active", true);
      if (data) setStories(data);
    };
    fetchItems();
  }, []);

  if (stories.length === 0) return null;

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
                    {story.image_url ? (
                      <div className="relative w-16 h-16 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
                        <Image
                          src={story.image_url}
                          alt={story.candidate_name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-md">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  {/* Increase badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent font-bold text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <TrendingUp size={14} />
                    {story.salary_hike}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 p-6">
                  <h3 className="font-bold text-xl text-primary">{story.candidate_name}</h3>
                  <p className="text-gray-400 font-medium text-sm mb-6">{story.previous_role} &rarr; {story.new_role}</p>

                  {/* Before / After */}
                  <div className="flex items-stretch gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Previous</p>
                      <p className="font-bold text-gray-700 text-sm">{story.previous_role}</p>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <ArrowRight size={14} className="text-accent" />
                      </div>
                    </div>

                    <div className="flex-1 bg-primary/5 rounded-xl p-4 border border-primary/10">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">New</p>
                      <p className="font-bold text-primary text-sm">{story.new_role}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{story.company}</p>
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
