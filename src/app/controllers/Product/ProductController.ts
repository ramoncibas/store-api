import { Request, Response } from 'express';
import Product from 'types/Product.type';
import ProductRepository from 'repositories/ProductRepository';

class ProductController {
  /**
   * Delete a product from the database based on its ID.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async deleteProduct(req: Request, res: Response) {
    const id = req.body.id;
    try {
      await ProductRepository.deleteProduct(id);
      res.send("Product deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong, Delete product from Shopping Cart");
    }
  }

  /**
   * Get all aspects of products from the database.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async getAllAspects(req: Request, res: Response) {
    try {
      const aspects = await ProductRepository.getAllAspects();
  
      // Aproveitar, e melhorar a logica disso aqui

      // res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong, Select All Aspects");
    }
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves with an array of filtered products.
   */
  static async getFilteredProduct(req: Request, res: Response) {
    try {
      if (!req.query) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const product = await ProductRepository.getFilteredProduct(req.query);

      res.send(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong, Select All Aspects" });
    }
  }

  /**
   * Get a product from the database based on its ID.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async getProductById(req: Request, res: Response) {
    const id: any = req.query.id;

    try {
      if (id === undefined) {
        return res.status(400).json({ error: "Missing product ID" });
      }
    
      const productId = typeof id === "string" ? parseInt(id, 10) : id;
      const product = await ProductRepository.getProductById(productId);
    
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
    
      res.send(product);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong, Select All Products");
    }
  }

  /**
   * Get all products from the database.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves with an array of products.
   */
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductRepository.getAllProducts();
      res.send(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong, Select All Products");
    }
  }

  /**
   * Create a new product in the database.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async saveProduct(req: Request, res: Response) {
    const fields: Product = req.body;

    if (Object.values(fields).includes("") || Object.values(fields).includes(undefined)) {      
      return res.status(400).send("All fields must be filled out!");
    } else if (fields.discount_percentage > 90) {
      return res.status(400).send("Discount percentage exceeds the limit of 90%");
    }
    
    try {
      await ProductRepository.createProduct(fields);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong to Save the Product");
    }
  }

  /**
   * Update an existing product in the database.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async updateProduct(req: Request, res: Response) {
    const fields: Product = req.body;
  
    if (Object.values(fields).includes("")) {
      return res.status(400).send("All fields must be filled out!");
    }

    try {
      await ProductRepository.updateProduct(fields);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong, SaveProduct");
    }
  }
}

export default ProductController;
