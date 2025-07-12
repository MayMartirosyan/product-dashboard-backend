import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", ProductController.getProducts);

router.get("/my", authMiddleware, ProductController.getMyProducts);
router.post("/", authMiddleware, ProductController.addProduct);
router.put("/:id", authMiddleware, ProductController.updateProduct);

router.get("/:id", ProductController.getProductById);

export default router;
