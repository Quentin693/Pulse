import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import ProductCard from '~/components/ProductCard.vue';

const mockProduct = {
  name: 'PULSE Core',
  slug: 'pulse-core',
  tagline: 'Le bracelet de référence',
  basePriceCents: 4900,
  currency: 'EUR',
  featured: true,
  variants: [
    { sku: 'CORE-CYAN', name: 'Cyan', priceCents: 4900 },
    { sku: 'CORE-VIOLET', name: 'Violet', priceCents: 4900 },
  ],
};

describe('ProductCard', () => {
  it('affiche le nom du produit', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    });
    expect(wrapper.text()).toContain('PULSE Core');
  });

  it('affiche le tagline du produit', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    });
    expect(wrapper.text()).toContain('Le bracelet de référence');
  });

  it('affiche le prix formaté', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    });
    expect(wrapper.text()).toContain('49');
    expect(wrapper.text()).toContain('€');
  });

  it('affiche les variantes', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    });
    expect(wrapper.text()).toContain('Cyan');
    expect(wrapper.text()).toContain('Violet');
  });

  it('affiche le badge Featured si featured=true', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    });
    expect(wrapper.text()).toContain('Featured');
  });

  it('n\'affiche pas le badge Featured si featured=false', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: { ...mockProduct, featured: false } },
    });
    expect(wrapper.text()).not.toContain('Featured');
  });

  it('est un lien vers la page produit', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    });
    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toContain('pulse-core');
  });

  it('affiche un produit sans variantes', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: { ...mockProduct, variants: [] } },
    });
    expect(wrapper.text()).toContain('PULSE Core');
  });
});
