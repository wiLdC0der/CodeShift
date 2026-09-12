import { Router } from "express";
import { db } from "../lib/db";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

type AssessmentScores = {
  syntaxScore: number;
  dataStructuresScore: number;
  algorithmsScore: number;
  oopScore: number;
  overallScore: number;
};

router.post(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const {
        syntaxScore,
        dataStructuresScore,
        algorithmsScore,
        oopScore,
        overallScore,
      } = req.body as AssessmentScores;

      const scores = [
        syntaxScore,
        dataStructuresScore,
        algorithmsScore,
        oopScore,
        overallScore,
      ];

      const invalid = scores.some(
        (score) =>
          typeof score !== "number" ||
          score < 0 ||
          score > 100,
      );

      if (invalid) {
        return res.status(400).json({
          message: "Invalid assessment scores.",
        });
      }

      const assessment = await db.orm.public.Assessment.create({
        userId: req.userId!,
        syntaxScore,
        dataStructuresScore,
        algorithmsScore,
        oopScore,
        overallScore,
      });

      const skillLevel =
        overallScore >= 90
          ? "EXPERT"
          : overallScore >= 75
            ? "ADVANCED"
            : overallScore >= 50
              ? "INTERMEDIATE"
              : "BEGINNER";

      const existingProfile =
        await db.orm.public.LearningProfile.first({
          userId: req.userId!,
        });

      if (existingProfile) {
      await db.orm.public.LearningProfile
        .where({ id: existingProfile.id })
        .update({
            syntaxScore,
            dataStructuresScore,
            algorithmsScore,
            oopScore,
            overallScore,
            skillLevel,
  });
      } else {
        await db.orm.public.LearningProfile.create({
          userId: req.userId!,
          sourceLanguage: "Python",
          targetLanguage: "Java",
          skillLevel,
          syntaxScore,
          dataStructuresScore,
          algorithmsScore,
          oopScore,
          overallScore,
        });
      }

      return res.status(201).json({
        message: "Assessment saved successfully.",
        assessment,
        skillLevel,
      });
    } catch (error) {
      console.error("Assessment submission failed:", error);

      return res.status(500).json({
        message: "Unable to save assessment.",
      });
    }
  },
);

export default router;