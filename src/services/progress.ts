const API_URL = "http://localhost:5000/api";
const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "/api";

export type Progress = {
  conceptKey: string;
  mastery: number;
  completed: boolean;
  lastVisited?: string;
};

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
    throw new Error(
      data.message || "Unable to save progress.",
    );
  }

  return data;
}

export function getProgress(conceptKey: string) {
  return request<{ progress: Progress }>(
    `/progress/${conceptKey}`,
  );
}

export async function getAllProgress(): Promise<{
  progress: Progress[];
}> {
  const response = await fetch(`${API_BASE_URL}/progress`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load progress.");
  }

  return data;
}

export function markLessonVisited(conceptKey: string) {
  return request<{ progress: Progress }>(
    `/progress/${conceptKey}/visit`,
    {
      method: "POST",
    },
  );
}

export function completeLesson(conceptKey: string) {
  return request<{ progress: Progress }>(
    `/progress/${conceptKey}/complete`,
    {
      method: "POST",
    },
  );
}

