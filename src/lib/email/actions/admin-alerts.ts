import { getResendClient, getSenderEmail } from "../providers/resend";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminAlertType = 'registration' | 'job' | 'verification';

interface SendAdminAlertParams {
  type: AdminAlertType;
  title: string;
  message: string;
  link?: string;
}

export async function sendAdminAlert({ type, title, message, link }: SendAdminAlertParams) {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Save to database for the in-app Notification Center
    await (supabaseAdmin.from("admin_alerts") as any).insert({
      type,
      title,
      message,
      action_link: link || null,
      is_read: false
    });

    // 2. Dispatch email via Resend
    const resend = getResendClient();
    const adminEmail = "support@shivyamservices.com";
    
    // Construct HTML body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333;">Admin Alert: ${title}</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">${message}</p>
        ${link ? `
          <div style="margin-top: 30px;">
            <a href="\${process.env.NEXT_PUBLIC_APP_URL}\${link}" style="background-color: #000; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Details
            </a>
          </div>
        ` : ''}
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #888; font-size: 12px;">This is an automated notification from your Shivyam Admin Panel.</p>
      </div>
    `;

    await resend.emails.send({
      from: getSenderEmail(),
      to: adminEmail,
      subject: `[Admin Alert] ${title}`,
      html: htmlBody,
    });

    console.log(`Admin alert sent: ${title}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin alert:", error);
    return { success: false, error };
  }
}
