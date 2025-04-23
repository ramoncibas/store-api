import ProductModel from "models/ProductModel";
import CacheService from "lib/cache";
import { ProductError } from "builders/errors";
import { AttributesResult, Product, ProductFilter } from "@types";

class ProductRepository {
  private cache;

  private cacheKey = {
    product: (productId: number) => {
      return `product_id_${productId}`;
    },
    attributes: () => {
      return `product_attributes`;
    },
  };

  constructor() {
    this.cache = new CacheService('product');
  }

  // TODO: Migrar para um repository só de stock, e adiconar uma tabela para o mesmo
  public async updateStock(productId: number, quantity: number) {
    return productId;
  }

  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  public async findById(productId: number): Promise<Product | null> {
    try {
      const cacheKey = this.cacheKey.product(productId);
      const cached = await this.cache.get<Product>(cacheKey);

      if (cached) return cached.items[0];

      const product = await ProductModel.findById(productId);

      if (!product) {
        throw ProductError.notFound();
      }

      await this.cache.set(cacheKey, product);

      return product;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  public async getAll(): Promise<Product[]> {
    try {
      const products = await ProductModel.getAll();

      if (!products) {
        throw ProductError.notFound();
      }

      return products;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  public async findByAttributes(): Promise<AttributesResult> {
    try {
      const cacheKey = this.cacheKey.attributes();
      const cached = await this.cache.get<AttributesResult>(cacheKey);

      if (cached) return cached.items[0];

      const attributes = await ProductModel.findByAttributes();

      if (!attributes) {
        throw ProductError.notFound("Product attributes not found!");
      }

      await this.cache.set(cacheKey, attributes);

      return attributes;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get products "quantity available" from the database based on an array of product IDs.
   * @param productsIds - Array of product IDs to retrieve from the database.
   * @returns A Promise that resolves with an array of products matching the provided IDs.
   */
  public async findByAmount(productsIds: Array<number | string>): Promise<Product[]> {
    try {
      const cacheProductKey = productsIds.map(String).join('');
      const cacheKey = `product_amount_${cacheProductKey}`;
      const cached = await this.cache.get<Product>(cacheKey);

      if (cached) return cached.items;

      const products = await ProductModel.findByAmount(productsIds);

      if (!products) {
        throw ProductError.notFound();
      }

      await this.cache.set(cacheKey, products);

      return products;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param filters - Object containing filters for the products.
   * @returns A Promise that resolves with an array of filtered products.
   */
  public async filter(filters: ProductFilter): Promise<Product[]> {
    try {
      /**TODO: Mover a logica de filtro para outro lugar */
      const filterKey = [
        filters?.brand_id?.length && `brand_${filters.brand_id.join('_')}`,
        filters?.gender_id?.length && `gender_${filters.gender_id.join('_')}`,
        filters?.category_id?.length && `category_${filters.category_id.join('_')}`,
        filters?.sizeRange?.min != null && filters?.sizeRange?.max != null &&
          `size_${filters.sizeRange.min}_${filters.sizeRange.max}`
      ].filter(Boolean).join('_');

      const cacheKey = `product_filter_${filterKey}`;
      const cached = await this.cache.get<Product>(cacheKey);

      if (cached) return cached.items;

      const products = await ProductModel.filter(filters);

      await this.cache.set(cacheKey, products);

      return products;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Create a new product in the database.
   * @param values - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async create(values: Product): Promise<Product> {
    try {
      if (values.price <= 0) {
        throw new ProductError('Price cannot be negative.', 400);
      }

      const product = await ProductModel.create(values);

      if (!product) {
        throw ProductError.creationFailed();
      }

      const cacheKey = this.cacheKey.product(product.id);
      await this.cache.set(cacheKey, product);

      return product;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Update an existing product in the database.
   * @param productId - ID of the product to be updated.
   * @param values - Object containing the updated product data.
   * @returns A Promise that resolves with the updated product data.
   */
  public async update(productId: number, values: Partial<Product>): Promise<Product> {
    if (values.price !== undefined && values.price <= 0) {
      throw new ProductError('Price cannot be negative or zero.');
    }

    if (productId === undefined || !productId) {
      throw new ProductError('The Product UUID could not be null', 404);
    }

    try {
      const product = await ProductModel.updateRecord(productId, values);

      if (!product) {
        throw ProductError.updateFailed();
      }

      const cacheKey = this.cacheKey.product(productId);
      await this.cache.remove(cacheKey);

      return product;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Delete a product from the database based on its ID.
   * @param productId - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(productId: number): Promise<boolean> {
    try {
      const deleted = await ProductModel.deleteRecord(productId);

      if (!deleted) {
        throw ProductError.deletionFailed();
      }

      const cacheKey = this.cacheKey.product(productId);
      await this.cache.remove(cacheKey);

      return deleted;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new ProductRepository;
