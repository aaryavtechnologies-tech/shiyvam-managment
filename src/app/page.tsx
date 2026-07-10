import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Stats } from "@/components/home/Stats";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { JobCategories } from "@/components/home/JobCategories";
import { FeaturedJobs } from "@/components/home/FeaturedJobs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AIFeatures } from "@/components/home/AIFeatures";
import { Testimonials } from "@/components/home/Testimonials";
import { SuccessStories } from "@/components/home/SuccessStories";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground flex flex-col">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Stats />
      <WhyChooseUs />
      <JobCategories />
      <FeaturedJobs />
      <HowItWorks />
      <AIFeatures />
      <Testimonials />
      <SuccessStories />
      <CTA />
      <Footer />
    </main>
  );
}
