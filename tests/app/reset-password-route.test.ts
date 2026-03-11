vi.mock("server-only", () => ({}), { virtual: true });

const tokenUpdateChain = {
  select: vi.fn(() => tokenUpdateChain),
  eq: vi.fn(() => tokenUpdateChain),
  is: vi.fn(() => tokenUpdateChain),
  single: vi.fn(async () => ({
    data: {
      identifier: "user@example.com",
      expires: "2999-01-01T00:00:00.000Z",
    },
    error: null,
  })),
};

const selectUserChain = {
  ilike: vi.fn(() => selectUserChain),
  single: vi.fn(async () => ({
    data: {
      password_changed_at: null,
      metadata: {},
    },
    error: null,
  })),
};

const updateUserChain = {
  ilike: vi.fn(async () => ({ error: null })),
};

vi.mock("@/lib/rate-limit", () => ({
  getClientIp: vi.fn(() => "127.0.0.1"),
  checkRateLimit: vi.fn(async () => ({
    allowed: true,
    remaining: 9,
    reset: Date.now() + 60_000,
  })),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(async () => "hashed-password"),
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === "password_reset_tokens") {
        return {
          update: vi.fn(() => tokenUpdateChain),
        };
      }

      if (table === "users") {
        return {
          select: vi.fn(() => selectUserChain),
          update: vi.fn(() => updateUserChain),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    }),
  },
}));

describe("POST /api/reset-password", () => {
  it("consumes the reset token only once before updating the user", async () => {
    const { POST } = await import("@/app/api/reset-password/route");

    const request = new Request("http://localhost/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "raw-token",
        password: "Valid123!",
        confirmPassword: "Valid123!",
      }),
    });

    const response = await POST(request as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(tokenUpdateChain.is).toHaveBeenCalledWith("used_at", null);
    expect(tokenUpdateChain.single).toHaveBeenCalled();
    expect(updateUserChain.ilike).toHaveBeenCalledWith("email", "user@example.com");
  });
});
