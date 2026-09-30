export interface GempaData {
  Tanggal: string;
  Jam: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan?: string;
  Coordinates: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
}

export interface RiskAnalysisFeatures {
  freqPerYear: number;
  m5Count: number;
  maxMagnitude: number;
  avgDepthKm: number;
  nearestM5DistanceKm: number;
}

export interface RiskAnalysisResult {
  vulnerabilityScore: number;
  category: string;
  features: RiskAnalysisFeatures;
}

export interface RiskAnalysisResponse {
  success: true;
  analysisId: number;
  location?: string;
  mlResult: RiskAnalysisResult;
}

export interface KotaProfile {
  cityName: string | null;
  cityLatitude: number | null;
  cityLongitude: number | null;
}

export interface SavedRiskAnalysisResponse {
  success: true;
  analysisId: number;
  location?: string;
  mlResult: RiskAnalysisResult;
  aiAdvice: GeminiStructuredAdvice | null;
}

export interface GeminiStructuredAdvice {
  summary: string;
  riskInterpretation: string;
  keyFactors: string[];
  disclaimer: string;
}

export interface GeminiAdviceResponse {
  success: true;
  adviceId: number;
  aiAdvice: GeminiStructuredAdvice;
}
