
export interface Disease {
  disease_name: string;
  confidence: string;
  symptoms: string[];
  root_cause: string; // New: Predict the cause
  severity: 'nhẹ' | 'trung bình' | 'nặng' | 'light' | 'medium' | 'severe';
  treatment: string[];
  prevention: string[]; // New: How to prevent
}

export interface EnvironmentalInfo {
  min_temp: number;
  max_temp: number;
  min_humidity: number;
  max_humidity: number;
  seasonal_advice: string;
}

export interface CareProfile {
  water: string;
  light: string;
  soil: string;
  temperature: string;
  fertilizer: string;
  pruning: string;
  environmental_info: EnvironmentalInfo; // New: Numeric data for charts
}

export interface LifeCycleStage {
  stage_name: string;
  duration: string;
  description: string;
}

export interface MarketInfo {
  estimated_price: string;
  currency: string;
  buying_tips: string;
  suggested_places: string[];
}

export interface CommonUses {
  medical: string[];
  cooking: string[];
  decoration: string[];
  other: string[];
}

export interface PlantInformation {
  description: string;
  common_uses: CommonUses;
  care_profile: CareProfile; // Structured care info
  life_cycle: LifeCycleStage[]; // Life cycle stages
  market_info: MarketInfo; // Price and buying suggestions
}

export interface Plant {
  name: string;
  confidence: string;
  scientific_name: string;
  other_possible_species: string[];
  is_poisonous: boolean;
  poison_details: string;
  detected_diseases: Disease[];
  plant_information: PlantInformation;
}

export interface PlantAnalysisResponse {
  language: string;
  plant_count: number;
  plants: Plant[];
  warnings: string[];
}

export interface Recipe {
  title: string;
  description: string;
  prep_time: string;
  cook_time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Dễ' | 'Trung bình' | 'Khó';
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
}

export interface DecorationGuide {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Dễ' | 'Trung bình' | 'Khó';
  tools_materials: string[];
  steps: string[];
  tips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type LanguageCode = 'vi' | 'en' | 'fr' | 'ja' | 'zh';

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];
