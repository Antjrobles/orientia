/**
 * Valida un token de Cloudflare Turnstile con la API de Cloudflare
 *
 * @param token - El token que el cliente recibió después de completar el desafío
 * @returns true si el token es válido, false si no lo es
 */
export async function validateTurnstileToken(
  token: string
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();

    // Cloudflare devuelve { success: true } si el token es válido
    return data.success === true;
  } catch (error) {
    void error;
    return false;
  }
}
