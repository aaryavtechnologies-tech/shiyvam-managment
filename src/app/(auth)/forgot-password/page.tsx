"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { 
  forgotPasswordSchema, 
  verifyOtpResetPasswordSchema,
  type ForgotPasswordInput,
  type VerifyOtpResetPasswordInput 
} from "@/lib/validations/auth";
import { sendPasswordResetOTPAction, verifyAndResetPasswordAction } from "@/actions/auth/reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<VerifyOtpResetPasswordInput>({
    resolver: zodResolver(verifyOtpResetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  async function onEmailSubmit(values: ForgotPasswordInput) {
    setIsExecuting(true);
    
    const result = await sendPasswordResetOTPAction(values);

    if (result?.data?.success) {
      toast.success("OTP sent! Check your inbox.");
      setEmail(values.email);
      setStep(2);
    } else {
      toast.error(result?.serverError || "An error occurred. Please try again.");
    }
    
    setIsExecuting(false);
  }

  async function onOtpSubmit(values: VerifyOtpResetPasswordInput) {
    setIsExecuting(true);
    
    const result = await verifyAndResetPasswordAction({
      ...values,
      email: email,
    });

    if (result?.data?.success) {
      toast.success("Password updated successfully.");
      router.push("/login");
    } else {
      toast.error(result?.serverError || "Invalid OTP or an error occurred.");
    }
    
    setIsExecuting(false);
  }

  return (
    <div className="w-full relative">
      <Link 
        href="/login" 
        className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-6 transition-colors group"
      >
        <div className="bg-secondary/50 p-2 rounded-full mr-3 group-hover:bg-primary/10 transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        </div>
        Back to secure login
      </Link>
      
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground mb-3">
                Forgot your password?
              </h1>
              <p className="text-muted-foreground font-medium text-lg max-w-sm leading-relaxed">
                No worries! Enter your email address and we'll send you a secure OTP to reset it.
              </p>
            </div>

            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Mail size={20} />
                          </div>
                          <Input 
                            placeholder="you@example.com" 
                            type="email" 
                            className="pl-12 rounded-xl border-2 border-border shadow-sm bg-white/50 backdrop-blur-sm h-14 text-lg focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-medium" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isExecuting}
                  className="w-full h-14 text-lg font-bold rounded-xl border-2 border-primary bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(11,27,61,0.39)] hover:shadow-[0_6px_20px_rgba(11,27,61,0.23)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isExecuting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending secure code...
                      </>
                    ) : (
                      "Send Reset OTP"
                    )}
                  </span>
                  {/* Hover effect glow */}
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                </Button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                <Mail size={14} />
                Code sent to {email}
              </div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground mb-3">
                Secure Reset
              </h1>
              <p className="text-muted-foreground font-medium text-lg max-w-sm leading-relaxed">
                Enter the 6-digit verification code we just sent you, along with your new password.
              </p>
            </div>

            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground">6-Digit Verification Code</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <KeyRound size={20} />
                          </div>
                          <Input 
                            placeholder="• • • • • •" 
                            type="text" 
                            maxLength={6}
                            className="pl-12 rounded-xl border-2 border-border shadow-sm bg-white/50 backdrop-blur-sm h-14 focus-visible:ring-primary focus-visible:border-primary text-center tracking-[0.5em] text-2xl font-bold font-mono transition-all duration-300"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-medium" />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 p-5 bg-secondary/30 rounded-2xl border border-secondary/50 backdrop-blur-sm">
                  <FormField
                    control={otpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground">New Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                              <Lock size={20} />
                            </div>
                            <Input 
                              placeholder="Create a strong password" 
                              type={showPassword ? "text" : "password"} 
                              className="pl-12 pr-12 rounded-xl border-2 border-border shadow-sm bg-white h-14 text-lg focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={otpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                              <Lock size={20} />
                            </div>
                            <Input 
                              placeholder="Repeat new password" 
                              type={showPassword ? "text" : "password"} 
                              className="pl-12 pr-12 rounded-xl border-2 border-border shadow-sm bg-white h-14 text-lg focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-14 flex-1 text-base font-bold rounded-xl border-2 hover:bg-secondary/50 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isExecuting}
                    className="h-14 flex-[2] text-base font-bold rounded-xl border-2 border-primary bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(11,27,61,0.39)] hover:shadow-[0_6px_20px_rgba(11,27,61,0.23)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isExecuting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verifying & Saving...
                        </>
                      ) : (
                        "Save New Password"
                      )}
                    </span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
