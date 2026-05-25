import { apiRequest } from "./apiClient";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BiometricLoginPayload {
  /** Token biométrico previo guardado en el dispositivo */
  biometricToken: string;
}

export interface PatchBiometricTokenPayload {
  /** JWT del usuario autenticado para asociar el token biométrico */
  biometricToken: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// ── Servicio ───────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /api/v1/auth/register
   * Registra un nuevo usuario y retorna el JWT de acceso.
   */
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
    }),

  /**
   * POST /api/v1/auth/login
   * Login con email/contraseña. Retorna JWT.
   */
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),

  /**
   * POST /api/v1/auth/biometric-login
   * Login usando el token biométrico guardado en el dispositivo.
   * No requiere contraseña — ideal para usar con expo-local-authentication.
   */
  biometricLogin: (payload: BiometricLoginPayload): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/auth/biometric-login", {
      method: "POST",
      body: payload,
    }),

  /**
   * PATCH /api/v1/auth/biometric-token
   * Asocia/actualiza el token biométrico del dispositivo al usuario.
   * Llamar después del primer login exitoso si el usuario activa biometría.
   */
  updateBiometricToken: (
    payload: PatchBiometricTokenPayload,
    accessToken: string,
  ): Promise<void> =>
    apiRequest<void>("/auth/biometric-token", {
      method: "PATCH",
      body: payload,
      token: accessToken,
    }),
};
