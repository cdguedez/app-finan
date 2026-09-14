import { apiRequest } from "./apiClient";

export interface Subscription {
  id: string;
  accountId: string;
  categoryId?: string;
  name: string;
  amount: number;
  frequency: "WEEKLY" | "MONTHLY" | "YEARLY";
  nextPaymentDate: string;
  isActive: boolean;
}

export const getSubscriptions = async (
  token: string,
): Promise<Subscription[]> => {
  return apiRequest<Subscription[]>("/subscriptions", { token });
};

export const createSubscription = async (
  token: string,
  subscriptionData: Omit<Subscription, "id">,
): Promise<Subscription> => {
  return apiRequest<Subscription>("/subscriptions", {
    method: "POST",
    token,
    body: subscriptionData,
  });
};

export const updateSubscription = async (
  token: string,
  id: string,
  subscriptionData: Partial<Subscription>,
): Promise<Subscription> => {
  return apiRequest<Subscription>(`/subscriptions/${id}`, {
    method: "PATCH",
    token,
    body: subscriptionData,
  });
};

export const deleteSubscription = async (
  token: string,
  id: string,
): Promise<void> => {
  return apiRequest<void>(`/subscriptions/${id}`, {
    method: "DELETE",
    token,
  });
};
