export type Language = 'en' | 'hi' | 'kn';

export type QualityGrade = 'gradeA' | 'gradeB' | 'gradeC';

export interface FarmerProfile {
  name: string;
  phone: string;
  place: string;
  locality: string;
  language: Language;
  createdAt: string;
}

export interface PricePoint {
  dayLabel: string;
  price: number;
  isForecast?: boolean;
}

export interface MandiRate {
  mandiId: string;
  name: Record<Language, string>;
  district: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalsTonnes: number;
}

export interface MandiProfitEvaluation extends MandiRate {
  estimatedDistanceKm: number;
  transportCostPerQtl: number;
  marketFeePerQtl: number;
  netProfitPerQtl: number;
  isMostProfitable: boolean;
}

export interface QualitySizeAnalysis {
  grade: QualityGrade;
  label: Record<Language, string>;
  sizeSpec: Record<Language, string>;
  multiplier: number;
  currentBestPrice: number;
  previousDayPrice: number;
  priceDiff: number;
  changePercent: number;
  trendDirection: 'up' | 'down';
  predicted5DayPrice: number;
  forecastPercent: number;
  forecastDirection: 'increment' | 'decrement';
  recommendation: 'SELL' | 'HOLD';
  history14d: PricePoint[];
  forecast5d: PricePoint[];
}

export interface CropAnalysis {
  id: string;
  name: Record<Language, string>;
  variety: Record<Language, string>;
  unit: string;
  perishability: 'high' | 'medium' | 'low';
  currentBestPrice: number;
  previousDayPrice: number;
  priceDiff: number;
  changePercent: number;
  trendDirection: 'up' | 'down';
  predicted5DayPrice: number;
  forecastPercent: number;
  forecastDirection: 'increment' | 'decrement';
  recommendation: 'SELL' | 'HOLD';
  confidencePercent: number;
  history14d: PricePoint[];
  forecast5d: PricePoint[];
  mandiRates: MandiRate[];
  bestMandiName: Record<Language, string>;
  qualityTiers: Record<QualityGrade, QualitySizeAnalysis>;
}

export interface ChatAnalysisCard {
  cropId: string;
  cropName: string;
  currentBestPrice: number;
  changePercent: number;
  trendDirection: 'up' | 'down';
  predicted5DayPrice: number;
  forecastPercent: number;
  forecastDirection: 'increment' | 'decrement';
  recommendation: 'SELL' | 'HOLD';
  bestMandiName: string;
  bestMandiNetProfit: number;
  bestMandiDistanceKm: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  detectedLanguage?: Language;
  audioBase64?: string;
  isVoice?: boolean;
  analysisCard?: ChatAnalysisCard;
  error?: boolean;
}

export type LossSituation = 'price_crash' | 'crop_damage' | 'debt_relief' | 'livelihood';

export interface GovernmentScheme {
  id: string;
  code: string;
  category: LossSituation;
  name: Record<Language, string>;
  summary: Record<Language, string>;
  benefit: Record<Language, string>;
  eligibility: Record<Language, string>;
  documents: Record<Language, string>;
  applySteps: Record<Language, string[]>;
  officialUrl: string;
  helplineOrPortal: string;
}

export interface PriceAlertRule {
  id: string;
  cropId: string;
  grade: QualityGrade;
  targetPrice: number;
  minIncreasePercent: number;
  enabled: boolean;
  createdAt: string;
}

export interface PriceNotification {
  id: string;
  cropId: string;
  grade: QualityGrade;
  newPrice: number;
  previousPrice: number;
  diffRs: number;
  changePercent: number;
  bestMandiName: Record<Language, string>;
  reason: 'daily_gain' | 'target_reached' | 'live_surge';
  timestamp: string;
  read: boolean;
}
