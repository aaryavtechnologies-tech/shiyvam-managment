import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function CareerAdvicePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 md:px-6 pt-48 pb-20">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase mb-4">Career Advice</h1>
        <p className="text-muted-foreground text-lg mb-8">Expert tips, exam strategies, and career guidance for Sarkari Jobs.</p>
        <div className="p-12 border-2 border-border border-dashed rounded-2xl flex items-center justify-center text-muted-foreground bg-muted/30">
          Career advice articles coming soon...
        </div>
      </div>
      <Footer />
    </main>
  );
}
