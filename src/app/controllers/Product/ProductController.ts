import { Request, Response } from "express";
import ProductRepository from "repositories/ProductRepository";
import ProductError from "builders/errors/ProductError";
import { ResponseBuilder } from "builders/response";
import { Product } from "@types";

class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductRepository.getAll();

      if (!products) {
        throw ProductError.productNotFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Products retrieved successfully!",
        statusCode: 200,
        data: products
      });
    } catch (error) {
      ProductError.handleError(res, error);
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id: any = req.params.id;
      const productId = typeof id === "string" ? parseInt(id, 10) : id;
      const product = await ProductRepository.findById(productId);

      if (!product) {
        throw ProductError.productNotFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Product retrieved successfully!",
        statusCode: 200,
        data: product
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async getAttributes(req: Request, res: Response) {
    try {
      const attributes = await ProductRepository.findByAttributes();

      ResponseBuilder.send({
        response: res,
        message: "Attributes retrieved successfully!",
        statusCode: 200,
        data: attributes
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async getFiltered(req: Request, res: Response) {
    try {
      const body = req.body;
      const hasFilteredValue = Object.values(body).some((arr) => Array.isArray(arr) && arr.length != 0);
      
      if (!hasFilteredValue) {
        throw ProductError.invalidInput();
      }

      const product = await ProductRepository.getFiltered(body);

      if (!product) {
        throw ProductError.productNotFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Filtered Product retrieved successfully!",
        statusCode: 200,
        data: product
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const fields: Product = req.body;
      const productCreated = await ProductRepository.create(fields);

      if (!productCreated) {
        throw ProductError.creationFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Product created successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const fields: Partial<Product> = req.body;

      if (!fields.uuid || !fields.id) {
        throw ProductError.invalidInput();
      }

      const productResponse = await ProductRepository.update(fields.id, fields);

      if (!productResponse) {
        throw ProductError.updateFailed();
      }
      ResponseBuilder.send({
        response: res,
        message: "Product updated successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        throw ProductError.invalidInput();
      }

      const productResponse = await ProductRepository.delete(id);

      if (!productResponse) {
        throw ProductError.deletionFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Product deleted successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ProductError.handleError(res, error);
    }
  }
}

export default ProductController;
