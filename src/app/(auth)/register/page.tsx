"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2, User, Building2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { signUpAction } from "@/actions/auth";
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
// Removed Select components

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "candidate",
    },
  });

  const { execute, isExecuting } = useAction(signUpAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Account created! Check your email for the verification code.");
        router.push(`/verify-email?email=${encodeURIComponent(form.getValues().email)}`);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An error occurred during registration.");
    },
  });

  function onSubmit(values: RegisterInput) {
    execute(values);
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-2">
          Create an account
        </h1>
        <p className="text-muted-foreground font-medium">
          Enter your details below to get started.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">I am a...</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => field.onChange("candidate")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
                      field.value === "candidate"
                        ? "border-primary bg-primary/5 shadow-sm text-primary"
                        : "border-border bg-white text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/50"
                    )}
                  >
                    <User size={32} strokeWidth={field.value === "candidate" ? 2.5 : 2} />
                    <span className="font-bold text-foreground">Candidate</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => field.onChange("employer")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
                      field.value === "employer"
                        ? "border-primary bg-primary/5 shadow-sm text-primary"
                        : "border-border bg-white text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/50"
                    )}
                  >
                    <Building2 size={32} strokeWidth={field.value === "employer" ? 2.5 : 2} />
                    <span className="font-bold text-foreground">Employer</span>
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    className="rounded-xl border-2 border-border shadow-sm bg-white h-12 focus-visible:ring-primary focus-visible:border-primary" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    type="email" 
                    className="rounded-xl border-2 border-border shadow-sm bg-white h-12 focus-visible:ring-primary focus-visible:border-primary"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"} 
                      className="rounded-xl border-2 border-border shadow-sm bg-white h-12 pr-12 focus-visible:ring-primary focus-visible:border-primary"
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isExecuting}
            className="w-full h-12 text-base font-bold rounded-xl border border-border bg-primary text-primary-foreground shadow-md hover:bg-primary hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
