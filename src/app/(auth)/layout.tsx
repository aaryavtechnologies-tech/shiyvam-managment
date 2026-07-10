import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex selection:bg-primary selection:text-primary-foreground">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[600px] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 relative">
          <div className="absolute -top-16 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>
          <Link href="/" className="flex items-center gap-2 mb-10 group inline-flex relative z-10">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl border border-border shadow-sm group-hover:-translate-y-1 transition-transform">
              <Briefcase size={24} strokeWidth={2.5} />
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
              JobPortal
            </span>
          </Link>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

      {/* Right Graphic Section */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary/5 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 -left-20 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[100px]"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-12 xl:px-24 2xl:px-32">
          <h2 className="font-heading text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
            Find your next <br />
            <span className="text-primary relative inline-block">
              Dream Job
              <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
              </svg>
            </span>
            <br />
            faster than ever.
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-xl">
            Join thousands of professionals and top-tier companies building the future of work, together.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md">
              <div className="font-heading text-3xl font-bold mb-2">10k+</div>
              <div className="text-muted-foreground font-medium">Active Jobs</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md">
              <div className="font-heading text-3xl font-bold mb-2">500+</div>
              <div className="text-muted-foreground font-medium">Hiring Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
