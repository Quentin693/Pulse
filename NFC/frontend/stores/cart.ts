import { defineStore } from 'pinia';

interface CartItem {
  _id: string;
  product: string;
  variantId: string;
  quantity: number;
  snapshot: { name: string; variantName: string; priceCents: number; image: string };
}

interface Cart {
  _id?: string;
  items: CartItem[];
  totalCents?: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: { items: [], totalCents: 0 } as Cart,
    loading: false,
  }),
  getters: {
    count: (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0),
    subtotalCents: (state) =>
      state.cart.items.reduce(
        (s, i) => s + i.quantity * (i.snapshot?.priceCents || 0),
        0
      ),
  },
  actions: {
    async fetch() {
      this.loading = true;
      try {
        const api = useApi();
        const res = await api.get<{ cart: Cart }>('/cart');
        this.cart = res.cart;
      } finally {
        this.loading = false;
      }
    },
    async addItem(productId: string, variantId: string, quantity = 1) {
      const api = useApi();
      const res = await api.post<{ cart: Cart }>('/cart/items', {
        productId,
        variantId,
        quantity,
      });
      this.cart = res.cart;
    },
    async updateItem(itemId: string, quantity: number) {
      const api = useApi();
      const res = await api.patch<{ cart: Cart }>(`/cart/items/${itemId}`, { quantity });
      this.cart = res.cart;
    },
    async removeItem(itemId: string) {
      const api = useApi();
      const res = await api.del<{ cart: Cart }>(`/cart/items/${itemId}`);
      this.cart = res.cart;
    },
    async clear() {
      const api = useApi();
      const res = await api.del<{ cart: Cart }>('/cart');
      this.cart = res.cart;
    },
  },
});
