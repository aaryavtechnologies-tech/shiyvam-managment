import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { AuthError } from "@/types/auth";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e);

    if (e instanceof AuthError) {
      return e.message;
    }

    if (e instanceof Error) {
      return e.message; // Be careful what you expose to the client in production!
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
