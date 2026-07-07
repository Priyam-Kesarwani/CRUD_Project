export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(Array.isArray(data.message) ? data.message[0] : data.message);
  }

  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(Array.isArray(data.message) ? data.message[0] : data.message);
  }

  return data;
}

export async function getProfile(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to fetch profile");
  }

  return data;
}

export async function updateProfile(token: string, payload: { name: string; email: string }) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(Array.isArray(data.message) ? data.message[0] : data.message ?? "Failed to update profile");
  }

  return data;
}

export async function deleteProfile(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to delete profile");
  }
}
