vi.mock("server-only", () => ({}), { virtual: true });

function getAuthorizeFromProviders(
  providers: unknown,
): ((credentials: Record<string, unknown>, req: unknown) => Promise<unknown>) {
  const credentialsProvider = (providers as Array<Record<string, unknown>>).find(
    (item) => item.id === "credentials",
  );

  const authorize =
    credentialsProvider?.authorize ??
    (credentialsProvider?.options as Record<string, unknown> | undefined)?.authorize;

  if (typeof authorize !== "function") {
    throw new Error("Credentials authorize handler not found");
  }

  return authorize as (
    credentials: Record<string, unknown>,
    req: unknown,
  ) => Promise<unknown>;
}

async function expectAuthorizeError(
  authorize: (credentials: Record<string, unknown>, req: unknown) => Promise<unknown>,
  credentials: Record<string, unknown>,
  req: unknown,
  expectedMessage: string,
) {
  try {
    await Promise.resolve(authorize(credentials, req));
    throw new Error("Expected authorize to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain(expectedMessage);
  }
}

describe("authOptions credentials provider", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXTAUTH_SECRET: "test-secret",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      NODE_ENV: "production",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it("rejects login when Turnstile validation fails", async () => {
    vi.doMock("next-auth/providers/credentials", () => ({
      default: (config: Record<string, unknown>) => ({ id: "credentials", ...config }),
    }));
    vi.doMock("next-auth/providers/google", () => ({
      default: (config: Record<string, unknown>) => ({ id: "google", ...config }),
    }));
    vi.doMock("next-auth/providers/facebook", () => ({
      default: (config: Record<string, unknown>) => ({ id: "facebook", ...config }),
    }));
    vi.doMock("next-auth/providers/apple", () => ({
      default: (config: Record<string, unknown>) => ({ id: "apple", ...config }),
    }));
    vi.doMock("@/lib/turnstile", () => ({
      validateTurnstileToken: vi.fn(async () => false),
    }));
    vi.doMock("@/lib/brute-force", () => ({
      isLoginBlocked: vi.fn(async () => ({ blocked: false, blockedUntil: null })),
      registerLoginFailure: vi.fn(async () => undefined),
      clearLoginFailures: vi.fn(async () => undefined),
    }));
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: vi.fn(() => "127.0.0.1"),
      checkRateLimit: vi.fn(async () => ({
        allowed: true,
        remaining: 2,
        reset: Date.now() + 60_000,
      })),
    }));
    vi.doMock("@supabase/supabase-js", () => ({
      createClient: vi.fn(() => ({
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            ilike: vi.fn(() => ({
              single: vi.fn(async () => ({ data: null, error: null })),
            })),
          })),
        })),
      })),
    }));

    const { authOptions } = await import("@/lib/auth");
    const authorize = getAuthorizeFromProviders(authOptions.providers);

    await expectAuthorizeError(
      authorize,
      {
        email: "user@example.com",
        password: "Valid123!",
        turnstileToken: "invalid-token",
      },
      { headers: new Headers() },
      "SecurityVerificationFailed",
    );
  });

  it("rejects login when brute force blocking is active", async () => {
    vi.doMock("next-auth/providers/credentials", () => ({
      default: (config: Record<string, unknown>) => ({ id: "credentials", ...config }),
    }));
    vi.doMock("next-auth/providers/google", () => ({
      default: (config: Record<string, unknown>) => ({ id: "google", ...config }),
    }));
    vi.doMock("next-auth/providers/facebook", () => ({
      default: (config: Record<string, unknown>) => ({ id: "facebook", ...config }),
    }));
    vi.doMock("next-auth/providers/apple", () => ({
      default: (config: Record<string, unknown>) => ({ id: "apple", ...config }),
    }));
    vi.doMock("@/lib/turnstile", () => ({
      validateTurnstileToken: vi.fn(async () => true),
    }));
    vi.doMock("@/lib/brute-force", () => ({
      isLoginBlocked: vi.fn(async () => ({ blocked: true, blockedUntil: Date.now() + 60_000 })),
      registerLoginFailure: vi.fn(async () => undefined),
      clearLoginFailures: vi.fn(async () => undefined),
    }));
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: vi.fn(() => "127.0.0.1"),
      checkRateLimit: vi.fn(async () => ({
        allowed: true,
        remaining: 2,
        reset: Date.now() + 60_000,
      })),
    }));
    vi.doMock("@supabase/supabase-js", () => ({
      createClient: vi.fn(() => ({
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            ilike: vi.fn(() => ({
              single: vi.fn(async () => ({ data: null, error: null })),
            })),
          })),
        })),
      })),
    }));

    const { authOptions } = await import("@/lib/auth");
    const authorize = getAuthorizeFromProviders(authOptions.providers);

    await expectAuthorizeError(
      authorize,
      {
        email: "user@example.com",
        password: "Valid123!",
        turnstileToken: "valid-token",
      },
      { headers: new Headers() },
      "TooManyLoginAttempts",
    );
  });

  it("requires device verification after a valid password login on an untrusted device", async () => {
    vi.doMock("next-auth/providers/credentials", () => ({
      default: (config: Record<string, unknown>) => ({ id: "credentials", ...config }),
    }));
    vi.doMock("next-auth/providers/google", () => ({
      default: (config: Record<string, unknown>) => ({ id: "google", ...config }),
    }));
    vi.doMock("next-auth/providers/facebook", () => ({
      default: (config: Record<string, unknown>) => ({ id: "facebook", ...config }),
    }));
    vi.doMock("next-auth/providers/apple", () => ({
      default: (config: Record<string, unknown>) => ({ id: "apple", ...config }),
    }));
    vi.doMock("@/lib/turnstile", () => ({
      validateTurnstileToken: vi.fn(async () => true),
    }));
    vi.doMock("@/lib/brute-force", () => ({
      isLoginBlocked: vi.fn(async () => ({ blocked: false, blockedUntil: null })),
      registerLoginFailure: vi.fn(async () => undefined),
      clearLoginFailures: vi.fn(async () => undefined),
    }));
    vi.doMock("@/lib/rate-limit", () => ({
      getClientIp: vi.fn(() => "127.0.0.1"),
      checkRateLimit: vi.fn(async () => ({
        allowed: true,
        remaining: 2,
        reset: Date.now() + 60_000,
      })),
    }));
    vi.doMock("bcryptjs", () => ({
      default: {
        compare: vi.fn(async () => true),
      },
    }));

    const insertSpy = vi.fn(async () => ({ error: null }));

    vi.doMock("@supabase/supabase-js", () => ({
      createClient: vi.fn(() => ({
        from: vi.fn((table: string) => {
          if (table === "users") {
            return {
              select: vi.fn(() => ({
                ilike: vi.fn(() => ({
                  single: vi.fn(async () => ({
                    data: {
                      id: "user-1",
                      email: "user@example.com",
                      name: "User",
                      hashed_password: "stored-hash",
                      emailVerified: "2026-01-01T00:00:00.000Z",
                      password_changed_at: new Date().toISOString(),
                    },
                    error: null,
                  })),
                })),
              })),
            };
          }

          if (table === "trusted_devices") {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    single: vi.fn(async () => ({
                      data: null,
                      error: { code: "PGRST116" },
                    })),
                  })),
                })),
              })),
            };
          }

          if (table === "device_verification_tokens") {
            return {
              insert: insertSpy,
            };
          }

          throw new Error(`Unexpected table ${table}`);
        }),
      })),
    }));

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const { authOptions } = await import("@/lib/auth");
    const authorize = getAuthorizeFromProviders(authOptions.providers);

    await expectAuthorizeError(
      authorize,
      {
        email: "user@example.com",
        password: "Valid123!",
        turnstileToken: "valid-token",
        deviceId: "device-1",
      },
      {
        headers: new Headers({
          host: "localhost:3000",
          "x-forwarded-proto": "http",
          cookie: "orientia_device_id=device-1",
        }),
      },
      "DeviceVerificationRequired",
    );

    expect(insertSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
