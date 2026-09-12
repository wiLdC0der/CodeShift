import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../lib/db";
import { createAccessToken } from "../utils/jwt";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const existingUser = await db.orm.public.User.first({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.orm.public.User.create({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
    });

    const token = createAccessToken(user.id);

    res.cookie("codeshift_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration failed:", error);

    return res.status(500).json({
      message: "Unable to create account.",
    });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.orm.public.User.first({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createAccessToken(user.id);

    res.cookie("codeshift_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Unable to log in.",
    });
  }
});

/**
 * GET /api/auth/me
 */
router.get(
  "/me",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = await db.orm.public.User.first({
        id: req.userId!,
      });

      if (!user) {
        res.clearCookie("codeshift_token", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        return res.status(401).json({
          message: "User no longer exists.",
        });
      }

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Session lookup failed:", error);

      return res.status(500).json({
        message: "Unable to retrieve session.",
      });
    }
  },
);

/**
 * POST /api/auth/logout
 */
router.post("/logout", (_req, res) => {
  res.clearCookie("codeshift_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res.json({
    message: "Logged out successfully.",
  });
});

export default router;