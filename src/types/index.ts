export interface UserPreferences {
  spendingCategories: string[];
  incomeRange: string;
  creditScore: string;
  preferredBenefits: string[];
}

export interface Card {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  joiningFee: number;
  benefits: string[];
  eligibility: string[];
  features: string[];
  imageUrl: string;
  applyLink: string;
  isActive: boolean;
  matchScore?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  preferences?: UserPreferences;
  savedCards: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CardRecommendation {
  card: Card;
  matchScore: number;
  reasons: string[];
} 