export interface User {
    email: string;
    fullName: string;
    role: string;
    subscriptionPlan: string;
    settings: {
      whatsappNumber: string;
      autoReplyMessage: string;
      customTheme: string;
      paymentMethods: string[];
    };
  }