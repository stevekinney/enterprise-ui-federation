import type { AuthContext } from "./types";

export const AUTH_CHANNEL = "pulse:auth";

export interface AuthEvent {
  type: "login" | "logout" | "update";
  payload: AuthContext;
}
