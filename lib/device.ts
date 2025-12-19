export const DEVICE_COOKIE_NAME = "orientia_device_id";
export const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
export const DEVICE_STORAGE_KEY = "orientia_device_id";

export function getCookieFromHeader(header: string | null, name: string) {
  if (!header) return null;
  const parts = header.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return part.substring(name.length + 1);
    }
  }
  return null;
}
