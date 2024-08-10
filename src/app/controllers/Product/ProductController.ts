import { Request, Response } from 'express';
import Product from 'types/Product.type';
import ProductRepository from 'repositories/ProductRepository';
import ProductError from 'builders/errors/ProductError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import schemaResponseError from 'validators/response/schemaResponseError';

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

      const product = await ProductRepository.getFiltered(req.body);

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
        return res.status(404).json({ error: "Product not found" });
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
      const products = await ProductRepository.get();

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

      if (Object.values(fields).includes("")) {
        return res.status(400).send("All fields must be filled out!");
      }

      // ajustar essa logica aqui!, validar se tem um uuid ou id 
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
