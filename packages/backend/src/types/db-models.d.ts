export interface IMeasure {
  value: number | string;
  type: string;
  minimumOrder?: {
    type: string;
    value: number | string;
  };
}

export interface IProduct {
  _id: string; // Em respostas de API, o _id é geralmente uma string.
  name: string;
  category: string;
  measure: IMeasure;
  available: boolean;
  createdAt?: string; // Adicionado para dados de timestamp
  updatedAt?: string; // Adicionado para dados de timestamp
}

// --- Tipos de Cycle.ts ---
export interface ICycle {
  _id: string;
  description: string;
  openingDate: string; // Datas são serializadas como strings em JSON
  closingDate: string;
  products: string[] | IProduct[]; // Pode ser um array de IDs (strings) ou objetos IProduct populados
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Tipos de User.ts ---
export interface IUser {
  _id: string;
  email: string;
  username: string;
  // O campo 'password' é omitido intencionalmente por segurança.
  // Ele nunca deve ser enviado para o cliente.
  icon: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}