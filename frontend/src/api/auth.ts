import client from "./client";

/**
 * Payload used when registering a new user account.
 */
export type RegisterRequest = {
  username: string;
  password: string;
};

/**
 * Payload used when logging in.
 */
export type LoginRequest = {
  username: string;
  password: string;
};

/**
 * Response returned after successful authentication.
 */
export type LoginResponse = {
  token: string;
  username: string;
  role: "ADMIN" | "ANALYST" | "CUSTOMER";
};

/**
 * Registers a new user.
 */
export async function register(req: RegisterRequest): Promise<void> {
  await client.post("/api/auth/register", req);
}

/**
 * Authenticates a user and returns a JWT token with identity details.
 */
export async function login(payload: {
  username: string;
  password: string;
}) {
  const res = await client.post<LoginResponse>("/api/auth/login", payload);
  return res.data;
}
