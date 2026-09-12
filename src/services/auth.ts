export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  message: string;
  user: User;
};

const API_URL = "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export function register(
  name: string,
  email: string,
  password: string,
) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function getCurrentUser() {
  return request<{ user: User }>("/auth/me");
}

export function logout() {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}