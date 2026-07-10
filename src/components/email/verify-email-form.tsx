"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Mail, ArrowRight } from "lucide-react";

import { verifyOTP } from "@/lib/email/actions/otp"; // Assuming resendOTP is also there if needed
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerify = () => {
    if (code.length !== 6) return;
    if (!email) {
      toast.error("Email is missing from the URL.");
      return;
    }

    startTransition(async () => {
      const result = await verifyOTP(email, code);
      if (result.success) {
        toast.success("Email verified successfully! Let's set up your profile.");
        router.push(`/onboarding/${result.role === "employer" ? "employer" : "candidate"}`);
      } else {
        toast.error(result.error);
        setCode(""); // clear for retry
      }
    });
  };

  const handleResend = () => {
    // In a real app, wire this to resendOTP server action
    toast.info("A new code has been sent to your email.");
    setTimeLeft(60);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight mb-2">
          Verify your email
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          We sent a 6-digit code to <span className="font-bold text-foreground">{email || "your email"}</span>.
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-center w-full overflow-hidden px-1">
          <InputOTP 
            maxLength={6} 
            value={code} 
            onChange={setCode}
            onComplete={handleVerify}
            disabled={isPending}
            autoFocus
            className="w-full"
          >
            <InputOTPGroup className="flex justify-between w-full gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                  key={index} 
                  index={index} 
                  className="w-10 h-12 sm:w-12 sm:h-14 text-lg sm:text-xl font-bold rounded-xl border-2 border-border bg-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button 
          onClick={handleVerify}
          disabled={code.length !== 6 || isPending}
          className="w-full h-14 text-lg font-bold rounded-xl border border-border bg-primary text-primary-foreground shadow-md hover:bg-primary hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center"
        >
          {isPending ? (
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
          ) : (
            <ShieldCheck className="w-5 h-5 mr-2" />
          )}
          Verify Account
        </Button>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm font-medium text-muted-foreground">
              Resend code in <span className="font-bold text-foreground">{timeLeft}s</span>
            </p>
          ) : (
            <button 
              onClick={handleResend}
              className="text-sm font-bold text-primary hover:underline"
            >
              Didn't receive the code? Resend
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
