import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: req.user?.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      console.error("GetProfile error:", error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to fetch profile" });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { firstName, lastName, birthDate, password } = req.body;
      const picture = req.file ? `/Uploads/${req.file.filename}` : undefined;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      userRepository.merge(user, {
        firstName,
        lastName,
        birthDate,
        picture,
      });
      await userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      console.error("UpdateProfile error:", error);
      return res
        .status(400)
        .json({ message: error.message || "Failed to update profile" });
    }
  }
}
