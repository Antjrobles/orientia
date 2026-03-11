import { POST } from "@/app/api/auth/check-email-verified/route";

describe("POST /api/auth/check-email-verified", () => {
  it("returns a neutral response without exposing account existence", async () => {
    const request = new Request("http://localhost/api/auth/check-email-verified", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }),
    });

    const response = await POST(request as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      message:
        "Si existe una cuenta pendiente, enviaremos las instrucciones correspondientes.",
    });
  });
});
