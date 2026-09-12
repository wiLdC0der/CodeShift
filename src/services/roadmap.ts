export type LearningScores = {
  syntaxScore: number;
  dataStructuresScore: number;
  algorithmsScore: number;
  oopScore: number;
  overallScore: number;
};

export type RoadmapConcept = {
  key: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  priority: number;
};

export type RoadmapProfile = {
  sourceLanguage: string;
  targetLanguage: string;
  skillLevel: string;
  scores: LearningScores;
  concepts: RoadmapConcept[];
};

const API_URL = "http://localhost:5000/api";

export async function getRoadmap(): Promise<{
  roadmap: RoadmapProfile;
}> {
  const response = await fetch(`${API_URL}/roadmap`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load your roadmap.",
    );
  }

  return data;
}