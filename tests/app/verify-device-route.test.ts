vi.mock("server-only", () => ({}), { virtual: true });

const updateChain = {
  select: vi.fn(() => updateChain),
  eq: vi.fn(() => updateChain),
  is: vi.fn(() => updateChain),
  single: vi.fn(async () => ({
    data: {
      user_id: "user-1",
      device_id: "device-1",
      expires: "2999-01-01T00:00:00.000Z",
    },
    error: null,
  })),
};

const upsertSpy = vi.fn(async () => ({ error: null }));

describe("POST /api/verify-device", () => {
  const originalSecret = process.env.NEXTAUTH_SECRET;

  beforeEach(() => {
    process.env.NEXTAUTH_SECRET = "test-secret";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NEXTAUTH_SECRET = originalSecret;
  });

  it("consumes the device token and sets both device cookies", async () => {
    vi.doMock("@/lib/supabase", () => ({
      supabase: {
        from: vi.fn((table: string) => {
          if (table === "device_verification_tokens") {
            return {
              update: vi.fn(() => updateChain),
            };
          }

          if (table === "trusted_devices") {
            return {
              upsert: upsertSpy,
            };
          }

          throw new Error(`Unexpected table ${table}`);
        }),
      },
    }));

    const { POST } = await import("@/app/api/verify-device/route");

    const request = new Request("http://localhost/api/verify-device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "raw-token" }),
    });

    const response = await POST(request as any);
    const body = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(updateChain.is).toHaveBeenCalledWith("used_at", null);
    expect(upsertSpy).toHaveBeenCalled();
    expect(setCookie).toContain("orientia_device_id=device-1");
    expect(setCookie).toContain("orientia_trusted_device=");
  });
});
