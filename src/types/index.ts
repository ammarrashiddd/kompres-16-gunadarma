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
  routeCandidates: RouteSnapshot[];
}

export type PreparationPriority = "URGENT" | "HIGH" | "MEDIUM";

export interface PreparationStep {
  priority: PreparationPriority;
  title: string;
  action: string;
  reason: string;
}

export interface ShelterCandidate {
  id: number;
  name: string;
  cityName: string;
  address: string | null;
  latitude: number;
  longitude: number;
  source: string;
  verificationStatus: string;
}

export interface RouteSnapshot {
  id: number;
  shelter: ShelterCandidate;
  provider: string;
  originLatitude: number;
  originLongitude: number;
  distanceMeters: number | null;
  durationSeconds: number | null;
  geometry: unknown;
  steps: unknown;
  status: "COMPLETED" | "FAILED";
}

export interface RecommendedShelter {
  shelterId: number | null;
  reason: string;
}

export interface GeminiStructuredAdvice {
  summary: string;
  riskInterpretation: string;
  keyFactors: string[];
  preparationSteps: PreparationStep[];
  recommendedShelter: RecommendedShelter;
  routeExplanation: string;
  disclaimer: string;
}

export interface GeminiAdviceResponse {
  success: true;
  adviceId: number;
  aiAdvice: GeminiStructuredAdvice;
}
