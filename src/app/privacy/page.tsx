import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 md:px-6 pt-48 pb-20 max-w-4xl">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-4 uppercase text-center">Privacy Policy</h1>
        <p className="text-muted-foreground text-center font-medium mb-12">Last updated: October 15, 2025</p>
        
        <div className="prose prose-lg max-w-none text-muted-foreground font-medium space-y-8">
          
          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information to provide better services to all our users. The information Shivyam Management Services collects, and how that information is used, depends on how you use our services.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and location when you create an account.</li>
              <li><strong>Professional Information:</strong> Resumes, educational qualifications, job history, and skills uploaded for job applications.</li>
              <li><strong>Usage Data:</strong> Information about your interaction with our platform, such as jobs viewed, searches performed, and alerts configured.</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Information</h2>
            <p className="mb-4">
              We use the information we collect from all our services for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, maintain, and improve our services.</li>
              <li>To develop new features (like better job matching algorithms).</li>
              <li>To communicate with you, including sending job alerts, exam updates, and important notifications.</li>
              <li>To protect Shivyam Management Services, our users, and the public from fraudulent activities.</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
            <p>
              We do not share your personal information with companies, organizations, or individuals outside of Shivyam Management Services except in the following cases:
              <br/><br/>
              <strong>With Employers:</strong> When you actively apply for a job, your profile and resume information is shared with the respective employer or government recruitment body.
              <br/><br/>
              <strong>For Legal Reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.
            </p>
          </section>

          <section className="bg-white p-8 rounded-2xl border-2 border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
            <p>
              We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use industry-standard encryption, role-based access control, and secure database practices (via Supabase) to keep your data safe.
            </p>
          </section>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
