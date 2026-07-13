import Image from "next/image";
import { Phone, MapPin, Building } from "lucide-react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/home/Navbar";

const AboutCompany = dynamic(() => import("@/components/home/AboutCompany").then(mod => mod.AboutCompany), { ssr: true });
const Footer = dynamic(() => import("@/components/home/Footer").then(mod => mod.Footer), { ssr: true });

export default function AboutPage() {
  const team = [
    {
      name: "Shivam",
      role: "Founder & CEO",
      contact: "7068473074",
      image: "/Shivam.png",
    },
    {
      name: "Satyam Vishwakarma",
      role: "Co-founder and Managing Director",
      contact: "90508 48737",
      image: "/SatyamVishwakarma.png",
    },
    {
      name: "Mritunjay Kumar",
      role: "Co-founder and Head of Finance and Operations",
      image: "/MrityunjayKumarPande.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight uppercase">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Meet the minds behind Shivyam Management Services Pvt Ltd. We're dedicated to connecting the best talent with the greatest companies.
            </p>
          </div>

          <div className="mb-20">
            <AboutCompany />
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-extrabold mb-8 font-heading border-b-4 border-border pb-4 inline-block">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-4 border-border shadow-md p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden mb-6 relative bg-muted flex-shrink-0 shadow-sm">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-2">{member.name}</h3>
                  <p className="text-primary font-bold mb-4 px-3 py-1 bg-primary/10 rounded-lg inline-block text-sm">
                    {member.role}
                  </p>
                  {member.contact && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-auto font-medium">
                      <Phone size={16} />
                      <span>{member.contact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-primary text-primary-foreground rounded-2xl border-4 border-border shadow-md p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-extrabold mb-6 font-heading flex items-center gap-3">
                  <Building size={32} />
                  Head Office
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white text-primary rounded-xl border-2 border-border font-bold shadow-sm flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">Address</h4>
                      <p className="text-primary-foreground/90 font-medium text-lg leading-relaxed">
                        Sajeti, Ghatampur<br />
                        Kanpur Nagar, Uttar Pradesh<br />
                        209206
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-extrabold mb-6 font-heading flex items-center gap-3">
                  <Phone size={32} />
                  Contact Us
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-xl font-bold bg-white text-foreground px-4 py-2 rounded-xl border-2 border-border shadow-sm inline-flex items-center w-fit">
                      +91 7068473074
                    </p>
                    <p className="text-xl font-bold bg-white text-foreground px-4 py-2 rounded-xl border-2 border-border shadow-sm inline-flex items-center w-fit">
                      +91 90508 48737
                    </p>
                  </div>
                  <div className="mt-8 p-4 bg-black/20 rounded-xl border border-white/20 backdrop-blur-sm shadow-inner">
                    <p className="font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                      Sub offices address will be updated soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
