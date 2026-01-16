/**
 * Role values used for client-side authorization and UI rendering.
 */
export type Role = "ADMIN" | "ANALYST" | "CUSTOMER";

/**
 * Persists authentication data in localStorage after login.
 */
export function setAuth(token: string, role: Role, username: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("username", username);
}

/**
 * Clears all authentication data during logout.
 */
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}

/**
 * Retrieves the currently stored authentication state.
 */
export function getAuth() {
  return {
    token: localStorage.getItem("token"),
    role: (localStorage.getItem("role") as Role) || null,
    username: localStorage.getItem("username"),
  };
}

/**
 * Indicates whether the user is currently logged in.
 */
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

/**
 * Returns the currently logged-in username.
 */
export function getUsername() {
  return localStorage.getItem("username");
}

/**
 * Returns the currently logged-in user's role.
 */
export function getRole(): Role | null {
  return (localStorage.getItem("role") as Role) || null;
}
