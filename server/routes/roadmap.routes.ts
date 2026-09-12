import { Router } from "express";
import { db } from "../lib/db";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

type Concept = {
  key: string;
  title: string;
  description: string;
  category:
    | "syntax"
    | "data-structures"
    | "algorithms"
    | "oop";
  difficulty: "foundation" | "core" | "advanced";
};

const concepts: Concept[] = [
  {
    key: "java-types",
    title: "Variables & Types",
    description: "Python variables → Java static typing.",
    category: "syntax",
    difficulty: "foundation",
  },
  {
    key: "java-control-flow",
    title: "Control Flow",
    description: "if, switch, for and while in Java.",
    category: "syntax",
    difficulty: "foundation",
  },
  {
    key: "java-methods",
    title: "Functions → Methods",
    description: "Parameters, return types and method syntax.",
    category: "syntax",
    difficulty: "core",
  },
  {
    key: "java-arrays",
    title: "Lists → Arrays",
    description: "Python lists vs Java fixed-size arrays.",
    category: "data-structures",
    difficulty: "foundation",
  },
  {
    key: "java-arraylist",
    title: "Lists → ArrayList",
    description: "Dynamic collections and generics.",
    category: "data-structures",
    difficulty: "core",
  },
  {
    key: "java-hashmap",
    title: "Dictionary → HashMap",
    description: "Key-value structures in both languages.",
    category: "data-structures",
    difficulty: "core",
  },
  {
    key: "java-hashset",
    title: "Set → HashSet",
    description: "Uniqueness, hashing and set operations.",
    category: "data-structures",
    difficulty: "core",
  },
  {
    key: "java-classes",
    title: "Classes & Objects",
    description: "Python classes → Java classes and objects.",
    category: "oop",
    difficulty: "core",
  },
  {
    key: "java-inheritance",
    title: "Inheritance",
    description: "Inheritance and method overriding in Java.",
    category: "oop",
    difficulty: "core",
  },
  {
    key: "java-interfaces",
    title: "Interfaces",
    description: "Java interfaces and abstraction.",
    category: "oop",
    difficulty: "core",
  },
  {
    key: "java-generics",
    title: "Generics",
    description: "Why Java uses typed collections.",
    category: "oop",
    difficulty: "advanced",
  },
  {
    key: "java-sorting",
    title: "Sorting & Comparators",
    description: "Python sorting patterns → Java Comparator.",
    category: "algorithms",
    difficulty: "core",
  },
  {
    key: "java-binary-search",
    title: "Binary Search",
    description: "Implement binary search in Java.",
    category: "algorithms",
    difficulty: "core",
  },
  {
    key: "java-recursion",
    title: "Recursion",
    description: "Translate recursive Python solutions into Java.",
    category: "algorithms",
    difficulty: "core",
  },
];

const categoryScoreMap = {
  syntax: "syntaxScore",
  "data-structures": "dataStructuresScore",
  algorithms: "algorithmsScore",
  oop: "oopScore",
} as const;

function getPriority(
  concept: Concept,
  scores: Record<string, number>,
): number {
  const categoryScore =
    scores[categoryScoreMap[concept.category]];

  let priority = 0;

  if (categoryScore < 50) {
    priority = 100;
  } else if (categoryScore < 70) {
    priority = 80;
  } else if (categoryScore < 85) {
    priority = 50;
  } else if (categoryScore < 95) {
    priority = 20;
  } else {
    priority = 5;
  }

  // Strong learners should not waste time on basic concepts.
  if (
    concept.difficulty === "foundation" &&
    categoryScore >= 90
  ) {
    priority -= 30;
  }

  // Advanced concepts should wait until the category foundation is reasonable.
  if (
    concept.difficulty === "advanced" &&
    categoryScore < 60
  ) {
    priority -= 20;
  }

  return priority;
}

router.get(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const profile =
        await db.orm.public.LearningProfile.first({
          userId: req.userId!,
        });

      if (!profile) {
        return res.status(404).json({
          message: "Learning profile not found.",
        });
      }

      const scores = {
        syntaxScore: profile.syntaxScore,
        dataStructuresScore: profile.dataStructuresScore,
        algorithmsScore: profile.algorithmsScore,
        oopScore: profile.oopScore,
      };

      const roadmap = concepts
        .map((concept) => ({
          ...concept,
          priority: getPriority(concept, scores),
        }))
        .sort((a, b) => b.priority - a.priority);

      return res.json({
        roadmap: {
          sourceLanguage: profile.sourceLanguage,
          targetLanguage: profile.targetLanguage,
          skillLevel: profile.skillLevel,
          scores: {
            syntaxScore: profile.syntaxScore,
            dataStructuresScore: profile.dataStructuresScore,
            algorithmsScore: profile.algorithmsScore,
            oopScore: profile.oopScore,
            overallScore: profile.overallScore,
          },
          concepts: roadmap,
        },
      });
    } catch (error) {
      console.error("Roadmap retrieval failed:", error);

      return res.status(500).json({
        message: "Unable to retrieve roadmap.",
      });
    }
  },
);

export default router;