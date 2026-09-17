import { apiRequest } from "./apiClient";
import * as SecureStore from "expo-secure-store";

export interface BankData {
  code: string;
  name: string;
}

interface BankCacheEntry {
  data: BankData[];
  cachedAt: number;
}

// 7 días en milisegundos: 7 * 24 * 60 * 60 * 1000
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Caché en memoria durante la sesión activa
const memoryCache: Record<string, BankCacheEntry> = {};

function getCacheStorageKey(isNational: boolean, isActive: boolean): string {
  return `cached_banks_${isNational ? "nat" : "intl"}_${isActive ? "active" : "inactive"}`;
}

export const bankService = {
  getBanks: async (filters: {
    isNational: boolean;
    isActive: boolean;
  }): Promise<BankData[]> => {
    const { isNational, isActive } = filters;
    const cacheKey = getCacheStorageKey(isNational, isActive);
    const now = Date.now();

    // 1. Verificar primero la caché en memoria (acceso ultrarrápido)
    if (memoryCache[cacheKey]) {
      const entry = memoryCache[cacheKey];
      if (now - entry.cachedAt < SEVEN_DAYS_MS) {
        return entry.data;
      }
    }

    // 2. Verificar la caché persistente en SecureStore
    try {
      const persisted = await SecureStore.getItemAsync(cacheKey);
      if (persisted) {
        const entry: BankCacheEntry = JSON.parse(persisted);
        if (now - entry.cachedAt < SEVEN_DAYS_MS && Array.isArray(entry.data)) {
          memoryCache[cacheKey] = entry; // Hidratar caché en memoria
          return entry.data;
        }
      }
    } catch {
      // Si falla la lectura local, se continúa a la petición de red
    }

    // 3. Si expiró o no existe caché, consultar al API
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const params = new URLSearchParams({
        isNational: String(isNational),
        isActive: String(isActive),
      });

      const banks = await apiRequest<BankData[]>(
        `/banks?${params.toString()}`,
        { token: token || undefined },
      );

      // Guardar en memoria y en almacenamiento persistente
      const newEntry: BankCacheEntry = {
        data: banks,
        cachedAt: now,
      };

      memoryCache[cacheKey] = newEntry;

      try {
        await SecureStore.setItemAsync(cacheKey, JSON.stringify(newEntry));
      } catch {
        // En caso de que falle el guardado en disco, la memoria sigue funcionando
      }

      return banks;
    } catch (error) {
      // 4. Modo resiliente (offline-fallback): si falla la red y teníamos caché previa, devolverla
      if (memoryCache[cacheKey]?.data) {
        return memoryCache[cacheKey].data;
      }

      try {
        const persisted = await SecureStore.getItemAsync(cacheKey);
        if (persisted) {
          const entry: BankCacheEntry = JSON.parse(persisted);
          if (Array.isArray(entry.data) && entry.data.length > 0) {
            return entry.data;
          }
        }
      } catch {
        // Ignorar
      }

      console.error("Error fetching banks:", error);
      throw error;
    }
  },

  /**
   * Limpia la caché local de bancos (tanto en memoria como persistente)
   */
  clearCache: async (): Promise<void> => {
    const keys = [
      getCacheStorageKey(true, true),
      getCacheStorageKey(true, false),
      getCacheStorageKey(false, true),
      getCacheStorageKey(false, false),
    ];

    for (const key of keys) {
      delete memoryCache[key];
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Ignorar
      }
    }
  },
};
