"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signInAction } from "@/actions/auth";
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
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, isExecuting } = useAction(signInAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Welcome back!");
        if (data.role === "admin") {
          router.push("/admin");
        } else if (!data.onboarding_completed) {
          router.push(`/onboarding/${data.role === "employer" ? "employer" : "candidate"}`);
        } else if (data.role === "employer") {
          router.push("/dashboard/employer");
        } else {
          router.push("/dashboard/candidate");
        }
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Invalid credentials.");
    },
  });

  function onSubmit(values: LoginInput) {
    execute(values);
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground font-medium">
          Enter your email and password to sign in.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-foreground">Password</FormLabel>
                  <Link href="/forgot-password" className="text-sm font-bold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
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

          <div className="flex items-center space-x-2 pb-2">
            <Checkbox id="remember" className="rounded border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me for 30 days
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={isExecuting}
            className="w-full h-12 text-base font-bold rounded-xl border border-border bg-primary text-primary-foreground shadow-md hover:bg-primary hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-bold">
          Sign up
        </Link>
      </div>
    </div>
  );
}
