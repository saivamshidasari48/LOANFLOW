import client from "./client";

/**
 * Role types used for role-based access control across the UI.
 */
export type Role = "CUSTOMER" | "ANALYST" | "ADMIN";

/**
 * Aggregated metrics returned for the admin dashboard.
 */
export type AdminMetrics = {
  customers: number;
  analysts: number;
  admins: number;
  loans: number;
};

/**
 * User model exposed to the admin UI.
 */
export type AdminUser = {
  id: number;
  username: string;
  role: Role;
  active: boolean;
};

/**
 * Fetches system metrics for the admin dashboard.
 */
export async function getAdminMetrics(): Promise<AdminMetrics> {
  const res = await client.get("/api/admin/metrics");
  return res.data;
}

/**
 * Retrieves a list of users.
 * Optionally filters users by role.
 */
export async function listAdminUsers(role?: Role): Promise<AdminUser[]> {
  const res = await client.get("/api/admin/users", {
    params: role ? { role } : {},
  });
  return res.data;
}

/**
 * Updates the role assigned to a user.
 */
export async function updateUserRole(
  id: number,
  role: Role
): Promise<AdminUser> {
  const res = await client.put(`/api/admin/users/${id}/role`, { role });
  return res.data;
}

/**
 * Enables or disables a user account.
 */
export async function updateUserActive(
  id: number,
  active: boolean
): Promise<AdminUser> {
  const res = await client.put(`/api/admin/users/${id}/active`, { active });
  return res.data;
}
