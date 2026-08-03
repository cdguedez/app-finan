interface BiometricLoginPayload {
  /** ID del usuario (almacenado en SecureStore) */
  userId: string;
  /** Token biométrico previo guardado en el dispositivo */
  biometricToken: string;
}

interface PatchBiometricTokenPayload {
  /** JWT del usuario autenticado para asociar el token biométrico */
  biometricToken: string;
}

export { BiometricLoginPayload, PatchBiometricTokenPayload };
