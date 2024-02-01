import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from 'types/Product.type';
import ProductRepository from 'repositories/ProductRepository';
import ProductError from 'builders/errors/ProductError';
import ResponseBuilder from 'builders/response/ResponseBuilder';

class ProductController {
  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.body.id;

      if (!id) {
        throw ProductError.invalidInput();
      }

      const productResponse = await ProductRepository.delete(id);

      if (!productResponse) {
        throw ProductError.productDeletionFailed();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Product deleted successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async getAllAspects(req: Request, res: Response) {
    try {
      const aspects = await ProductRepository.getAllAspects();

      return ResponseBuilder.send({
        response: res,
        message: "Aspects retrieved successfully!",
        statusCode: 200,
        data: aspects
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async getFilteredProduct(req: Request, res: Response) {
    try {
      if (!req.query) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const product = await ProductRepository.getFiltered(req.query);

      return ResponseBuilder.send({
        response: res,
        message: "Filtered Product retrieved successfully!",
        statusCode: 200,
        data: product
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id: any = req.params.id;

      if (!id) {
        return res.status(400).json({
          error: "Missing product ID"
        });
      }

      const productId = typeof id === "string" ? parseInt(id, 10) : id;
      const product = await ProductRepository.getById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return ResponseBuilder.send({
        response: res,
        message: "Product retrieved successfully!",
        statusCode: 200,
        data: product
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductRepository.get();

      if (!products) {
        throw ProductError.productNotFound();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Products retrieved successfully!",
        statusCode: 200,
        data: products
      });
    } catch (error) {
      ProductError.handleError(res, error);
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const fields: Product = req.body;
      const productCreated = await ProductRepository.create(fields);

      if (!productCreated) {
        throw ProductError.productCreationFailed();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Product created successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const fields: Product = req.body;

      if (Object.values(fields).includes("")) {
        return res.status(400).send("All fields must be filled out!");
      }

      const productResponse = await ProductRepository.update(fields.id!, fields);

      if (!productResponse) {
        throw ProductError.productUpdateFailed();
      }
      return ResponseBuilder.send({
        response: res,
        message: "Product updated successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }
}

export default ProductController;
