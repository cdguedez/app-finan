import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import { authService } from "../../services/authService";

const useLogin = ({ setUser }: { setUser: any }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< Updated upstream
=======
  const { biometricToken, userId, saveSession, saveBiometricToken } =
    useSecureStore();
>>>>>>> Stashed changes

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        return Alert.alert(
          "Biometría no encontrada",
          "Por favor, asegúrate de tener configurada la biometría en tu dispositivo.",
        );
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Inicia sesión con biometría",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        setIsLoading(true);
        try {
<<<<<<< Updated upstream
          const biometricToken =
            await SecureStore.getItemAsync("biometricToken");
          console.log({ biometricToken });
          if (!biometricToken) {
=======
          if (!biometricToken || !userId) {
>>>>>>> Stashed changes
            return Alert.alert(
              "Registro biométrico pendiente",
              "Por favor, inicia sesión con tu correo y contraseña primero para activar el acceso rápido.",
            );
          }

<<<<<<< Updated upstream
          const response = await authService.biometricLogin({ biometricToken });
          await SecureStore.setItemAsync("accessToken", response.accessToken);
          setUser(response);
=======
          const response = await authService.biometricLogin({
            biometricToken,
            userId,
          });
          await saveSession(
            response.accessToken,
            response.userId,
            response.user,
          );
>>>>>>> Stashed changes
        } catch (err: any) {
          Alert.alert(
            "Error de biometría",
            err?.message ?? "No se pudo iniciar sesión",
          );
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error durante la autenticación");
    }
  };

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert(
        "Campos requeridos",
        "Por favor, ingresa tu correo y contraseña.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const { accessToken, user } = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });

<<<<<<< Updated upstream
      await SecureStore.setItemAsync("accessToken", accessToken);
=======
      await saveSession(response.accessToken, response.userId, response.user);
>>>>>>> Stashed changes

      if (isBiometricSupported) {
        const deviceBiometricToken =
          Math.random().toString(36).substring(2) + Date.now().toString(36);
        try {
          await authService.updateBiometricToken(
            { biometricToken: deviceBiometricToken },
            accessToken,
          );
          await SecureStore.setItemAsync(
            "biometricToken",
            deviceBiometricToken,
          );
        } catch (bioErr) {
          console.warn(
            "No se pudo enlazar la biometría en el servidor:",
            bioErr,
          );
        }
      }

      setUser({ user, accessToken });
    } catch (err: any) {
      Alert.alert(
        "Error al iniciar sesión",
        err?.message ?? "Verifica tus credenciales e intenta de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleBiometricAuth,
    handleLogin,
    setCredentials,
    isLoading,
    isBiometricSupported,
    credentials,
  };
};

export { useLogin };
