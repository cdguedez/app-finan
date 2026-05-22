// ─────────────────────────────────────────────
// Configura la URL en el archivo .env del proyecto:
//   EXPO_PUBLIC_API_BASE_URL=http://<tu-ip>:3001/api/v1
//
// Ejemplos por entorno:
//  - Emulador Android : http://10.0.2.2:3001/api/v1
//  - Dispositivo físico: http://192.168.X.X:3001/api/v1
//  - iOS Simulator    : http://localhost:3001/api/v1
// ─────────────────────────────────────────────
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: object;
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
