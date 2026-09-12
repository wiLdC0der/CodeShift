const API_URL = "http://localhost:5000/api";

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
export function getAllProgress() {
  return request<{ progress: Progress[] }>("/progress");
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

