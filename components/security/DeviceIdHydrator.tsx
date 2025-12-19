"use client";

import { useEffect } from "react";
import {
  DEVICE_COOKIE_MAX_AGE,
  DEVICE_COOKIE_NAME,
  DEVICE_STORAGE_KEY,
} from "@/lib/device";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.substring(name.length + 1) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; Path=/; Max-Age=${DEVICE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function getOrCreateId() {
  if (typeof window === "undefined") return null;
  const fromStorage = window.localStorage.getItem(DEVICE_STORAGE_KEY);
  if (fromStorage) return fromStorage;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(DEVICE_STORAGE_KEY, id);
  return id;
}

export default function DeviceIdHydrator() {
  useEffect(() => {
    const existing = getCookie(DEVICE_COOKIE_NAME);
    if (existing) return;
    const id = getOrCreateId();
    if (!id) return;
    setCookie(DEVICE_COOKIE_NAME, id);
  }, []);

  return null;
}
