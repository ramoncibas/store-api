import express from 'express';
import request from 'supertest';
import AuthController from 'controllers/Auth/AuthController';

describe('AuthController', () => {
  let authToken: string;

  beforeEach(() => {
    AuthController.initialize();
  });

  test('should login a user', async () => {
    const app = express();
    app.use(express.json());
    app.post('/login', AuthController.loginUser);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'store@admin.com',
        password: 'store#123',
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    authToken = response.body.token;
  });

  test('should register a user', async () => {
    const app = express();
    app.use(express.json());
    app.post('/register', AuthController.registerUser);

    const response = await request(app)
      .post('/register')
      .send({
        first_name: 'Store',
        last_name: 'Admin',
        email: 'store@admin.com',
        password: 'store#123',
      });

    expect(response.status).toBeDefined();
    expect(
      response.status === 201 ||
      response.status === 409
    ).toBe(true);

    if (response.status === 201) {
      expect(response.body).toHaveProperty('token');
    }
  });

  test('should logout a user', async () => {
    const app = express();
    app.use(express.json());
    app.post('/logout', AuthController.logoutUser);

    const response = await request(app)
      .post('/logout')
      .set('x-access-token', authToken);
    
    expect(response.status).toBe(200);
  });
});
