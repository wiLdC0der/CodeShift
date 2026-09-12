type AssessmentResult = {
  syntaxScore: number;
  dataStructuresScore: number;
  algorithmsScore: number;
  oopScore: number;
  overallScore: number;
};

type AssessmentResponse = {
  message: string;
  assessment: {
    id: string;
    overallScore: number;
  };
  skillLevel: string;
};

const API_URL = "http://localhost:5000/api";

export async function submitAssessment(
  result: AssessmentResult,
): Promise<AssessmentResponse> {
  const response = await fetch(`${API_URL}/assessment`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to save assessment.",
    );
  }

  return data;
}