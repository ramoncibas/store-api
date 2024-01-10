import supertest from 'supertest';

describe('AuthController', () => {
  let
    authToken: string, 
    baseUrl: string = 'http://localhost:5000';
  
  test('should login a user', async () => {
    const response = await supertest(baseUrl)
      .post('/auth/login')
      .send({
        email: 'store@admin.com',
        password: 'store#123',
      })
      .set('Accept', 'application/json')

      expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    authToken = response.body.token;
  });

  test('should register a user', async () => {
    const response = await supertest(baseUrl)
      .post('/auth/register')
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
    const response = await supertest(baseUrl)
      .post('/auth/logout')
      .set('x-access-token', authToken);
    
    expect(response.status).toBe(200);
  });
});
