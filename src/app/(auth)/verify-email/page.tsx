import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/email/verify-email-form";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Verify Email | Shivyam Management Services",
  description: "Verify your email address to continue.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin text-primary mx-auto" size={48} />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
