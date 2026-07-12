"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LayoutDashboard, LogOut, ChevronDown, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find Jobs", href: "/jobs" },
  { name: "Companies", href: "/companies" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(undefined);
  const [role, setRole] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setDropdownOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        if (authUser) {
          const { data } = await supabase.from("users").select("role").eq("id", authUser.id).single();
          if (data) setRole((data as any).role);
        } else {
          setRole(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "U";
  const dashboardHref = role === "employer" ? "/dashboard/employer" : role === "admin" ? "/dashboard/admin" : "/dashboard/candidate";
  const profileHref = role === "employer" ? "/dashboard/employer/profile" : "/dashboard/candidate/profile";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-2"
            : "bg-white py-3"
        }`}
      >
        {/* Top utility bar */}
        <div className="hidden lg:block border-b border-gray-100 mb-2 pb-2">
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              People &nbsp;|&nbsp; Process &nbsp;|&nbsp; Performance
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Phone size={11} className="text-accent" />
              <span>+91 70684 73074 &nbsp;|&nbsp; +91 90508 48737</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
              <Image
                src="/logo.png"
                alt="Shivyam Management Services Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div>
              <span className="font-heading text-xl font-bold text-primary block leading-tight">
                SHIVYAM
              </span>
              <span className="text-[10px] font-semibold text-accent tracking-[0.15em] uppercase leading-tight block">
                Management Services
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors relative group ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-accent rounded-full transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {user === undefined ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 group outline-none bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors border border-gray-100"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                    {avatarLetter}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-primary leading-tight truncate max-w-[100px]">{user.email?.split("@")[0]}</p>
                    <p className="text-[10px] text-gray-400 capitalize font-medium">{role || "User"}</p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-4 border-b border-gray-50 bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {avatarLetter}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-primary truncate">{user.email}</p>
                            <p className="text-xs text-gray-400 capitalize font-medium">{role || "User"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-0.5">
                        {(role === "employer" || role === "admin") && (
                          <Link
                            href={dashboardHref}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            <LayoutDashboard size={16} className="text-gray-400" />
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href={profileHref}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <UserIcon size={16} className="text-gray-400" />
                          My Profile
                        </Link>
                      </div>

                      <div className="p-2 border-t border-gray-50">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center justify-center px-6 rounded-xl text-sm font-bold bg-primary text-white hover:bg-accent hover:text-primary shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-primary rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[59] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-80 bg-white flex flex-col shadow-2xl border-l border-gray-100"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-accent/5">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                    <Image
                      src="/logo.png"
                      alt="Shivyam Management Services"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div>
                    <span className="font-heading text-base font-bold text-primary block leading-tight">SHIVYAM</span>
                    <span className="text-[9px] font-semibold text-accent tracking-widest uppercase">Management Services</span>
                  </div>
                </Link>
                <button
                  className="p-2 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Tagline */}
                <div className="mt-6 px-4 py-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-xs font-semibold text-accent tracking-widest uppercase text-center">
                    People | Process | Performance
                  </p>
                </div>
              </div>

              {/* Mobile Auth Section */}
              <div className="p-4 border-t border-gray-100 space-y-2.5">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-1">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {avatarLetter}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{user.email}</p>
                        <p className="text-xs text-gray-400 capitalize font-medium">{role || "User"}</p>
                      </div>
                    </div>
                    {(role === "employer" || role === "admin") && (
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2.5 w-full px-4 py-3 bg-white border border-gray-100 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-gray-400" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href={profileHref}
                      className="flex items-center gap-2.5 w-full px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                      <UserIcon size={16} />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-accent hover:text-primary transition-all"
                    >
                      Get Started — Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
