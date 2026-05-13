import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '~/pages/register.vue';

const { mockRegisterFn, mockNavigateTo } = vi.hoisted(() => ({
  mockRegisterFn: vi.fn(),
  mockNavigateTo: vi.fn(),
}));

mockNuxtImport('useAuthStore', () => {
  return () => ({
    register: mockRegisterFn,
    restore: vi.fn().mockResolvedValue(undefined),
    isLogged: false,
    user: null,
    token: '',
    ready: true,
  });
});

mockNuxtImport('navigateTo', () => mockNavigateTo);

describe('Page Register', () => {
  beforeEach(() => {
    mockRegisterFn.mockReset();
    mockNavigateTo.mockReset();
  });

  it('affiche le formulaire d\'inscription', async () => {
    const wrapper = await mountSuspended(RegisterPage);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('affiche un lien vers la page de connexion', async () => {
    const wrapper = await mountSuspended(RegisterPage);
    expect(wrapper.html()).toContain('/login');
  });

  it('navigue vers le dashboard après inscription réussie', async () => {
    mockRegisterFn.mockResolvedValueOnce(undefined);
    const wrapper = await mountSuspended(RegisterPage);

    await wrapper.find('input[placeholder="Léna R."]').setValue('Alice Test');
    await wrapper.find('input[placeholder="lena.r"]').setValue('alicetest');
    await wrapper.find('input[type="email"]').setValue('alice@pulse.app');
    await wrapper.find('input[type="password"]').setValue('password1');
    await wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 50));
    expect(mockRegisterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alice@pulse.app',
        password: 'password1',
        displayName: 'Alice Test',
      })
    );
    expect(mockNavigateTo).toHaveBeenCalledWith('/app/dashboard');
  });

  it('affiche un message d\'erreur si l\'email est déjà pris', async () => {
    mockRegisterFn.mockRejectedValueOnce({
      data: { error: { message: 'Email already in use' } },
    });
    const wrapper = await mountSuspended(RegisterPage);

    await wrapper.find('input[placeholder="Léna R."]').setValue('Alice');
    await wrapper.find('input[placeholder="lena.r"]').setValue('alice');
    await wrapper.find('input[type="email"]').setValue('existing@pulse.app');
    await wrapper.find('input[type="password"]').setValue('password1');
    await wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toContain('Email already in use');
  });

  it('affiche un message d\'erreur par défaut', async () => {
    mockRegisterFn.mockRejectedValueOnce(new Error('Network error'));
    const wrapper = await mountSuspended(RegisterPage);

    await wrapper.find('input[placeholder="Léna R."]').setValue('Alice');
    await wrapper.find('input[placeholder="lena.r"]').setValue('alice');
    await wrapper.find('input[type="email"]').setValue('alice@pulse.app');
    await wrapper.find('input[type="password"]').setValue('password1');
    await wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toContain('Inscription impossible');
  });
});
