vi.mock("server-only", () => ({}), { virtual: true });

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => ({
            data: null,
            error: { message: "table missing" },
          })),
        })),
      })),
    })),
  },
}));

describe("checkRateLimit", () => {
  it("falls back to memory store if Supabase storage is unavailable", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");

    const first = await checkRateLimit("test:key", 2, 60_000);
    const second = await checkRateLimit("test:key", 2, 60_000);
    const third = await checkRateLimit("test:key", 2, 60_000);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
  });
});
