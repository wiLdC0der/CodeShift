import { Router } from "express";
import { db } from "../lib/db";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";
import { roadmapConcepts } from "../../src/data/roadmap";
import { getPersonalizedRoadmap } from "../../src/lib/personalization";

const router = Router();

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

      const personalizedRoadmap = getPersonalizedRoadmap(roadmapConcepts, scores);

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
          concepts: personalizedRoadmap,
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