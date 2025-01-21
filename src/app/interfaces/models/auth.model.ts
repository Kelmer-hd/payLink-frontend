export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    businessName: string;
    role: string;
    settings: {
        whatsappNumber: string;
        autoReplyMessage: string;
        customTheme: string;
        paymentMethods: string[];
    };
}

export interface AuthResponse {
    token: string;
    userId: string;
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