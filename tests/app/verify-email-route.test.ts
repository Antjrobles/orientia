const updateChain = {
  select: vi.fn(() => updateChain),
  eq: vi.fn(() => updateChain),
  is: vi.fn(() => updateChain),
  single: vi.fn(async () => ({
    data: {
      identifier: "user@example.com",
      expires: "2999-01-01T00:00:00.000Z",
    },
    error: null,
  })),
};

const updateUserChain = {
  eq: vi.fn(async () => ({ error: null })),
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "verification_tokens") {
        return {
          update: vi.fn(() => updateChain),
        };
      }

      if (table === "users") {
        return {
          update: vi.fn(() => updateUserChain),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    }),
  })),
}));

describe("POST /api/verify-email", () => {
  it("consumes the token only if it has not been used", async () => {
    const { POST } = await import("@/app/api/verify-email/route");

    const request = new Request("http://localhost/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "raw-token" }),
    });

    const response = await POST(request as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(updateChain.is).toHaveBeenCalledWith("used_at", null);
    expect(updateChain.single).toHaveBeenCalled();
  });
});
