"use client";

import { motion } from "framer-motion";
import { 
  LifeBuoy, BookOpen, MessageSquare, Phone, 
  Mail, ExternalLink, Code2, Cpu, Globe, ArrowRight, MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-primary">Help & Support</h1>
        <p className="text-muted-foreground font-medium mt-2 max-w-2xl">
          Get assistance, read documentation, and find out more about the system and its creators.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Support Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <BookOpen size={80} />
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to manage the system, configure settings, and handle users effectively.
              </p>
              <Link href="#" className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors">
                View Docs <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <MessageSquare size={80} />
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4">
                <LifeBuoy size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Support Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Encountering an issue? Create a support ticket and our team will look into it.
              </p>
              <Link href="#" className="inline-flex items-center text-sm font-semibold text-accent hover:text-primary transition-colors">
                Contact Support <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-10">
              <Cpu size={250} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">System Health</h3>
              <p className="text-white/80 mb-6 max-w-md">
                All systems are operating normally. The platform is running the latest stable build.
              </p>
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex-1">
                  <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Version</div>
                  <div className="font-mono font-bold text-lg">v2.4.1</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex-1">
                  <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Status</div>
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Developer Info Side Panel */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 bg-gray-50 border-b border-border text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="relative z-10">
               <div className="w-16 h-16 bg-white shadow-sm border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Code2 className="text-primary w-8 h-8" />
               </div>
               <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Developed By</h3>
               <h2 className="text-2xl font-heading font-extrabold text-foreground">Aaryav Technologies</h2>
             </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                We design and develop scalable digital solutions that empower businesses to thrive in the modern web era.
              </p>

              <div className="space-y-4">
                <a href="tel:+919328603748" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Call Us</div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">+91 93286 03748</div>
                  </div>
                </a>

                <a href="https://wa.me/919328603748" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WhatsApp</div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">+91 93286 03748</div>
                  </div>
                </a>

                <a href="mailto:aaryavtechnologies@gmail.com" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Us</div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">aaryavtechnologies@gmail.com</div>
                  </div>
                </a>

                <a href="https://aaryavtech.lovable.app/contact" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Globe size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Website</div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      Visit Website <ExternalLink size={14} className="opacity-50" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border text-center">
               <p className="text-xs text-muted-foreground">
                 &copy; {new Date().getFullYear()} Aaryav Technologies. All rights reserved.
               </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}