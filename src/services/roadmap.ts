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

import type { Progress } from "./progress";

export type ConceptStatus = "completed" | "next" | "upcoming";

export function getConceptStatus(
  roadmap: RoadmapProfile,
  progress: Progress[],
  conceptKey: string
): ConceptStatus {
  const completedKeys = new Set(
    progress.filter((item) => item.completed).map((item) => item.conceptKey)
  );

  const firstIncompleteIndex = roadmap.concepts.findIndex(
    (concept) => !completedKeys.has(concept.key)
  );

  const conceptIndex = roadmap.concepts.findIndex((c) => c.key === conceptKey);

  if (conceptIndex === -1) {
    return "upcoming";
  }

  if (completedKeys.has(conceptKey)) {
    return "completed";
  }

  // If this is the first incomplete concept, or if ALL previous concepts are completed
  if (firstIncompleteIndex === -1 || conceptIndex === firstIncompleteIndex) {
    return "next";
  }

  return "upcoming";
}