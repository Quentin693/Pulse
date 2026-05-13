import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '~/pages/login.vue';

const { mockLoginFn, mockNavigateTo } = vi.hoisted(() => ({
  mockLoginFn: vi.fn(),
  mockNavigateTo: vi.fn(),
}));

mockNuxtImport('useAuthStore', () => {
  return () => ({
    login: mockLoginFn,
    restore: vi.fn().mockResolvedValue(undefined),
    isLogged: false,
    user: null,
    token: '',
    ready: true,
  });
});

mockNuxtImport('navigateTo', () => mockNavigateTo);

describe('Page Login', () => {
  beforeEach(() => {
    mockLoginFn.mockReset();
    mockNavigateTo.mockReset();
  });

  it('affiche le formulaire de connexion', async () => {
    const wrapper = await mountSuspended(LoginPage);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('affiche un bouton de connexion', async () => {
    const wrapper = await mountSuspended(LoginPage);
    const btn = wrapper.find('button.btn-primary');
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain('connecter');
  });

  it('affiche un lien vers la page d\'inscription', async () => {
    const wrapper = await mountSuspended(LoginPage);
    expect(wrapper.html()).toContain('/register');
  });

  it('navigue vers le dashboard après un login réussi', async () => {
    mockLoginFn.mockResolvedValueOnce(undefined);
    const wrapper = await mountSuspended(LoginPage);

    await wrapper.find('input[type="email"]').setValue('alice@pulse.app');
    await wrapper.find('input[type="password"]').setValue('password1');
    await wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 50));
    expect(mockLoginFn).toHaveBeenCalledWith('alice@pulse.app', 'password1');
    expect(mockNavigateTo).toHaveBeenCalled();
  });

  it('affiche un message d\'erreur si les identifiants sont invalides', async () => {
    mockLoginFn.mockRejectedValueOnce({
      data: { error: { message: 'Identifiants invalides' } },
    });
    const wrapper = await mountSuspended(LoginPage);

    await wrapper.find('input[type="email"]').setValue('bad@bad.com');
    await wrapper.find('input[type="password"]').setValue('wrongpass');
    await wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toContain('Identifiants invalides');
  });

  it('affiche le message d\'erreur par défaut si pas de message API', async () => {
    mockLoginFn.mockRejectedValueOnce(new Error('Network error'));
    const wrapper = await mountSuspended(LoginPage);

    await wrapper.find('input[type="email"]').setValue('bad@bad.com');
    await wrapper.find('input[type="password"]').setValue('wrongpass');
    await wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toContain('Identifiants invalides');
  });

  it('désactive le bouton pendant le chargement', async () => {
    let resolveLogin: () => void;
    mockLoginFn.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveLogin = resolve;
      })
    );
    const wrapper = await mountSuspended(LoginPage);

    await wrapper.find('input[type="email"]').setValue('alice@pulse.app');
    await wrapper.find('input[type="password"]').setValue('password1');
    wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 10));
    const btn = wrapper.find('button.btn-primary');
    expect(btn.attributes('disabled')).toBeDefined();
    expect(btn.text()).toContain('Connexion…');

    resolveLogin!();
    await new Promise((r) => setTimeout(r, 50));
    expect(btn.attributes('disabled')).toBeUndefined();
  });
});
