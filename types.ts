export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
}

export interface OutfitSuggestion {
  advice: string;
  visualPrompt: string;
  weatherSummary: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOCATING = 'LOCATING',
  ANALYZING = 'ANALYZING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}