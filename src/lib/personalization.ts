import type { RoadmapConcept } from "../data/roadmap";

export type AssessmentProfile = {
  syntaxScore: number;
  dataStructuresScore: number;
  algorithmsScore: number;
  oopScore: number;
};

type Priority = 0 | 1 | 2 | 3;

function getScorePriority(score: number): Priority {
  if (score < 50) return 3; // Weak
  if (score < 70) return 2; // Developing
  if (score < 85) return 1; // Strong
  return 0; // Mastered
}

function getCategoryPriority(
  category: RoadmapConcept["category"],
  profile: AssessmentProfile,
): Priority {
  switch (category) {
    case "syntax":
      return getScorePriority(profile.syntaxScore);
    case "data-structures":
      return getScorePriority(profile.dataStructuresScore);
    case "algorithms":
      return getScorePriority(profile.algorithmsScore);
    case "oop":
      return getScorePriority(profile.oopScore);
    default:
      return 1;
  }
}

export function getPersonalizedRoadmap(
  roadmap: RoadmapConcept[],
  profile: AssessmentProfile,
): RoadmapConcept[] {
  // 1. Assign priority and keep track of original index
  const conceptMap = new Map<string, { concept: RoadmapConcept; priority: Priority; originalIndex: number }>();
  
  roadmap.forEach((concept, index) => {
    conceptMap.set(concept.key, {
      concept,
      priority: getCategoryPriority(concept.category, profile),
      originalIndex: index,
    });
  });

  // 2. Build dependency graph (in-degrees and adj list)
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  roadmap.forEach((concept) => {
    if (!inDegree.has(concept.key)) inDegree.set(concept.key, 0);
    if (!adj.has(concept.key)) adj.set(concept.key, []);

    concept.prerequisites.forEach((prereq) => {
      // prereq -> concept
      if (!adj.has(prereq)) adj.set(prereq, []);
      adj.get(prereq)!.push(concept.key);

      inDegree.set(concept.key, (inDegree.get(concept.key) || 0) + 1);
    });
  });

  // 3. Topological sort using priority then original index
  const available: string[] = [];
  
  // Find initial available concepts
  for (const [key, degree] of inDegree.entries()) {
    if (degree === 0) {
      available.push(key);
    }
  }

  const result: RoadmapConcept[] = [];

  while (available.length > 0) {
    // Sort available: highest priority first, then lowest original index (to preserve order)
    available.sort((a, b) => {
      const nodeA = conceptMap.get(a)!;
      const nodeB = conceptMap.get(b)!;
      
      if (nodeA.priority !== nodeB.priority) {
        return nodeB.priority - nodeA.priority; // higher priority first
      }
      return nodeA.originalIndex - nodeB.originalIndex; // earlier in original roadmap first
    });

    const currentKey = available.shift()!;
    result.push(conceptMap.get(currentKey)!.concept);

    // Decrease in-degree of neighbors
    const neighbors = adj.get(currentKey) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        available.push(neighbor);
      }
    }
  }

  // Handle cycles or missing dependencies gracefully (fallback)
  if (result.length !== roadmap.length) {
    // Should not happen with valid prerequisite graph, but fallback to original
    return [...roadmap];
  }

  return result;
}

export function getPrimaryFocusArea(profile: AssessmentProfile): string {
  const scores = [
    { name: "Syntax", score: profile.syntaxScore },
    { name: "Data Structures", score: profile.dataStructuresScore },
    { name: "Algorithms", score: profile.algorithmsScore },
    { name: "OOP", score: profile.oopScore },
  ];

  scores.sort((a, b) => a.score - b.score);
  return scores[0].name;
}
