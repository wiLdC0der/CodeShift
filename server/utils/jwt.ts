import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

export function createAccessToken(userId: string): string {
  const secret = getJwtSecret();

  return jwt.sign(
    { userId },
    secret,
    {
      expiresIn: JWT_EXPIRES_IN_SECONDS,
      algorithm: "HS256",
    },
  );
}

export function verifyAccessToken(
  token: string,
): { userId: string } {
  const secret = getJwtSecret();

  const payload = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  });

  if (
    typeof payload === "string" ||
    typeof payload.userId !== "string"
  ) {
    throw new Error("Invalid authentication token");
  }

  return {
    userId: payload.userId,
  };
}