import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting demo seed...");

  try {
    // 1. Create Demo Employer Auth User
    const employerEmail = "employer@demo.com";
    const { data: empAuth, error: empAuthErr } = await supabase.auth.admin.createUser({
      email: employerEmail,
      password: "password123",
      email_confirm: true,
      user_metadata: {
        full_name: "Demo Employer",
        role: "employer",
      },
    });

    if (empAuthErr && empAuthErr.message !== "User already registered") {
      console.error("Employer Auth Error:", empAuthErr);
    }
    
    // Get employer ID
    const { data: employerUser } = await supabase.from("users").select("id").eq("email", employerEmail).single();
    if (!employerUser) throw new Error("Employer user not found in public.users");
    const employerId = employerUser.id;

    // Update public.users
    await supabase.from("users").update({ role: "employer", full_name: "Demo Employer" }).eq("id", employerId);

    // 2. Create Demo Company
    let company;
    const { data: existingCompany } = await supabase.from("companies").select().eq("employer_id", employerId).single();
    if (existingCompany) {
      company = existingCompany;
    } else {
      const { data: newCompany, error: companyErr } = await supabase.from("companies").insert({
        employer_id: employerId,
        name: "Demo Tech Corp",
        industry: "Software Development",
        website: "https://demo.com",
        verification_status: "verified"
      }).select().single();
      if (companyErr) console.error("Company Error:", companyErr);
      company = newCompany;
    }

    // 3. Create Demo Candidates
    const candidates = [
      { email: "candidate1@demo.com", name: "Alice Johnson", skills: ["React", "TypeScript"], location: "New York" },
      { email: "candidate2@demo.com", name: "Bob Smith", skills: ["Python", "Django"], location: "London" },
      { email: "candidate3@demo.com", name: "Charlie Davis", skills: ["Node.js", "Express"], location: "San Francisco" }
    ];

    let firstCandidateId = null;

    for (const cand of candidates) {
      const { data: candAuth, error: candAuthErr } = await supabase.auth.admin.createUser({
        email: cand.email,
        password: "password123",
        email_confirm: true,
        user_metadata: {
          full_name: cand.name,
          role: "candidate",
        },
      });

      if (candAuthErr && candAuthErr.message !== "User already registered") {
        console.error(`Candidate Auth Error (${cand.email}):`, candAuthErr);
      }
      
      const { data: candidateUser } = await supabase.from("users").select("id").eq("email", cand.email).single();
      if (!candidateUser) continue;
      const candidateId = candidateUser.id;
      
      if (!firstCandidateId) firstCandidateId = candidateId;

      await supabase.from("users").update({ role: "candidate", full_name: cand.name }).eq("id", candidateId);

      const { data: existingProfile } = await supabase.from("candidate_profiles").select().eq("user_id", candidateId).single();
      if (!existingProfile) {
        const { error: profileErr } = await supabase.from("candidate_profiles").insert({
          user_id: candidateId,
          bio: `An experienced demo candidate named ${cand.name}.`,
          skills: cand.skills
        });
        if (profileErr) console.error(`Profile Error (${cand.email}):`, profileErr);
      }
    }
    
    // 5. Create Demo Job
    const { data: job, error: jobErr } = await supabase.from("jobs").insert({
      employer_id: employerId,
      company_id: company?.id,
      title: "Senior Demo Engineer",
      description: "This is a demo job used for testing the platform.",
      requirements: "Experience in demoing things.",
      department: "Engineering",
      location: "Remote",
      employment_type: "Full-time",
      status: "published",
      admin_status: "approved"
    }).select().single();

    if (jobErr) console.error("Job Error:", jobErr);

    if (job && firstCandidateId) {
      // 6. Create Demo Application
      const { error: appErr } = await supabase.from("applications").insert({
        job_id: job.id,
        candidate_id: firstCandidateId,
        cover_letter: "I would love to apply for this demo job.",
        status: "Applied"
      });

      if (appErr) console.error("App Error:", appErr);
    }

    console.log("Demo seed completed successfully!");
    console.log("-----------------------------------------");
    console.log("Employer Login: employer@demo.com / password123");
    console.log("Candidate Login: candidate@demo.com / password123");
    console.log("-----------------------------------------");
    
  } catch (err) {
    console.error("Seed error:", err);
  }
}

seed();
