// auth.model.ts
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    dni: string;
    businessName: string;
    role: 'SELLER';
    subscriptionPlan: 'FREE';
    settings: {
      whatsappNumber: string;
      autoReplyMessage: string;
      customTheme: 'LIGHT';
      paymentMethods: string[];
    }
  }
  
  export interface AuthResponse {
    token: string;
    userId: string;
    email: string;
    role: string;
    subscriptionPlan: string;
  }