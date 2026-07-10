export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type UserRole = "admin" | "employer" | "candidate";
export type AuditAction = "create" | "update" | "delete" | "suspend" | "activate" | "approve" | "reject" | "login";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar: string | null;
          current_step: number;
          onboarding_completed: boolean;
          last_saved_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar?: string | null;
          current_step?: number;
          onboarding_completed?: boolean;
          last_saved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar?: string | null;
          current_step?: number;
          onboarding_completed?: boolean;
          last_saved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_verifications: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          otp_hash: string;
          expires_at: string;
          attempts: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          otp_hash: string;
          expires_at: string;
          attempts?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          otp_hash?: string;
          expires_at?: string;
          attempts?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          employer_id: string | null;
          name: string;
          logo_url: string | null;
          website: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employer_id?: string | null;
          name: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employer_id?: string | null;
          name?: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          company_id: string | null;
          employer_id: string | null;
          title: string;
          description: string;
          requirements: string | null;
          benefits: string | null;
          employment_type: string;
          location: string | null;
          is_remote: boolean;
          salary_range_min: number | null;
          salary_range_max: number | null;
          currency: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          employer_id?: string | null;
          title: string;
          description: string;
          requirements?: string | null;
          benefits?: string | null;
          employment_type?: string;
          location?: string | null;
          is_remote?: boolean;
          salary_range_min?: number | null;
          salary_range_max?: number | null;
          currency?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          employer_id?: string | null;
          title?: string;
          description?: string;
          requirements?: string | null;
          benefits?: string | null;
          employment_type?: string;
          location?: string | null;
          is_remote?: boolean;
          salary_range_min?: number | null;
          salary_range_max?: number | null;
          currency?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      candidate_profiles: {
        Row: {
          id: string;
          user_id: string;
          headline: string | null;
          bio: string | null;
          phone: string | null;
          date_of_birth: string | null;
          gender: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          experience_level: string | null;
          current_company: string | null;
          current_position: string | null;
          current_salary: string | null;
          expected_salary: string | null;
          notice_period: string | null;
          education: { degree: string; institution: string; year_of_passing?: string }[];
          skills: string[];
          languages: string[];
          portfolio_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          website: string | null;
          profile_image: string | null;
          resume_url: string | null;
          profile_completion: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          experience_level?: string | null;
          current_company?: string | null;
          current_position?: string | null;
          current_salary?: string | null;
          expected_salary?: string | null;
          notice_period?: string | null;
          education?: { degree: string; institution: string; year_of_passing?: string }[];
          skills?: string[];
          languages?: string[];
          portfolio_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          website?: string | null;
          profile_image?: string | null;
          resume_url?: string | null;
          profile_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          experience_level?: string | null;
          current_company?: string | null;
          current_position?: string | null;
          current_salary?: string | null;
          expected_salary?: string | null;
          notice_period?: string | null;
          education?: { degree: string; institution: string; year_of_passing?: string }[];
          skills?: string[];
          languages?: string[];
          portfolio_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          website?: string | null;
          profile_image?: string | null;
          resume_url?: string | null;
          profile_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          resume_url: string | null;
          cover_letter: string | null;
          status: string;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          resume_url?: string | null;
          cover_letter?: string | null;
          status?: string;
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          resume_url?: string | null;
          cover_letter?: string | null;
          status?: string;
          applied_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_jobs: {
        Row: {
          id: string;
          candidate_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          job_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          job_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          action: AuditAction;
          admin_id: string | null;
          target_id: string | null;
          target_type: string;
          ip_address: string | null;
          browser: string | null;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: AuditAction;
          admin_id?: string | null;
          target_id?: string | null;
          target_type: string;
          ip_address?: string | null;
          browser?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: AuditAction;
          admin_id?: string | null;
          target_id?: string | null;
          target_type?: string;
          ip_address?: string | null;
          browser?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
