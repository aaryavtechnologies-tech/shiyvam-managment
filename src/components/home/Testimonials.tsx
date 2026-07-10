"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "VP – Strategy",
    company: "Goldman Sachs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop&face=true",
    text: "Shivyam transformed my job search entirely. The quality of roles presented was exceptional — only top-tier, relevant positions. Landed a VP role in under 8 weeks.",
  },
  {
    name: "Priya Kapoor",
    role: "Director – Risk Advisory",
    company: "Deloitte",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop&face=true",
    text: "The executive network and precision matching are unmatched. I was connected directly with the hiring partner — no intermediaries, no delays.",
  },
  {
    name: "Rahul Singhania",
    role: "Partner – Tax",
    company: "PwC India",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop&face=true",
    text: "An incredibly professional platform. The caliber of organizations and the thoroughness of the process reflects a deep understanding of senior-level hiring.",
  },
  {
    name: "Sneha Agarwal",
    role: "Head – M&A Integration",
    company: "JP Morgan",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop&face=true",
    text: "The salary insights and exclusive partner network gave me leverage I never had before. I negotiated 40% above my previous package with confidence.",
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

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
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-accent/30"
                      />
                      <div>
                        <h4 className="font-bold text-primary">{t.name}</h4>
                        <p className="text-sm text-gray-400 font-medium">{t.role} · {t.company}</p>
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
