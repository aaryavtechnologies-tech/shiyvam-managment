import dynamic from "next/dynamic";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Stats } from "@/components/home/Stats";

// Dynamically import below-the-fold components
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs").then(mod => mod.WhyChooseUs), { ssr: true });
const AboutCompany = dynamic(() => import("@/components/home/AboutCompany").then(mod => mod.AboutCompany), { ssr: true });
const JobCategories = dynamic(() => import("@/components/home/JobCategories").then(mod => mod.JobCategories), { ssr: true });
const FeaturedJobs = dynamic(() => import("@/components/home/FeaturedJobs").then(mod => mod.FeaturedJobs), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks").then(mod => mod.HowItWorks), { ssr: true });
const AIFeatures = dynamic(() => import("@/components/home/AIFeatures").then(mod => mod.AIFeatures), { ssr: true });
const Testimonials = dynamic(() => import("@/components/home/Testimonials").then(mod => mod.Testimonials), { ssr: true });
const SuccessStories = dynamic(() => import("@/components/home/SuccessStories").then(mod => mod.SuccessStories), { ssr: true });
const CTA = dynamic(() => import("@/components/home/CTA").then(mod => mod.CTA), { ssr: true });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection), { ssr: true });
const Footer = dynamic(() => import("@/components/home/Footer").then(mod => mod.Footer), { ssr: true });

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground flex flex-col">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Stats />
      <WhyChooseUs />
      <AboutCompany />
      <JobCategories />
      <FeaturedJobs />
      <HowItWorks />
      <AIFeatures />
      <Testimonials />
      <SuccessStories />
      <CTA />
      <ContactSection />
      <Footer />
    </main>
  );
}
