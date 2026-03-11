import {
  createTrustedDeviceCookieValue,
  parseTrustedDeviceCookieValue,
} from "@/lib/device";

describe("trusted device cookie", () => {
  const originalSecret = process.env.NEXTAUTH_SECRET;

  beforeEach(() => {
    process.env.NEXTAUTH_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.NEXTAUTH_SECRET = originalSecret;
  });

  it("accepts a valid signed cookie for the expected user", () => {
    const value = createTrustedDeviceCookieValue({
      userId: "user-1",
      deviceId: "device-1",
    });

    const parsed = parseTrustedDeviceCookieValue(value, "user-1");

    expect(parsed).toMatchObject({
      v: 1,
      u: "user-1",
      d: "device-1",
    });
  });

  it("rejects the cookie if the expected user does not match", () => {
    const value = createTrustedDeviceCookieValue({
      userId: "user-1",
      deviceId: "device-1",
    });

    const parsed = parseTrustedDeviceCookieValue(value, "user-2");

    expect(parsed).toBeNull();
  });

  it("rejects tampered cookies", () => {
    const value = createTrustedDeviceCookieValue({
      userId: "user-1",
      deviceId: "device-1",
    });
    const [payload] = value.split(".");
    const tampered = `${payload}.invalid-signature`;

    const parsed = parseTrustedDeviceCookieValue(tampered, "user-1");

    expect(parsed).toBeNull();
  });
});
