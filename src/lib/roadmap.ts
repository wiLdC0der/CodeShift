import {
  roadmapConcepts,
  type RoadmapConcept,
} from "../data/roadmap";

type Scores = {
  syntaxScore: number;
  dataStructuresScore: number;
  algorithmsScore: number;
  oopScore: number;
};

type RoadmapItem = RoadmapConcept & {
  priority: number;
};

const categoryScoreMap: Record<
  RoadmapConcept["category"],
  keyof Scores
> = {
  syntax: "syntaxScore",
  "data-structures": "dataStructuresScore",
  algorithms: "algorithmsScore",
  oop: "oopScore",
};

export function generateRoadmap(scores: Scores): RoadmapItem[] {
  return roadmapConcepts
    .map((concept) => {
      const score = scores[categoryScoreMap[concept.category]];

      let priority = 0;

      if (score < 50) {
        priority = 100;
      } else if (score < 70) {
        priority = 80;
      } else if (score < 85) {
        priority = 50;
      } else if (score < 95) {
        priority = 20;
      } else {
        priority = 5;
      }

      if (concept.difficulty === "foundation" && score >= 90) {
        priority -= 15;
      }

      if (concept.difficulty === "advanced" && score < 60) {
        priority -= 10;
      }

      return {
        ...concept,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority);
}