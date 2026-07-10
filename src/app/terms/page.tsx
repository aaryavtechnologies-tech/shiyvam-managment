import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 md:px-6 pt-48 pb-20 max-w-4xl">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-4 uppercase text-center">Terms of Service</h1>
        <p className="text-muted-foreground text-center font-medium mb-12">Last updated: October 15, 2025</p>
        
        <div className="prose prose-lg max-w-none text-muted-foreground font-medium space-y-8">
          
          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Shivyam Management Services, you accept and agree to be bound by the terms and provision of this agreement. 
              In addition, when using this platform's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p>
              Shivyam Management Services provides users with access to a rich collection of resources regarding government jobs (Sarkari Naukri), private sector vacancies, educational content, and recruitment alerts. 
              You understand and agree that the service is provided "AS-IS" and that Shivyam Management Services assumes no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.
            </p>
          </section>

          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Conduct</h2>
            <p className="mb-4">
              You agree to use the service only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others or otherwise cause damage to the site or the Content. You agree not to add to, subtract from, or otherwise modify the Content, or to attempt to access any Content that is not intended for you.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Do not upload false resumes or fraudulent job postings.</li>
              <li>Do not scrape data without our explicit permission.</li>
              <li>Respect the privacy of other users.</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Accuracy of Information</h2>
            <p>
              While we strive to provide the most accurate and up-to-date information regarding government job vacancies, Shivyam Management Services is not responsible for any typographical errors or inaccuracies. Candidates are advised to always cross-check the information with the official government notifications before applying.
            </p>
          </section>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
