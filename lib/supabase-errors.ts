export function isSupabasePausedError(error: unknown) {
  if (!error) return false;
  const text =
    typeof error === "string"
      ? error
      : JSON.stringify(error, Object.getOwnPropertyNames(error));
  return (
    text.includes("ENOTFOUND") ||
    text.includes("getaddrinfo") ||
    text.includes("fetch failed")
  );
}
