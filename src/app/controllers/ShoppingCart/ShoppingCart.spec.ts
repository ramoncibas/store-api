import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import ShoppingCartController from './ShoppingCartController';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import StockService from 'services/Stock/StockService';
import { DeveloperUser } from '__mocks__';

jest.mock('repositories/ShoppingCartRepository');
jest.mock('repositories/ProductRepository');
jest.mock('services/Stock/StockService');

const app = express();
app.use(express.json());

// Fake user middleware for req.user
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.user = DeveloperUser
  next();
});

app.get('/cart', ShoppingCartController.get);
app.post('/cart', ShoppingCartController.add);
app.put('/cart/:id', ShoppingCartController.updateQuantity);
app.delete('/cart/:id', ShoppingCartController.remove);
app.post('/cart/clear', ShoppingCartController.clear);

describe('ShoppingCartController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return shopping cart items', async () => {
    const mockCartItems = [{ product_id: 101, quantity: 2 }];
    const mockProducts = [{ id: 101, name: 'Product A', price: 10 }];

    (ShoppingCartRepository as any).mockImplementation(() => ({
      findByCustomerId: jest.fn().mockResolvedValue(mockCartItems),
    }));

    // Esse metodo foi removido, pois mudei a logica do carrinho para buscar com inner join
    (ProductRepository.findByIds as jest.Mock).mockResolvedValue(mockProducts);

    const res = await request(app).get('/cart');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      { ...mockProducts[0], quantity: 2 }
    ]);
  });

  it('should add product to cart', async () => {
    const mockBody = { product_id: 101, quantity: 3 };
    const mockSavedItem = { id: 1, product_id: 101, quantity: 3 };

    (ShoppingCartRepository as any).mockImplementation(() => ({
      findByCustomerId: jest.fn().mockResolvedValue([]),
      save: jest.fn().mockResolvedValue(mockSavedItem),
    }));

    (StockService.validateAvailability as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post('/cart')
      .send(mockBody);

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(mockSavedItem);
  });

  it('should update cart item quantity', async () => {
    const cartId = 1;
    const mockBody = { product_id: 101, quantity: 5 };
    const mockCartItem = { product_id: 101, quantity: 2 };
    const mockUpdatedItem = { id: cartId, quantity: 5 };

    (ShoppingCartRepository as any).mockImplementation(() => ({
      findByCartId: jest.fn().mockResolvedValue(mockCartItem),
      update: jest.fn().mockResolvedValue(mockUpdatedItem),
    }));

    (StockService.validateAvailability as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .put(`/cart/${cartId}`)
      .send(mockBody);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockUpdatedItem);
  });

  it('should remove item from cart', async () => {
    const cartId = 1;
    const mockCartItem = { product_id: 101, quantity: 2 };

    (ShoppingCartRepository as any).mockImplementation(() => ({
      findByCartId: jest.fn().mockResolvedValue(mockCartItem),
      delete: jest.fn().mockResolvedValue(true),
    }));

    const res = await request(app).delete(`/cart/${cartId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should clear the cart', async () => {
    (ShoppingCartRepository as any).mockImplementation(() => ({
      clear: jest.fn().mockResolvedValue(true),
    }));

    const res = await request(app)
      .post('/cart/clear')
      .send({ options: {} });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });
});
