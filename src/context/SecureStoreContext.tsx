import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export interface UserProfile {
  firstName: string;
  lastName: string;
}

interface SecureStoreContextType {
  accessToken: string | null;
  biometricToken: string | null;
  userId: string | null;
  userProfile: UserProfile | null;
  isRestoring: boolean;
  saveSession: (
    token: string,
    userId: string,
    profile: UserProfile,
  ) => Promise<void>;
  saveBiometricToken: (token: string) => Promise<void>;
  deleteBiometricToken: () => Promise<void>;
  logout: () => Promise<void>;
}

const SecureStoreContext = createContext<SecureStoreContextType | undefined>(
  undefined,
);

const SecureStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [biometricToken, setBiometricTokenState] = useState<string | null>(
    null,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        const profileStr = await SecureStore.getItemAsync("userProfile");
        const bioToken = await SecureStore.getItemAsync("biometricToken");
        const storedUserId = await SecureStore.getItemAsync("userId");

        if (token) {
          setAccessToken(token);
        }
        if (profileStr) {
          try {
            setUserProfile(JSON.parse(profileStr));
          } catch (e) {
            console.error("Error al parsear el perfil del usuario:", e);
          }
        }
        if (bioToken) {
          setBiometricTokenState(bioToken);
        }
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error al restaurar la sesión desde SecureStore:", error);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  const saveSession = async (
    token: string,
    userId: string,
    profile: UserProfile,
  ) => {
    try {
      await SecureStore.setItemAsync("accessToken", token);
      await SecureStore.setItemAsync("userId", userId);
      await SecureStore.setItemAsync("userProfile", JSON.stringify(profile));
      setAccessToken(token);
      setUserId(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error al guardar la sesión:", error);
      throw error;
    }
  };

  const saveBiometricToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync("biometricToken", token);
      setBiometricTokenState(token);
    } catch (error) {
      console.error("Error al guardar el token biométrico:", error);
      throw error;
    }
  };

  const deleteBiometricToken = async () => {
    try {
      await SecureStore.deleteItemAsync("biometricToken");
      setBiometricTokenState(null);
    } catch (error) {
      console.error("Error al eliminar el token biométrico:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("userProfile");
      setAccessToken(null);
      setUserId(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  return (
    <SecureStoreContext.Provider
      value={{
        accessToken,
        biometricToken,
        userId,
        userProfile,
        isRestoring,
        saveSession,
        saveBiometricToken,
        deleteBiometricToken,
        logout,
      }}
    >
      {children}
    </SecureStoreContext.Provider>
  );
};

const useSecureStore = (): SecureStoreContextType => {
  const context = useContext(SecureStoreContext);
  if (context === undefined) {
    throw new Error(
      "useSecureStore debe usarse dentro de un SecureStoreProvider",
    );
  }
  return context;
};

export { SecureStoreProvider, useSecureStore };
