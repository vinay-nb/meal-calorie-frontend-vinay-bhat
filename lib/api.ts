import { useAuthStore } from "@/stores/authStore";

export async function request(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestInit,
) {
  let url = "";
  if (path.startsWith("http")) {
    url = path;
  } else if (path.startsWith("/api/auth/")) {
    // Auth requests go to our local handlers which manage cookies
    url = path;
  } else {
    // Other requests go to our proxy which adds the auth header from cookies
    // Ensure we don't have double slashes
    const cleanPath = path.replace(/^\//, "");
    url = `/api/proxy/${cleanPath}`;
  }

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });

  if (res.status === 403) {
    if (typeof window !== "undefined") {
      // For logout, we call our own logout route to clear the cookie
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
  }

  return res;
}

export const post = (path: string, body?: unknown, init?: RequestInit) =>
  request("POST", path, body, init);

export const get = (path: string, init?: RequestInit) =>
  request("GET", path, undefined, init);
