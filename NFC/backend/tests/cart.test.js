process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/Product');
const { connect, close, clear } = require('./setup');

beforeAll(connect);
afterAll(close);
beforeEach(clear);

async function createUser() {
  const res = await request(app).post('/api/auth/register').send({
    email: 'shop@pulse.app',
    password: 'password1',
    handle: 'shopper',
    displayName: 'Shopper',
  });
  return res.body.token;
}

async function createProduct() {
  return Product.create({
    name: 'PULSE Core',
    slug: 'pulse-core',
    description: 'demo',
    basePriceCents: 4900,
    variants: [{ name: 'Cyan', sku: 'CORE-CYAN', priceCents: 4900, stock: 100 }],
  });
}

describe('Cart & checkout', () => {
  test('add to cart and checkout creates an order', async () => {
    const token = await createUser();
    const product = await createProduct();
    const variantId = product.variants[0]._id.toString();

    const add = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id.toString(), variantId, quantity: 2 });
    expect(add.status).toBe(201);
    expect(add.body.cart.items.length).toBe(1);
    expect(add.body.cart.items[0].quantity).toBe(2);

    const checkout = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: {
          fullName: 'Shopper',
          street: '1 rue Pulse',
          city: 'Paris',
          zip: '75001',
          country: 'France',
        },
      });
    expect(checkout.status).toBe(201);
    expect(checkout.body.order.subtotalCents).toBe(2 * 4900);
    expect(checkout.body.order.totalCents).toBe(2 * 4900 + checkout.body.order.shippingCents);
    expect(checkout.body.order.reference).toMatch(/^PULSE-/);

    const cart = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(cart.body.cart.items.length).toBe(0);
  });

  test('checkout fails when cart empty', async () => {
    const token = await createUser();
    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: {
          fullName: 'X',
          street: 'X',
          city: 'X',
          zip: '1',
          country: 'X',
        },
      });
    expect(res.status).toBe(400);
  });
});
