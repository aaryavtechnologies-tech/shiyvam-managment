import { Session as SupabaseSession, User as SupabaseUser } from "@supabase/supabase-js";
import { UserRole } from "./database";

export interface User extends SupabaseUser {
  role?: UserRole; // Extended property for convenience
}

export interface Session extends SupabaseSession {
  user: User;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AuthError";
  }
}
