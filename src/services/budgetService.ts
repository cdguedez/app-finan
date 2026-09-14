import { apiRequest } from "./apiClient";

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  startDate: string;
  endDate: string;
}

export const getBudgets = async (token: string): Promise<Budget[]> => {
  return apiRequest<Budget[]>("/budgets", { token });
};

export const createBudget = async (
  token: string,
  budgetData: Omit<Budget, "id">,
): Promise<Budget> => {
  return apiRequest<Budget>("/budgets", {
    method: "POST",
    token,
    body: budgetData,
  });
};

export const updateBudget = async (
  token: string,
  id: string,
  budgetData: Partial<Budget>,
): Promise<Budget> => {
  return apiRequest<Budget>(`/budgets/${id}`, {
    method: "PATCH",
    token,
    body: budgetData,
  });
};

export const deleteBudget = async (
  token: string,
  id: string,
): Promise<void> => {
  return apiRequest<void>(`/budgets/${id}`, {
    method: "DELETE",
    token,
  });
};
