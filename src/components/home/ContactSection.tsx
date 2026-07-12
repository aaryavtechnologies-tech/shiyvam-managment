"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <FadeIn className="text-center mb-16">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">Get In Touch</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact <span className="italic text-accent">Us</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Ready to transform your career or scale your team? Reach out to us today.
          </p>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info Cards */}
          <div className="w-full lg:w-1/3 space-y-6">
            <FadeIn delay={0.1}>
              <a href="mailto:info@shivyam.com" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group block">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Business Email</h3>
                <p className="text-gray-500">info@shivyam.com</p>
              </a>
            </FadeIn>

            <FadeIn delay={0.2}>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group block">
                <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="text-[#25D366]" size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">WhatsApp Chat</h3>
                <p className="text-gray-500">Chat with our experts</p>
              </a>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="text-accent" size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-500">+91 70684 73074</p>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3">
            <FadeIn delay={0.4} className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 h-full">
              <h3 className="font-heading text-3xl font-bold text-primary mb-8">Send us a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <Input placeholder="John Doe" className="bg-gray-50 border-transparent focus:bg-white h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="bg-gray-50 border-transparent focus:bg-white h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <Input placeholder="How can we help you?" className="bg-gray-50 border-transparent focus:bg-white h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <Textarea placeholder="Tell us more about your requirements..." className="bg-gray-50 border-transparent focus:bg-white min-h-[150px] resize-none" />
                </div>
                <Button className="w-full h-14 text-lg bg-primary text-white hover:bg-primary/90">
                  <Send className="mr-2" size={20} />
                  Send Message
                </Button>
              </form>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
