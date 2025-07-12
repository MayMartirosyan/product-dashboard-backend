import { Router } from "express";
import { ProfileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, ProfileController.getProfile);
router.put("/", authMiddleware, ProfileController.updateProfile);

export default router;
