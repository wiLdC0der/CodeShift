import { Router } from "express";
import { Temporal } from "temporal-polyfill";
import { db } from "../lib/db";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

function now() {
  return Temporal.Now.instant();
}
/**
 * GET /api/progress
 */
router.get(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const progress =
        await db.orm.public.UserProgress
          .where({
            userId: req.userId!,
          })
          .all();

      return res.json({
        progress,
      });
    } catch (error) {
      console.error("Progress list retrieval failed:", error);

      return res.status(500).json({
        message: "Unable to load progress.",
      });
    }
  },
);
/**
 * GET /api/progress/:conceptKey
 */router.get(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const progress = await db.orm.public.UserProgress
        .where({ userId: req.userId! })
        .all();

      return res.json({
        progress,
      });
    } catch (error) {
      console.error("All progress retrieval failed:", error);

      return res.status(500).json({
        message: "Unable to load progress.",
      });
    }
  },
);
router.get(
  
  "/:conceptKey",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const conceptKey = String(req.params.conceptKey);

      const progress =
        await db.orm.public.UserProgress.first({
          userId: req.userId!,
          conceptKey,
        });

      return res.json({
        progress: progress ?? {
          conceptKey,
          mastery: 0,
          completed: false,
          lastVisited: null,
        },
      });
    } catch (error) {
      console.error("Progress retrieval failed:", error);

      return res.status(500).json({
        message: "Unable to load progress.",
      });
    }
  },
);

/**
 * POST /api/progress/:conceptKey/visit
 */
router.post(
  "/:conceptKey/visit",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const conceptKey = String(req.params.conceptKey);

      const existing =
        await db.orm.public.UserProgress.first({
          userId: req.userId!,
          conceptKey,
        });

      const timestamp = now();

      if (existing) {
        const updated =
          await db.orm.public.UserProgress
            .where({
              id: existing.id,
            })
            .update({
              lastVisited: timestamp,
            });

        return res.json({
          progress: updated,
        });
      }

      const created =
        await db.orm.public.UserProgress.create({
          userId: req.userId!,
          conceptKey,
          mastery: 0,
          completed: false,
          lastVisited: timestamp,
        });

      return res.status(201).json({
        progress: created,
      });
    } catch (error) {
      console.error(
        "Progress visit update failed:",
        error,
      );

      return res.status(500).json({
        message: "Unable to save progress.",
      });
    }
  },
);

/**
 * POST /api/progress/:conceptKey/complete
 */
router.post(
  "/:conceptKey/complete",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const conceptKey = String(req.params.conceptKey);

      const existing =
        await db.orm.public.UserProgress.first({
          userId: req.userId!,
          conceptKey,
        });

      const timestamp = now();

      if (existing) {
        const updated =
          await db.orm.public.UserProgress
            .where({
              id: existing.id,
            })
            .update({
              mastery: 100,
              completed: true,
              lastVisited: timestamp,
            });

        return res.json({
          message: "Lesson completed.",
          progress: updated,
        });
      }

      const created =
        await db.orm.public.UserProgress.create({
          userId: req.userId!,
          conceptKey,
          mastery: 100,
          completed: true,
          lastVisited: timestamp,
        });

      return res.status(201).json({
        message: "Lesson completed.",
        progress: created,
      });
    } catch (error) {
      console.error(
        "Lesson completion failed:",
        error,
      );

      return res.status(500).json({
        message: "Unable to save lesson completion.",
      });
    }
  },
);

export default router;