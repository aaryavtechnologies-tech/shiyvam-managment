import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Onboarding | Shivyam Management Services",
  description: "Complete your profile to get started with Shivyam Management Services.",
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-full md:w-[320px] lg:w-[360px] bg-primary flex-col justify-between hidden md:flex relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-3 group mb-14">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-md">
              <Image
                src="/logo.png"
                alt="Shivyam Management Services Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <span className="font-heading text-lg font-bold text-white block leading-tight">SHIVYAM</span>
              <span className="text-[10px] font-semibold text-accent tracking-[0.15em] uppercase">Management Services</span>
            </div>
          </Link>
          
          <div className="space-y-5 mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white leading-snug">
              Welcome <span className="text-accent italic">Aboard</span>
            </h2>
            <p className="text-gray-300 font-medium text-base leading-relaxed">
              Set up your profile to connect with India's top organizations and unlock elite career opportunities.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              "Access 1,500+ premium positions",
              "AI-powered job matching",
              "Connect with top enterprises",
              "Expert career guidance",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-sm text-gray-300 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-10 pt-0">
          <p className="text-sm text-gray-400 font-medium">
            Need help?{" "}
            <Link href="/contact" className="text-accent hover:underline font-semibold">
              Contact Support
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase font-medium">People | Process | Performance</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-gray-100 bg-white sticky top-0 z-50 flex items-center justify-center shadow-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-gray-100">
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
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
          <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-xl">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
