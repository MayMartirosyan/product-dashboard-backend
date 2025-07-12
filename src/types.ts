export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  birthDate?: string;
  picture?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  picture?: string;
  description?: string;
  userId: string;
}
