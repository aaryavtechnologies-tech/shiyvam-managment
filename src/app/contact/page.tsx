"use client";

import { useActionState, useEffect } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessageAction } from "@/actions/contact";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactMessageAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      (document.getElementById("contact-form") as HTMLFormElement)?.reset();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* HEADER */}
      <div className="bg-muted/20 border-b-2 border-border pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase mb-4 text-foreground tracking-tight">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to our team today!
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* CONTACT INFO */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-3xl font-extrabold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                Whether you're an employer looking to hire the best talent, or a candidate seeking your dream job, our dedicated support team is ready to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white border-2 border-border rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-xl mb-1">Email Us</h3>
                  <a href="mailto:Hr_support@shivyamservices.com" className="block text-muted-foreground font-medium hover:text-primary transition-colors">Hr_support@shivyamservices.com</a>
                  <a href="mailto:info@shivyamservices.com" className="block text-muted-foreground font-medium hover:text-primary transition-colors">info@shivyamservices.com</a>
                  <a href="mailto:business@shivyamservices.com" className="block text-muted-foreground font-medium hover:text-primary transition-colors">business@shivyamservices.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white border-2 border-border rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-xl mb-1">Call Us</h3>
                  <a href="tel:+917068473074" className="block text-muted-foreground font-medium hover:text-blue-600 transition-colors">+91 70684 73074</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white border-2 border-border rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-xl mb-1">Headquarters</h3>
                  <p className="text-muted-foreground font-medium">Sajeti, Ghatampur</p>
                  <p className="text-muted-foreground font-medium">Kanpur Nagar, Uttar Pradesh 209206</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white border-2 border-border rounded-[2rem] p-8 shadow-md h-fit animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="font-heading text-2xl font-extrabold mb-6">Send a Message</h3>
            
            <form id="contact-form" action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label className="font-bold text-sm">Full Name</label>
                <Input 
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  className="rounded-xl border border-border focus-visible:ring-primary shadow-sm h-12 bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-sm">Email Address</label>
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  className="rounded-xl border border-border focus-visible:ring-primary shadow-sm h-12 bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-sm">Subject</label>
                <Input 
                  name="subject" 
                  placeholder="How can we help?" 
                  required 
                  className="rounded-xl border border-border focus-visible:ring-primary shadow-sm h-12 bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-sm">Message</label>
                <Textarea 
                  name="message" 
                  placeholder="Write your message here..." 
                  required 
                  rows={5}
                  className="rounded-xl border border-border focus-visible:ring-primary shadow-sm bg-muted/30 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-14 rounded-xl border border-border shadow-sm bg-primary text-primary-foreground font-bold text-lg hover:-translate-y-1 hover:shadow-md transition-all flex items-center gap-2"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
