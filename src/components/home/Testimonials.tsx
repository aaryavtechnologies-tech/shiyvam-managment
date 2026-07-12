"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const supabase = createClient();

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await (supabase.from("testimonials") as any).select("*").eq("is_active", true);
      if (data) setTestimonials(data);
    };
    fetchItems();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">Testimonials</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Voices of <span className="italic text-accent">Success</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium max-w-lg">
              Hear directly from the professionals who transformed their careers on our platform.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {testimonials.map((t, i) => (
                <div className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.3%] pr-6" key={i}>
                  <div className="border border-gray-100 rounded-2xl p-8 h-full bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    {/* Quote Icon */}
                    <div className="mb-6 text-accent/30">
                      <Quote size={36} fill="currentColor" />
                    </div>
                    {/* Stars */}
                    <div className="flex text-accent mb-5 gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="currentColor" />
                      ))}
                    </div>
                    {/* Text */}
                    <p className="text-gray-600 font-medium leading-relaxed mb-8 flex-1 italic">
                      "{t.text}"
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-accent/30">
                        <Image
                          src={t.image_url || t.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"}
                          alt={t.author_name || "User"}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{t.author_name}</h4>
                        <p className="text-sm text-gray-400 font-medium">{t.author_role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
