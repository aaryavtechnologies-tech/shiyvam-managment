"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactMessageAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const validationResult = contactSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error?.issues?.[0]?.message || "Invalid input data provided",
      };
    }

    const validatedData = validationResult.data;

    // Using admin client because contact form is public, and we want to insert securely
    const supabase = createAdminClient();
    
    const { error } = await (supabase as any).from("contact_messages").insert([
      {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: "unread",
      }
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return {
      success: true,
      message: "Your message has been sent successfully. We will get back to you soon!",
    };
  } catch (error: any) {
    console.error("CONTACT FORM ERROR:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred. Please try again later.",
    };
  }
}
