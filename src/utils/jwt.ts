import jwt from "jsonwebtoken";
import dotenv from "dotenv";


const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET as string) as any;
};
