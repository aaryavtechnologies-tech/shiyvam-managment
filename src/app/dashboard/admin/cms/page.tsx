"use client";

import Link from "next/link";
import { FileText, MessageSquare, HelpCircle, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const cmsModules = [
  {
    title: "Posts & Articles",
    description: "Manage your blog posts and career advice articles.",
    icon: FileText,
    href: "/dashboard/admin/cms/posts",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  {
    title: "Testimonials",
    description: "Manage client and candidate testimonials.",
    icon: MessageSquare,
    href: "/dashboard/admin/cms/testimonials",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  {
    title: "FAQs",
    description: "Manage frequently asked questions.",
    icon: HelpCircle,
    href: "/dashboard/admin/cms/faqs",
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200"
  },
  {
    title: "Success Stories",
    description: "Manage candidate success stories (coming soon).",
    icon: BookOpen,
    href: "#",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200"
  }
];

export default function CMSHubPage() {
  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground font-medium mt-2 max-w-2xl">
          Manage the public-facing content of your platform including blog posts, testimonials, and FAQs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsModules.map((module, i) => (
          <div key={i} className={`bg-white rounded-3xl p-6 border-2 \${module.border} shadow-sm hover:shadow-md transition-shadow flex flex-col`}>
            <div className={`w-14 h-14 rounded-2xl \${module.bg} \${module.color} flex items-center justify-center mb-6`}>
              <module.icon size={28} strokeWidth={2.5} />
            </div>
            
            <h3 className="font-heading text-xl font-bold mb-2">{module.title}</h3>
            <p className="text-muted-foreground font-medium text-sm mb-8 flex-1">
              {module.description}
            </p>
            
            <Link href={module.href}>
              <Button className="w-full font-bold justify-between group" variant={module.href === '#' ? 'outline' : 'default'} disabled={module.href === '#'}>
                {module.href === '#' ? 'Coming Soon' : 'Manage Content'}
                {module.href !== '#' && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
