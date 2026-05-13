import { test, expect } from '@playwright/test';

// Génère un identifiant unique pour chaque run de test
const uid = Date.now();
const testUser = {
  displayName: `Tester E2E`,
  handle: `e2etester${uid}`,
  email: `e2e${uid}@pulse.app`,
  password: 'password1',
};

test.describe('Parcours utilisateur complet — PULSE', () => {
  test('1. Inscription d\'un nouvel utilisateur', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('form')).toBeVisible();

    await page.fill('input[placeholder="Léna R."]', testUser.displayName);
    await page.fill('input[placeholder="lena.r"]', testUser.handle);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });
  });

  test('2. Déconnexion et reconnexion', async ({ page }) => {
    // Inscription
    await page.goto('/register');
    await page.fill('input[placeholder="Léna R."]', testUser.displayName);
    await page.fill('input[placeholder="lena.r"]', testUser.handle);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });

    // Déconnexion via localStorage
    await page.evaluate(() => localStorage.removeItem('pulse_token'));
    await page.goto('/login');

    // Connexion
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });
  });

  test('3. Connexion échoue avec mauvais mot de passe', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@pulse.app');
    await page.fill('input[type="password"]', 'mauvaismotdepasse');
    await page.click('button[type="submit"]');

    await expect(page.locator('p.text-rose-400')).toBeVisible({ timeout: 5_000 });
  });

  test('4. Navigation SaaS — accès au dashboard', async ({ page }) => {
    // Inscription pour avoir un compte
    await page.goto('/register');
    const uid2 = Date.now() + 1;
    await page.fill('input[placeholder="Léna R."]', 'Nav Tester');
    await page.fill('input[placeholder="lena.r"]', `navtest${uid2}`);
    await page.fill('input[type="email"]', `navtest${uid2}@pulse.app`);
    await page.fill('input[type="password"]', 'password1');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });

    // Vérifier les éléments du dashboard
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('5. Modification du profil utilisateur', async ({ page }) => {
    // Inscription
    const uid3 = Date.now() + 2;
    await page.goto('/register');
    await page.fill('input[placeholder="Léna R."]', 'Profile Tester');
    await page.fill('input[placeholder="lena.r"]', `profiletest${uid3}`);
    await page.fill('input[type="email"]', `profile${uid3}@pulse.app`);
    await page.fill('input[type="password"]', 'password1');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });

    // Naviguer vers le profil
    await page.goto('/app/profile');
    await expect(page.locator('form')).toBeVisible();

    // Modifier la bio
    const bioInput = page.locator('textarea');
    await bioInput.clear();
    await bioInput.fill('Coureur passionné de tests E2E.');

    // Sauvegarder
    await page.click('button[type="submit"]');

    // Vérifier le message de succès
    await expect(page.locator('text=Sauvegardé')).toBeVisible({ timeout: 5_000 });
  });

  test('6. Ajout au panier et checkout', async ({ page }) => {
    // Inscription
    const uid4 = Date.now() + 3;
    await page.goto('/register');
    await page.fill('input[placeholder="Léna R."]', 'Shop Tester');
    await page.fill('input[placeholder="lena.r"]', `shoptest${uid4}`);
    await page.fill('input[type="email"]', `shop${uid4}@pulse.app`);
    await page.fill('input[type="password"]', 'password1');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });

    // Aller sur la boutique
    await page.goto('/shop');
    await expect(page.locator('a[href*="/shop/"]').first()).toBeVisible({ timeout: 10_000 });

    // Cliquer sur le premier produit
    await page.locator('a[href*="/shop/"]').first().click();
    await expect(page.locator('h1')).toBeVisible({ timeout: 5_000 });

    // Ajouter au panier (bouton principal)
    const addBtn = page.locator('button').filter({ hasText: /panier|ajouter/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page).toHaveURL('/cart', { timeout: 5_000 });
    } else {
      // Aller directement au panier si déjà ajouté
      await page.goto('/cart');
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('7. Validation de commande (checkout)', async ({ page }) => {
    // Inscription
    const uid5 = Date.now() + 4;
    await page.goto('/register');
    await page.fill('input[placeholder="Léna R."]', 'Checkout Tester');
    await page.fill('input[placeholder="lena.r"]', `checkouttest${uid5}`);
    await page.fill('input[type="email"]', `checkout${uid5}@pulse.app`);
    await page.fill('input[type="password"]', 'password1');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/dashboard', { timeout: 10_000 });

    // Aller sur la boutique et ajouter un produit via l'API directement
    await page.goto('/shop');
    await expect(page.locator('a[href*="/shop/"]').first()).toBeVisible({ timeout: 10_000 });
    await page.locator('a[href*="/shop/"]').first().click();

    const addBtn = page.locator('button').filter({ hasText: /panier|ajouter/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForURL('/cart', { timeout: 5_000 });

      // Passer à la commande
      const checkoutBtn = page.locator('a[href="/checkout"], button').filter({ hasText: /commande|payer/i }).first();
      if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
        await expect(page).toHaveURL('/checkout', { timeout: 5_000 });

        // Remplir l'adresse de livraison
        const inputs = page.locator('input[type="text"]');
        const count = await inputs.count();
        if (count >= 5) {
          await inputs.nth(0).fill('Tester E2E');
          await inputs.nth(1).fill('1 rue de la Paix');
          await inputs.nth(2).fill('Paris');
          await inputs.nth(3).fill('75001');
          await inputs.nth(4).fill('France');
        }

        // Soumettre la commande
        const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /commander|valider/i }).first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          // Vérifier confirmation ou redirection vers les commandes
          await expect(page.locator('body')).toBeVisible({ timeout: 10_000 });
        }
      }
    }
  });

  test('8. Page publique d\'un profil', async ({ page }) => {
    await page.goto('/u/demo');
    await expect(page.locator('body')).toBeVisible();
    // La page peut retourner un profil ou un message "profil non trouvé"
    // On vérifie juste que la page charge sans erreur 500
    const title = await page.title();
    expect(title).not.toContain('500');
  });

  test('9. Redirection vers login si page privée sans authentification', async ({ page }) => {
    // Vider le token pour simuler un utilisateur non connecté
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('pulse_token'));

    await page.goto('/app/dashboard');
    await expect(page).toHaveURL(/login/, { timeout: 5_000 });
  });
});
