const BASE = "http://localhost:7000/api";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

async function doFetch(
  path,
  { method = "GET", body, headers = {}, retry = true } = {}
) {
  const init = {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${BASE}${path}`, init);

  if (res.status === 401 && retry) {
    console.log("try refresh");
    const refreshed = await fetch(`${BASE}/auth/refresh`, {
      credentials: "include",
    });
    if (refreshed.ok) {
      const data = await refreshed.json();
      if (data?.accessToken) setAccessToken(data.accessToken);
      // retry original request once
      return doFetch(path, { method, body, headers, retry: false });
    }
  }

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.message || `Request failed (${res.status})`);
  }
  return safeJson(res);
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  get: (p) => doFetch(p, { method: "GET" }),
  post: (p, b) => doFetch(p, { method: "POST", body: b }),
  put: (p, b) => doFetch(p, { method: "PUT", body: b }),
  del: (p) => doFetch(p, { method: "DELETE" }),
};
