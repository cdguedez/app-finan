import { apiRequest } from "./apiClient";
import * as SecureStore from "expo-secure-store";
import { accountService } from "./accountService";

export interface Transaction {
  id: string;
  accountId: string;
  categoryId?: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description?: string;
  date: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface DashboardData {
  balance: string;
  income: string;
  expenses: string;
  transactions: any[];
}

export const financeService = {
  getCategories: async (): Promise<Category[]> => {
    const token = await SecureStore.getItemAsync("accessToken");
    return apiRequest<Category[]>("/categories", { token: token || undefined });
  },

  addCategory: async (category: Omit<Category, "id">): Promise<Category> => {
    const token = await SecureStore.getItemAsync("accessToken");
    return apiRequest<Category>("/categories", {
      method: "POST",
      body: category,
      token: token || undefined,
    });
  },

  deleteCategory: async (id: string): Promise<void> => {
    const token = await SecureStore.getItemAsync("accessToken");
    return apiRequest<void>(`/categories/${id}`, {
      method: "DELETE",
      token: token || undefined,
    });
  },

  getTransactions: async (accountId?: string): Promise<Transaction[]> => {
    const token = await SecureStore.getItemAsync("accessToken");
    const path = accountId
      ? `/transactions?accountId=${accountId}`
      : "/transactions";
    return apiRequest<Transaction[]>(path, { token: token || undefined });
  },

  addTransaction: async (
    transaction: Omit<Transaction, "id" | "category">,
  ): Promise<Transaction> => {
    const token = await SecureStore.getItemAsync("accessToken");
    // Ensure amount is passed as number string if API expects Decimal, but JS number is fine since we use Decimal on backend which handles numbers.
    return apiRequest<Transaction>("/transactions", {
      method: "POST",
      body: transaction,
      token: token || undefined,
    });
  },

  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const [accounts, transactions] = await Promise.all([
        accountService.getAccounts(),
        financeService.getTransactions(),
      ]);

      const totalBalance = accounts.reduce(
        (acc, curr) => acc + Number(curr.balance),
        0,
      );

      const thisMonth = new Date();
      let income = 0;
      let expenses = 0;

      transactions.forEach((t) => {
        const tDate = new Date(t.date);
        if (
          tDate.getMonth() === thisMonth.getMonth() &&
          tDate.getFullYear() === thisMonth.getFullYear()
        ) {
          if (t.type === "INCOME") income += Number(t.amount);
          else expenses += Number(t.amount);
        }
      });

      const formattedTransactions = transactions.slice(0, 10).map((t) => ({
        id: t.id,
        name: t.description || (t.type === "INCOME" ? "Ingreso" : "Gasto"),
        category: t.category?.name || "Sin Categoría",
        amount:
          t.type === "INCOME"
            ? `+$${Number(t.amount).toFixed(2)}`
            : `-$${Number(t.amount).toFixed(2)}`,
        icon: t.type === "INCOME" ? "trending-up" : "cart", // fallback
        color:
          t.category?.color || (t.type === "INCOME" ? "#10B981" : "#EF4444"),
      }));

      return {
        balance: `$${totalBalance.toFixed(2)}`,
        income: `$${income.toFixed(2)}`,
        expenses: `$${expenses.toFixed(2)}`,
        transactions: formattedTransactions,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
