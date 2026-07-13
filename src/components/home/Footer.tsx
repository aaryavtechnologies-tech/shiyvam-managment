import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaInstagram, FaFacebook, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { name: "Find Jobs", href: "/jobs" },
  { name: "Companies", href: "/companies" },
  { name: "Career Advice", href: "/career-advice" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/#contact" },
];

const resources = [
  { name: "Help Center", href: "/help-center" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Onboarding", href: "/onboarding" },
];

const socials = [
  { icon: FaWhatsapp, href: "https://wa.me/917068473074", label: "WhatsApp" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaXTwitter, href: "#", label: "Twitter / X" },
  { icon: FaInstagram, href: "https://www.instagram.com/shivyamservices.in?igsh=NnBjZHRqcDZyaDU5", label: "Instagram" },
  { icon: FaFacebook, href: "https://www.facebook.com/share/14hHTzPdhrr/", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-0 relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shadow-lg border-2 border-accent/30 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Shivyam Management Services Pvt Ltd"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <span className="font-heading text-xl font-bold text-white block leading-tight">SHIVYAM</span>
                <span className="text-[10px] font-semibold text-accent tracking-[0.18em] uppercase block">Management Services Pvt Ltd</span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-sm font-semibold text-accent tracking-widest uppercase mb-5">
              People &nbsp;|&nbsp; Process &nbsp;|&nbsp; Performance
            </p>

            <p className="text-gray-300 font-medium mb-8 max-w-sm leading-relaxed text-sm">
              Bridging the gap between elite talent and India's leading organizations. We deliver precision-matched career opportunities for driven professionals.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={15} className="text-accent mt-0.5 flex-shrink-0" />
                <span className="font-medium">Head Office: Sajeti Ghatampur, Kanpur Nagar, Uttar Pradesh – 209206</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={15} className="text-accent flex-shrink-0" />
                <span className="font-medium">+91 70684 73074 &nbsp;|&nbsp; +91 90508 48737</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={15} className="text-accent flex-shrink-0" />
                <a href="mailto:info@shivyam.in" className="font-medium hover:text-accent transition-colors">info@shivyam.in</a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary hover:-translate-y-1 transition-all duration-200 shadow-sm"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-6 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors font-medium text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="text-accent/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-6 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors font-medium text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="text-accent/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-3 uppercase tracking-widest">Stay Updated</h4>
            <p className="text-gray-400 font-medium mb-5 text-sm leading-relaxed">
              Get the latest premium job alerts and career insights delivered to your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Your email address"
                className="rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus-visible:ring-accent focus-visible:border-accent"
              />
              <Button className="rounded-xl bg-accent text-primary font-bold hover:bg-accent/90 hover:-translate-y-0.5 transition-all shadow-md w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-md overflow-hidden bg-white">
              <Image src="/logo.png" alt="Shivyam" fill className="object-contain p-0.5" />
            </div>
            <p className="text-gray-400 font-medium text-sm">
              © {new Date().getFullYear()} <span className="text-white font-semibold">Shivyam Management Services Pvt Ltd</span>. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 font-semibold text-sm text-gray-400">
            <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link href="/help-center" className="hover:text-accent transition-colors">Help</Link>
            <Link
              href="/admin-login"
              className="hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
