import { Request, Response } from "express";
import ProductRepository from "repositories/ProductRepository";
import ProductError from "builders/errors/ProductError";
import ResponseBuilder from "builders/response/ResponseBuilder";
import schemaResponseError from "validators/response/schemaResponseError";
import { Product } from "types/Product.type";

class ProductController {
  static async deleteProduct(req: Request, res: Response) {
    try {
      schemaResponseError(req, res);

      const id = req.body.id;

      const productResponse = await ProductRepository.delete(id);

      if (!productResponse) {
        throw ProductError.productDeletionFailed();
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

  static async getAllAspects(req: Request, res: Response) {
    try {
      const aspects = await ProductRepository.getAllAspects();

      ResponseBuilder.send({
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
      schemaResponseError(req, res);
      const body = req.body;

      const hasFilteredValue = Object.values(body).some((arr) => Array.isArray(arr) && arr.length != 0);
      if (!hasFilteredValue) {
        throw ProductError.defaultMessage();
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

  static async getProductById(req: Request, res: Response) {
    try {
      schemaResponseError(req, res);

      const id: any = req.params.id;
      const productId = typeof id === "string" ? parseInt(id, 10) : id;
      const product = await ProductRepository.getById(productId);

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

  static async getProducts(req: Request, res: Response) {
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

  static async createProduct(req: Request, res: Response) {
    try {
      schemaResponseError(req, res);

      const fields: Product = req.body;
      const productCreated = await ProductRepository.create(fields);

      if (!productCreated) {
        throw ProductError.productCreationFailed();
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

  static async updateProduct(req: Request, res: Response) {
    try {
      schemaResponseError(req, res);

      const fields: Product = req.body;

      if (!fields.uuid) {
        throw ProductError.invalidInput();
      }

      const productResponse = await ProductRepository.update(fields.uuid, fields);

      if (!productResponse) {
        throw ProductError.productUpdateFailed();
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
}

export default ProductController;
