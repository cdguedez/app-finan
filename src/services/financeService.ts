// Simulation of an API response delay
const DELAY = 1000;

export interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: string;
  icon: string;
  color: string;
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
  transactions: Transaction[];
}

const mockDashboardData: DashboardData = {
  balance: "$12,450.80",
  income: "$4,200.00",
  expenses: "$2,150.40",
  transactions: [
    {
      id: 1,
      name: "Suscripción Netflix",
      category: "Entretenimiento",
      amount: "-$15.99",
      icon: "play-circle",
      color: "#E50914",
    },
    {
      id: 2,
      name: "Depósito Nómina",
      category: "Salario",
      amount: "+$2,100.00",
      icon: "wallet",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Compra Supermercado",
      category: "Alimentación",
      amount: "-$84.50",
      icon: "cart",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Gimnasio Mensual",
      category: "Salud",
      amount: "-$45.00",
      icon: "fitness",
      color: "#3B82F6",
    },
    {
      id: 5,
      name: "Uber",
      category: "Transporte",
      amount: "-$15.00",
      icon: "car",
      color: "#3B82F6",
    },
    {
      id: 6,
      name: "Spotify",
      category: "Entretenimiento",
      amount: "-$10.00",
      icon: "musical-note",
      color: "#EF4444",
    },
    {
      id: 7,
      name: "Uber",
      category: "Transporte",
      amount: "-$15.00",
      icon: "car",
      color: "#3B82F6",
    },
    {
      id: 8,
      name: "Spotify",
      category: "Entretenimiento",
      amount: "-$10.00",
      icon: "musical-note",
      color: "#EF4444",
    },
  ],
};

const mockCategories: Category[] = [
  { id: "1", name: "Alimentación", color: "#F59E0B" },
  { id: "2", name: "Salario", color: "#10B981" },
  { id: "3", name: "Entretenimiento", color: "#EF4444" },
];

export const financeService = {
  getDashboardData: async (): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData);
      }, DELAY);
    });
  },

  getCategories: async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, DELAY);
    });
  },

  addCategory: async (category: Omit<Category, "id">): Promise<Category> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCategory = {
          ...category,
          id: Date.now().toString(),
        };
        resolve(newCategory);
      }, DELAY);
    });
  },
};
