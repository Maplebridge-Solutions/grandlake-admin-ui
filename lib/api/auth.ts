"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { GetUserResponse, UserData } from "@/lib/types/auth";

const API_BASE =
  process.env.API_BASE_URL ??
  "https://api.grandlakemunicipality.ca/api/v1/";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "auth_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
};

async function createSession(backendToken: string): Promise<string> {
  return new SignJWT({ token: backendToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecret());
}

export async function getBackendToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, getSecret());
    return payload.token as string;
  } catch {
    return null;
  }
}

export const login = async (
  email: string,
  password: string,
): Promise<
  | { success: true; user: UserData["user"]; profile: UserData["profile"] }
  | { success: false; error: string }
> => {
  try {
    const url = `${API_BASE}auth/login`;
    const body = JSON.stringify({ email, password });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data?.message ?? data?.error ?? "Invalid credentials." };
    }

    const { token, user, profile } = data.data;

    const session = await createSession(token);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, session, cookieOptions);
    // Readable by JS — used only to set Authorization header in apiClient
    cookieStore.set("auth_token_client", token, { ...cookieOptions, httpOnly: false });

    return { success: true, user, profile };
  } catch {
    return { success: false, error: "Network error. Please check your connection." };
  }
};

export const getUser = async (): Promise<UserData | null> => {
  const token = await getBackendToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // Clear stale session cookie so the client gets redirected to login
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
      cookieStore.set("auth_token_client", "", { ...cookieOptions, httpOnly: false, maxAge: 0 });
      return null;
    }
    const data: GetUserResponse = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  const backendToken = await getBackendToken();

  if (backendToken) {
    await fetch(`${API_BASE}auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${backendToken}` },
    }).catch(() => {});
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
  cookieStore.set("auth_token_client", "", { ...cookieOptions, httpOnly: false, maxAge: 0 });
};
