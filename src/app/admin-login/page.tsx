"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert } from "lucide-react";
import { verifyAdminPinAction } from "@/actions/admin/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto focus next input
    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join("");
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (fullPin.length !== 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("pin", fullPin);
    
    const res = await verifyAdminPinAction(formData);
    setLoading(false);

    if (res.success) {
      toast.success("Access Granted");
      router.push("/dashboard/admin");
    } else {
      toast.error(res.error);
      setPin(["", "", "", ""]);
      setPassword("");
      document.getElementById("admin-email")?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 font-heading font-extrabold text-2xl tracking-tighter">
        Job<span className="text-primary">Portal.</span>
      </Link>

      <div className="w-full max-w-md bg-white border-2 border-border rounded-[2rem] p-8 shadow-md text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} />
        </div>
        <h1 className="font-heading text-3xl font-extrabold mb-2 text-foreground">Admin Access</h1>
        <p className="text-muted-foreground font-medium mb-8">
          Please enter your administrative credentials to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          <div className="space-y-2">
            <label className="font-bold text-sm">Email Address</label>
            <Input 
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com" 
              required 
              className="rounded-xl border border-border focus-visible:ring-primary shadow-sm h-12 bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm">Password</label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="rounded-xl border border-border focus-visible:ring-primary shadow-sm h-12 bg-muted/30"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="font-bold text-sm block text-center">4-Digit Security PIN</label>
            <div className="flex justify-center gap-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-16 md:w-16 md:h-20 text-center text-3xl md:text-4xl font-extrabold bg-muted border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white focus:outline-none transition-all shadow-sm"
                  required
                />
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 mt-4 text-lg font-bold rounded-xl border-2 border-border shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={20} />
                Unlock Dashboard
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
