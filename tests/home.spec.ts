import { test, expect } from "@playwright/test";

// Splash screen takes ~7s (bike animation @ 60fps + 1.5s min timer).
// We wait for it to slide away before testing content sections.
const SPLASH_TIMEOUT = 15_000;

test.describe("Cyclo — Home Page", () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Wait until the splash screen has fully exited the viewport */
  async function waitForSplash(page: import("@playwright/test").Page) {
    // The splash is a fixed overlay with z-[200]. It slides up (y: "-100%") then
    // is removed from the DOM via AnimatePresence.
    await page.waitForFunction(
      () => document.querySelector('[class*="fixed"][class*="inset-0"]') === null ||
            (document.querySelector('[class*="fixed"][class*="inset-0"]') as HTMLElement)
              ?.style.transform?.includes("translateY(-"),
      { timeout: SPLASH_TIMEOUT }
    );
    // Extra buffer for framer-motion exit transition (1.05s)
    await page.waitForTimeout(1_200);
  }

  /** Scroll the page to a fraction of its total height */
  async function scrollToFraction(page: import("@playwright/test").Page, fraction: number) {
    await page.evaluate((f) => {
      const total = document.body.scrollHeight - window.innerHeight;
      window.scrollTo({ top: total * f, behavior: "instant" });
    }, fraction);
    await page.waitForTimeout(400);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Page loads correctly
  // ─────────────────────────────────────────────────────────────────────────────
  test("page has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Cyclo");
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Splash Screen
  // ─────────────────────────────────────────────────────────────────────────────
  test.describe("Splash Screen", () => {
    test("shows 'Cyclo' wordmark on dark background", async ({ page }) => {
      await page.goto("/");
      // The splash renders immediately — check it's visible before it exits
      const splash = page.locator("text=Cyclo").first();
      await expect(splash).toBeVisible({ timeout: 3_000 });
    });

    test("shows 'Performance Cycling' tagline", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("text=Performance Cycling")).toBeVisible({ timeout: 3_000 });
    });

    test("dismisses automatically after bike animation completes", async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
      // After dismissal the hero headline should be visible
      await expect(page.locator("text=Engineered").first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Hero Section
  // ─────────────────────────────────────────────────────────────────────────────
  test.describe("Hero Section", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
    });

    test("displays main headline", async ({ page }) => {
      await expect(page.locator("h1", { hasText: "Engineered" })).toBeVisible();
      await expect(page.locator("h1", { hasText: "for the Road." })).toBeVisible();
    });

    test("displays eyebrow label", async ({ page }) => {
      // The eyebrow uses &nbsp; and &#8901; (middle dot U+22C5) — match via regex
      await expect(
        page.locator("p").filter({ hasText: /Cyclo.*S.*1.*2026/ }).first()
      ).toBeVisible();
    });

    test("displays subtext about frame specs", async ({ page }) => {
      await expect(
        page.locator("text=High-modulus carbon frame")
      ).toBeVisible();
    });

    test("displays Pre-order CTA button", async ({ page }) => {
      const cta = page.locator("button", { hasText: "Pre-order" });
      await expect(cta).toBeVisible();
    });

    test("displays scroll indicator", async ({ page }) => {
      await expect(page.locator("text=Scroll to explore")).toBeVisible();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ParallaxVariants Section ("All Variants. One Vision.")
  // ─────────────────────────────────────────────────────────────────────────────
  test.describe("Parallax Variants Section", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
      // The section lives after 800vh of scroll canvas — jump past it
      await scrollToFraction(page, 0.88);
    });

    test("displays headline 'All Variants.'", async ({ page }) => {
      const heading = page.locator("h2", { hasText: "All Variants." });
      await expect(heading).toBeVisible({ timeout: 5_000 });
    });

    test("displays headline 'One Vision.'", async ({ page }) => {
      const heading = page.locator("h2", { hasText: "One Vision." });
      await expect(heading).toBeVisible({ timeout: 5_000 });
    });

    test("displays all five colour variant pills", async ({ page }) => {
      const variants = ["Carbon Black", "Timber Oak", "Ocean Blue", "Forest Green", "Dune White"];
      for (const v of variants) {
        await expect(page.locator(`text=${v}`)).toBeVisible({ timeout: 5_000 });
      }
    });

    test("displays body copy about finishes", async ({ page }) => {
      await expect(
        page.locator("text=Five exclusive finishes")
      ).toBeVisible({ timeout: 5_000 });
    });

    test("displays 'Reserve Yours' CTA button", async ({ page }) => {
      const btn = page.locator("button", { hasText: "Reserve Yours" });
      await expect(btn).toBeVisible({ timeout: 5_000 });
    });

    test("hero image renders (no broken img)", async ({ page }) => {
      // Scroll the section into view and check the image loads
      const img = page.locator("img[alt*='Cyclo']");
      await expect(img).toBeVisible({ timeout: 5_000 });
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth
      );
      expect(naturalWidth).toBeGreaterThan(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Coming Soon Section
  // ─────────────────────────────────────────────────────────────────────────────
  test.describe("Coming Soon Section", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
      // Scroll to near the bottom where ComingSoon lives
      await scrollToFraction(page, 0.93);
    });

    test("displays 'Be First In Line.' headline", async ({ page }) => {
      await expect(
        page.locator("h2", { hasText: "Be First" })
      ).toBeVisible({ timeout: 5_000 });
    });

    test("displays live countdown with HRS / MIN / SEC labels", async ({ page }) => {
      for (const label of ["HRS", "MIN", "SEC"]) {
        await expect(page.locator(`text=${label}`).first()).toBeVisible({ timeout: 5_000 });
      }
    });

    test("displays email input field", async ({ page }) => {
      const input = page.locator('input[type="email"]');
      await expect(input).toBeVisible({ timeout: 5_000 });
    });

    test("displays 'Get Notified' submit button", async ({ page }) => {
      const btn = page.locator("button", { hasText: "Get Notified" });
      await expect(btn).toBeVisible({ timeout: 5_000 });
    });

    test("email form: valid submission shows confirmation", async ({ page }) => {
      const input = page.locator('input[type="email"]');
      await expect(input).toBeVisible({ timeout: 5_000 });
      await input.fill("test@example.com");
      await page.locator("button", { hasText: "Get Notified" }).click();
      await expect(
        page.locator("text=You're on the list")
      ).toBeVisible({ timeout: 3_000 });
    });

    test("email form: empty submission does not submit (required validation)", async ({ page }) => {
      const input = page.locator('input[type="email"]');
      await expect(input).toBeVisible({ timeout: 5_000 });
      // Do not fill the input — click submit
      await page.locator("button", { hasText: "Get Notified" }).click();
      // Form should NOT show confirmation
      await expect(page.locator("text=You're on the list")).not.toBeVisible();
      // Input should still be visible (form not replaced)
      await expect(input).toBeVisible();
    });

    test("feature pills are visible", async ({ page }) => {
      for (const label of ["Early access", "No spam, ever", "Free to join"]) {
        await expect(page.locator(`text=${label}`)).toBeVisible({ timeout: 5_000 });
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Footer
  // ─────────────────────────────────────────────────────────────────────────────
  test.describe("Cinematic Footer", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" })
      );
      await page.waitForTimeout(600);
    });

    test("displays 'Ready to Ride?' heading", async ({ page }) => {
      await expect(
        page.locator("h2", { hasText: "Ready to Ride?" })
      ).toBeVisible({ timeout: 5_000 });
    });

    test("displays scrolling marquee text", async ({ page }) => {
      await expect(
        page.locator("text=Carbon Frame Technology").first()
      ).toBeVisible({ timeout: 5_000 });
    });

    test("displays Pre-order CTA in footer", async ({ page }) => {
      const preorder = page.locator("a", { hasText: "Pre-order" });
      await expect(preorder.first()).toBeVisible({ timeout: 5_000 });
    });

    test("displays 'View Full Specs' link", async ({ page }) => {
      await expect(
        page.locator("a", { hasText: "View Full Specs" })
      ).toBeVisible({ timeout: 5_000 });
    });

    test("displays secondary nav links", async ({ page }) => {
      for (const label of ["Find a Dealer", "Privacy Policy", "Terms of Use", "Support"]) {
        await expect(page.locator(`text=${label}`).first()).toBeVisible({ timeout: 5_000 });
      }
    });

    test("displays copyright notice", async ({ page }) => {
      await expect(
        page.locator("text=2026 Cyclo Performance Engineering")
      ).toBeVisible({ timeout: 5_000 });
    });

    test("scroll-to-top button is visible and clickable", async ({ page }) => {
      // The arrow-up button has no text — find by role within the footer
      const upBtn = page.locator("footer button").last();
      await expect(upBtn).toBeVisible({ timeout: 5_000 });
      const scrollBefore = await page.evaluate(() => window.scrollY);
      await upBtn.click();
      // Wait for Lenis smooth scroll to animate (up to 3s)
      await page.waitForFunction(
        (before) => window.scrollY < before - 100,
        scrollBefore,
        { timeout: 3_000 }
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. Accessibility basics
  // ─────────────────────────────────────────────────────────────────────────────
  test.describe("Accessibility", () => {
    test("page lang attribute is set to 'en'", async ({ page }) => {
      await page.goto("/");
      const lang = await page.locator("html").getAttribute("lang");
      expect(lang).toBe("en");
    });

    test("hero image has a meaningful alt text", async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
      await scrollToFraction(page, 0.88);
      const img = page.locator("img[alt*='Cyclo']");
      const alt = await img.getAttribute("alt");
      expect(alt?.length).toBeGreaterThan(10);
    });

    test("no broken images on page", async ({ page }) => {
      await page.goto("/");
      await waitForSplash(page);
      const images = page.locator("img");
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const w = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(w, `Image ${i} has zero naturalWidth — may be broken`).toBeGreaterThan(0);
      }
    });
  });

});
