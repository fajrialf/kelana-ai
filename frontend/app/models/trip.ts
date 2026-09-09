export interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  travel_style?: string;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
  share_token?: string | null;
  created_at: string;
}