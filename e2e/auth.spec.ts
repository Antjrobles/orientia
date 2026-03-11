import { expect, test } from "@playwright/test";

test.describe("Auth flows", () => {
  test("register shows success state after a valid submission", async ({ page }) => {
    await page.route("**/api/register", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            "Si el correo es válido, recibirás un email para completar el acceso a tu cuenta.",
        }),
      });
    });

    await page.goto("/register");

    await page.getByLabel("Nombre completo").fill("Usuario E2E");
    await page.getByLabel("Correo electrónico").fill("user@example.com");
    await page.locator("#password").fill("Valid123!");
    await page.locator("#confirmPassword").fill("Valid123!");
    await page.getByRole("button", { name: /crear mi cuenta gratis/i }).click();

    await expect(page.getByText("¡Registro Exitoso!")).toBeVisible();
    await expect(
      page.getByText(
        "Si el correo es válido, recibirás un email para completar el acceso a tu cuenta.",
      ),
    ).toBeVisible();
  });

  test("forgot-password shows the neutral confirmation message", async ({ page }) => {
    await page.route("**/api/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message:
            "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.",
        }),
      });
    });

    await page.goto("/forgot-password");
    await page.getByLabel("Correo electrónico").fill("user@example.com");
    await page.getByRole("button", { name: /enviar enlace/i }).click();

    await expect(page.getByText("Solicitud enviada")).toBeVisible();
    await expect(
      page.getByText(
        "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.",
      ),
    ).toBeVisible();
  });

  test("verify-email renders success state for a valid token", async ({ page }) => {
    await page.route("**/api/verify-email", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Email verificado correctamente",
        }),
      });
    });

    await page.goto("/verify-email?token=test-token");

    await expect(page.getByText("¡Email verificado!")).toBeVisible();
    await expect(page.getByText("Ya puedes iniciar sesión con tu cuenta")).toBeVisible();
  });

  test("verify-device renders success state for a valid token", async ({ page }) => {
    await page.route("**/api/verify-device", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Dispositivo verificado correctamente",
        }),
      });
    });

    await page.goto("/verify-device?token=test-token");

    await expect(page.getByText("Verificacion completada")).toBeVisible();
    await expect(page.getByText("Dispositivo verificado correctamente")).toBeVisible();
  });

  test("login renders the security verification error returned by backend", async ({
    page,
  }) => {
    await page.goto(
      "/login?error=CredentialsSignin&error_description=SecurityVerificationFailed",
    );

    await expect(
      page.getByText("La verificación de seguridad ha fallado. Inténtalo de nuevo."),
    ).toBeVisible();
  });
});
