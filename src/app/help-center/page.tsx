import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { Search, Book, MessageCircle, FileText } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-48 pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-6">How can we help you?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or FAQs..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-20">
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-premium p-8 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-6">
              <Book size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Getting Started</h3>
            <p className="text-muted-foreground font-medium mb-4">Learn how to create your profile and start applying for Sarkari jobs.</p>
            <a href="#" className="text-primary font-bold hover:underline">Read Guide &rarr;</a>
          </div>
          
          <div className="card-premium p-8 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary mx-auto flex items-center justify-center mb-6">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Application Status</h3>
            <p className="text-muted-foreground font-medium mb-4">Understand how to track your applications and prepare for exams.</p>
            <a href="#" className="text-secondary font-bold hover:underline">Read Guide &rarr;</a>
          </div>

          <div className="card-premium p-8 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center mb-6">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Contact Support</h3>
            <p className="text-muted-foreground font-medium mb-4">Can't find what you're looking for? Reach out to our team directly.</p>
            <a href="/contact" className="text-orange-500 font-bold hover:underline">Contact Us &rarr;</a>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I apply for a government job?", a: "To apply, simply create an account, fill out your candidate profile with your educational details, and click the 'Apply Now' button on any job listing." },
              { q: "Is Shivyam Management Services free to use?", a: "Yes, creating a profile and applying for most basic government and private sector jobs is completely free for candidates." },
              { q: "How often are job postings updated?", a: "Our team updates the job listings daily to ensure you have the most accurate information regarding exam dates, vacancies, and application deadlines." },
              { q: "Can I receive alerts for specific exams (e.g. UPSC, SSC)?", a: "Absolutely! You can customize your job alert preferences in your dashboard to receive email notifications when new vacancies matching your criteria are posted." }
            ].map((faq, i) => (
              <div key={i} className="card-premium p-6 border-l-4 border-l-primary">
                <h4 className="text-lg font-bold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
