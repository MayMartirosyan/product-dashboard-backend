import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

export class ProductController {
  static async getProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      const skip = (page - 1) * limit;

      const productRepository = AppDataSource.getRepository(Product);
      const [products, total] = await productRepository.findAndCount({
        relations: ["user"],
        skip,
        take: limit,
        order: { id: "ASC" },
      });

      const hasMore = skip + products.length < total;

      return res.status(200).json({
        products,
        total,
        hasMore,
      });
    } catch (error: any) {
      console.error("GetProducts error:", error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to fetch products" });
    }
  }

  static async getMyProducts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      const skip = (page - 1) * limit;

      const productRepository = AppDataSource.getRepository(Product);
      const [products, total] = await productRepository.findAndCount({
        where: { user: { id: userId } },
        relations: ["user"],
        skip,
        take: limit,
        order: { id: "ASC" },
      });

      const hasMore = skip + products.length < total;

      return res.status(200).json({
        products,
        total,
        hasMore,
      });
    } catch (error: any) {
      console.error("GetMyProducts error:", error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to fetch user products" });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id },
        relations: ["user"],
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error: any) {
      console.error("GetProductById error:", error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to fetch product" });
    }
  }

  static async addProduct(req: Request, res: Response) {
    try {
      const { name, price, discountedPrice, description } = req.body;
      const picture = req.file ? `/Uploads/${req.file.filename}` : undefined;

      if (!name || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const parsedPrice = parseFloat(price);
      const parsedDiscountedPrice = discountedPrice
        ? parseFloat(discountedPrice)
        : undefined;

      if (
        parsedDiscountedPrice !== undefined &&
        parsedDiscountedPrice >= parsedPrice
      ) {
        return res
          .status(400)
          .json({
            message: "Discounted price must be less than the original price",
          });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const productRepository = AppDataSource.getRepository(Product);
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const product = productRepository.create({
        name,
        price: parsedPrice,
        discountedPrice: parsedDiscountedPrice,
        picture,
        description,
        user,
      });

      await productRepository.save(product);
      return res.status(201).json(product);
    } catch (error: any) {
      console.error("AddProduct error:", error);
      return res
        .status(400)
        .json({ message: error.message || "Failed to add product" });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, discountedPrice, description } = req.body;
      const picture = req.file ? `/Uploads/${req.file.filename}` : undefined;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id, user: { id: userId } },
      });
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found or not owned by user" });
      }

      const parsedPrice = price ? parseFloat(price) : product.price;
      const parsedDiscountedPrice = discountedPrice
        ? parseFloat(discountedPrice)
        : product.discountedPrice;

      if (
        parsedDiscountedPrice !== undefined &&
        parsedDiscountedPrice >= parsedPrice
      ) {
        return res
          .status(400)
          .json({
            message: "Discounted price must be less than the original price",
          });
      }

      productRepository.merge(product, {
        name: name || product.name,
        price: parsedPrice,
        discountedPrice: parsedDiscountedPrice,
        picture: picture || product.picture,
        description: description || product.description,
      });

      await productRepository.save(product);
      return res.status(200).json(product);
    } catch (error: any) {
      console.error("UpdateProduct error:", error);
      return res
        .status(400)
        .json({ message: error.message || "Failed to update product" });
    }
  }
}
