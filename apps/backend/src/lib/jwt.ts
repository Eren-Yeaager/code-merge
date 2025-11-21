import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";

export interface TokenPayLoad {
  userId: string;
  githubId: string;
}
export function signToken(payload: TokenPayLoad): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
export function verifyToken(token: string): TokenPayLoad {
  return jwt.verify(token, JWT_SECRET) as TokenPayLoad;
}
