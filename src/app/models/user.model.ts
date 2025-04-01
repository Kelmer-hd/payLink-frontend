export type PlanType = 'FREE' | 'BASIC' | 'PRO';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  createdAt: Date;
  updatedAt: Date;
} 