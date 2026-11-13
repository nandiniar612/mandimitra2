import type {
  CropAnalysis,
  Language,
  MandiProfitEvaluation,
  MandiRate,
  PricePoint,
  QualityGrade,
  QualitySizeAnalysis,
} from '../types.ts';

interface RawCropSeed {
  id: string;
  name: Record<Language, string>;
  variety: Record<Language, string>;
  perishability: 'high' | 'medium' | 'low';
  series14d: number[];
  mandis: MandiRate[];
}

const RAW_CROPS: RawCropSeed[] = [
  {
    id: 'onion',
    name: { en: 'Onion', hi: 'प्याज', kn: 'ಈರುಳ್ಳಿ' },
    variety: { en: 'Red Nasik / Bellary', hi: 'लाल नासिक / बेल्लारी', kn: 'ಕೆಂಪು ನಾಸಿಕ್ / ಬಳ್ಳಾರಿ' },
    perishability: 'medium',
    series14d: [2150, 2180, 2210, 2190, 2260, 2310, 2340, 2390, 2420, 2480, 2530, 2590, 2650, 2820],
    mandis: [
      {
        mandiId: 'hubballi',
        name: { en: 'Hubballi APMC', hi: 'हुबली APMC', kn: 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ' },
        district: 'Dharwad',
        state: 'Karnataka',
        modalPrice: 2820,
        minPrice: 2400,
        maxPrice: 3050,
        arrivalsTonnes: 410,
      },
      {
        mandiId: 'davanagere',
        name: { en: 'Davanagere APMC', hi: 'दावणगेरे APMC', kn: 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ' },
        district: 'Davanagere',
        state: 'Karnataka',
        modalPrice: 2740,
        minPrice: 2350,
        maxPrice: 2920,
        arrivalsTonnes: 295,
      },
      {
        mandiId: 'yeshwanthpur',
        name: { en: 'Yeshwanthpur APMC', hi: 'यशवंतपुर APMC', kn: 'ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ' },
        district: 'Bengaluru',
        state: 'Karnataka',
        modalPrice: 2890,
        minPrice: 2500,
        maxPrice: 3150,
        arrivalsTonnes: 780,
      },
      {
        mandiId: 'lasalgaon',
        name: { en: 'Lasalgaon Mandi', hi: 'लासलगांव मंडी', kn: 'ಲಾಸಲ್‌ಗಾಂವ್ ಮಂಡಿ' },
        district: 'Nashik',
        state: 'Maharashtra',
        modalPrice: 2960,
        minPrice: 2550,
        maxPrice: 3200,
        arrivalsTonnes: 1450,
      },
      {
        mandiId: 'mysuru',
        name: { en: 'Mysuru Bandipalya APMC', hi: 'मैसूर APMC', kn: 'ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ ಎಪಿಎಂಸಿ' },
        district: 'Mysuru',
        state: 'Karnataka',
        modalPrice: 2680,
        minPrice: 2300,
        maxPrice: 2850,
        arrivalsTonnes: 220,
      },
    ],
  },
  {
    id: 'tomato',
    name: { en: 'Tomato', hi: 'टमाटर', kn: 'ಟೊಮೆಟೊ' },
    variety: { en: 'Hybrid / Nati', hi: 'हाइब्रिड / देसी', kn: 'ಹೈಬ್ರಿಡ್ / ನಾಟಿ' },
    perishability: 'high',
    series14d: [1940, 1980, 2050, 2120, 2090, 2160, 2240, 2290, 2320, 2270, 2210, 2140, 2080, 1960],
    mandis: [
      {
        mandiId: 'kolar',
        name: { en: 'Kolar APMC', hi: 'कोलार APMC', kn: 'ಕೋಲಾರ ಎಪಿಎಂಸಿ' },
        district: 'Kolar',
        state: 'Karnataka',
        modalPrice: 2150,
        minPrice: 1750,
        maxPrice: 2400,
        arrivalsTonnes: 860,
      },
      {
        mandiId: 'chikkaballapur',
        name: { en: 'Chikkaballapur APMC', hi: 'चिक्कबल्लापुर APMC', kn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ ಎಪಿಎಂಸಿ' },
        district: 'Chikkaballapur',
        state: 'Karnataka',
        modalPrice: 2040,
        minPrice: 1700,
        maxPrice: 2280,
        arrivalsTonnes: 490,
      },
      {
        mandiId: 'davanagere',
        name: { en: 'Davanagere APMC', hi: 'दावणगेरे APMC', kn: 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ' },
        district: 'Davanagere',
        state: 'Karnataka',
        modalPrice: 1960,
        minPrice: 1600,
        maxPrice: 2180,
        arrivalsTonnes: 240,
      },
      {
        mandiId: 'azadpur',
        name: { en: 'Azadpur Mandi', hi: 'आजादपुर मंडी', kn: 'ಆಜಾದ್‌ಪುರ್ ಮಂಡಿ' },
        district: 'Delhi',
        state: 'Delhi',
        modalPrice: 2380,
        minPrice: 1900,
        maxPrice: 2650,
        arrivalsTonnes: 1620,
      },
    ],
  },
  {
    id: 'maize',
    name: { en: 'Maize', hi: 'मक्का', kn: 'ಮೆಕ್ಕೆಜೋಳ' },
    variety: { en: 'Yellow Hybrid FAQ', hi: 'पीला हाइब्रिड FAQ', kn: 'ಹಳದಿ ಹೈಬ್ರಿಡ್ FAQ' },
    perishability: 'low',
    series14d: [2040, 2055, 2060, 2080, 2100, 2115, 2130, 2145, 2170, 2190, 2220, 2255, 2290, 2345],
    mandis: [
      {
        mandiId: 'davanagere',
        name: { en: 'Davanagere APMC', hi: 'दावणगेरे APMC', kn: 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ' },
        district: 'Davanagere',
        state: 'Karnataka',
        modalPrice: 2345,
        minPrice: 2180,
        maxPrice: 2460,
        arrivalsTonnes: 950,
      },
      {
        mandiId: 'haveri',
        name: { en: 'Haveri APMC', hi: 'हावेरी APMC', kn: 'ಹಾವೇರಿ ಎಪಿಎಂಸಿ' },
        district: 'Haveri',
        state: 'Karnataka',
        modalPrice: 2310,
        minPrice: 2140,
        maxPrice: 2420,
        arrivalsTonnes: 640,
      },
      {
        mandiId: 'ranebennur',
        name: { en: 'Ranebennur APMC', hi: 'राणेबेन्नूर APMC', kn: 'ರಾಣೆಬೆನ್ನೂರು ಎಪಿಎಂಸಿ' },
        district: 'Haveri',
        state: 'Karnataka',
        modalPrice: 2380,
        minPrice: 2210,
        maxPrice: 2490,
        arrivalsTonnes: 510,
      },
      {
        mandiId: 'indore',
        name: { en: 'Indore Krishi Upaj Mandi', hi: 'इंदौर कृषि उपज मंडी', kn: 'ಇಂದೋರ್ ಮಂಡಿ' },
        district: 'Indore',
        state: 'Madhya Pradesh',
        modalPrice: 2410,
        minPrice: 2240,
        maxPrice: 2520,
        arrivalsTonnes: 870,
      },
    ],
  },
  {
    id: 'paddy',
    name: { en: 'Paddy', hi: 'धान', kn: 'ಭತ್ತ' },
    variety: { en: 'Sona Masoori', hi: 'सोना मसूरी', kn: 'ಸೋನಾ ಮಸೂರಿ' },
    perishability: 'low',
    series14d: [2510, 2525, 2520, 2540, 2555, 2575, 2590, 2610, 2630, 2645, 2670, 2690, 2720, 2765],
    mandis: [
      {
        mandiId: 'raichur',
        name: { en: 'Raichur APMC', hi: 'रायचूर APMC', kn: 'ರಾಯಚೂರು ಎಪಿಎಂಸಿ' },
        district: 'Raichur',
        state: 'Karnataka',
        modalPrice: 2765,
        minPrice: 2550,
        maxPrice: 2920,
        arrivalsTonnes: 1240,
      },
      {
        mandiId: 'gangavathi',
        name: { en: 'Gangavathi APMC', hi: 'गंगावती APMC', kn: 'ಗಂಗಾವತಿ ಎಪಿಎಂಸಿ' },
        district: 'Koppal',
        state: 'Karnataka',
        modalPrice: 2810,
        minPrice: 2600,
        maxPrice: 2980,
        arrivalsTonnes: 980,
      },
      {
        mandiId: 'davanagere',
        name: { en: 'Davanagere APMC', hi: 'दावणगेरे APMC', kn: 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ' },
        district: 'Davanagere',
        state: 'Karnataka',
        modalPrice: 2715,
        minPrice: 2500,
        maxPrice: 2850,
        arrivalsTonnes: 740,
      },
      {
        mandiId: 'mandya',
        name: { en: 'Mandya APMC', hi: 'मांड्या APMC', kn: 'ಮಂಡ್ಯ ಎಪಿಎಂಸಿ' },
        district: 'Mandya',
        state: 'Karnataka',
        modalPrice: 2690,
        minPrice: 2480,
        maxPrice: 2820,
        arrivalsTonnes: 610,
      },
    ],
  },
  {
    id: 'turdal',
    name: { en: 'Tur Dal (Red Gram)', hi: 'तूर दाल (अरहर)', kn: 'ತೊಗರಿ ಬೇಳೆ' },
    variety: { en: 'Whole Red Gram FAQ', hi: 'अच्छी किस्म अरहर', kn: 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ತೊಗರಿ' },
    perishability: 'low',
    series14d: [9650, 9680, 9720, 9760, 9810, 9840, 9890, 9940, 9990, 10050, 10120, 10190, 10260, 10410],
    mandis: [
      {
        mandiId: 'kalaburagi',
        name: { en: 'Kalaburagi APMC', hi: 'कलबुर्गी APMC', kn: 'ಕಲಬುರಗಿ ಎಪಿಎಂಸಿ' },
        district: 'Kalaburagi',
        state: 'Karnataka',
        modalPrice: 10410,
        minPrice: 9850,
        maxPrice: 10820,
        arrivalsTonnes: 1120,
      },
      {
        mandiId: 'yadgir',
        name: { en: 'Yadgir APMC', hi: 'यादगीर APMC', kn: 'ಯಾದಗಿರಿ ಎಪಿಎಂಸಿ' },
        district: 'Yadgir',
        state: 'Karnataka',
        modalPrice: 10290,
        minPrice: 9700,
        maxPrice: 10680,
        arrivalsTonnes: 680,
      },
      {
        mandiId: 'bidar',
        name: { en: 'Bidar APMC', hi: 'बीदर APMC', kn: 'ಬೀದರ್ ಎಪಿಎಂಸಿ' },
        district: 'Bidar',
        state: 'Karnataka',
        modalPrice: 10240,
        minPrice: 9650,
        maxPrice: 10600,
        arrivalsTonnes: 540,
      },
      {
        mandiId: 'indore',
        name: { en: 'Indore Krishi Upaj Mandi', hi: 'इंदौर कृषि उपज मंडी', kn: 'ಇಂದೋರ್ ಮಂಡಿ' },
        district: 'Indore',
        state: 'Madhya Pradesh',
        modalPrice: 10480,
        minPrice: 9900,
        maxPrice: 10900,
        arrivalsTonnes: 790,
      },
    ],
  },
  {
    id: 'cotton',
    name: { en: 'Cotton', hi: 'कपास', kn: 'ಹತ್ತಿ' },
    variety: { en: 'Long Staple DCH-32', hi: 'लंबे रेशे की कपास', kn: 'ಉದ್ದ ಎಳೆಯ ಹತ್ತಿ' },
    perishability: 'low',
    series14d: [7620, 7600, 7580, 7550, 7540, 7510, 7490, 7470, 7440, 7420, 7380, 7350, 7310, 7220],
    mandis: [
      {
        mandiId: 'raichur',
        name: { en: 'Raichur Cotton Market', hi: 'रायचूर कपास मंडी', kn: 'ರಾಯಚೂರು ಹತ್ತಿ ಮಾರುಕಟ್ಟೆ' },
        district: 'Raichur',
        state: 'Karnataka',
        modalPrice: 7220,
        minPrice: 6850,
        maxPrice: 7520,
        arrivalsTonnes: 890,
      },
      {
        mandiId: 'hubballi',
        name: { en: 'Hubballi APMC', hi: 'हुबली APMC', kn: 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ' },
        district: 'Dharwad',
        state: 'Karnataka',
        modalPrice: 7290,
        minPrice: 6900,
        maxPrice: 7600,
        arrivalsTonnes: 670,
      },
      {
        mandiId: 'chitradurga',
        name: { en: 'Chitradurga APMC', hi: 'चित्रदुर्ग APMC', kn: 'ಚಿತ್ರದುರ್ಗ ಎಪಿಎಂಸಿ' },
        district: 'Chitradurga',
        state: 'Karnataka',
        modalPrice: 7180,
        minPrice: 6800,
        maxPrice: 7450,
        arrivalsTonnes: 420,
      },
      {
        mandiId: 'guntur',
        name: { en: 'Guntur APMC', hi: 'गुंटूर APMC', kn: 'ಗುಂಟೂರು ಎಪಿಎಂಸಿ' },
        district: 'Guntur',
        state: 'Andhra Pradesh',
        modalPrice: 7440,
        minPrice: 7050,
        maxPrice: 7750,
        arrivalsTonnes: 1380,
      },
    ],
  },
  {
    id: 'arecanut',
    name: { en: 'Arecanut', hi: 'सुपारी', kn: 'ಅಡಿಕೆ' },
    variety: { en: 'Rashi / Red Supari', hi: 'राशि / लाल सुपारी', kn: 'ರಾಶಿ / ಕೆಂಪು ಅಡಿಕೆ' },
    perishability: 'low',
    series14d: [47800, 47950, 48100, 48200, 48350, 48500, 48620, 48800, 49050, 49200, 49450, 49700, 49950, 50400],
    mandis: [
      {
        mandiId: 'shivamogga',
        name: { en: 'Shivamogga APMC', hi: 'शिवमोगा APMC', kn: 'ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ' },
        district: 'Shivamogga',
        state: 'Karnataka',
        modalPrice: 50400,
        minPrice: 46500,
        maxPrice: 52800,
        arrivalsTonnes: 340,
      },
      {
        mandiId: 'channagiri',
        name: { en: 'Channagiri TUMCOS', hi: 'चन्नगिरी TUMCOS', kn: 'ಚನ್ನಗಿರಿ TUMCOS' },
        district: 'Davanagere',
        state: 'Karnataka',
        modalPrice: 50650,
        minPrice: 46800,
        maxPrice: 53100,
        arrivalsTonnes: 280,
      },
      {
        mandiId: 'sirsi',
        name: { en: 'Sirsi TSS Market', hi: 'सिरसी TSS मंडी', kn: 'ಶಿರಸಿ TSS ಮಾರುಕಟ್ಟೆ' },
        district: 'Uttara Kannada',
        state: 'Karnataka',
        modalPrice: 49900,
        minPrice: 45900,
        maxPrice: 52200,
        arrivalsTonnes: 260,
      },
      {
        mandiId: 'tumakuru',
        name: { en: 'Tumakuru APMC', hi: 'तुमकुरु APMC', kn: 'ತುಮಕೂರು ಎಪಿಎಂಸಿ' },
        district: 'Tumakuru',
        state: 'Karnataka',
        modalPrice: 49500,
        minPrice: 45600,
        maxPrice: 51800,
        arrivalsTonnes: 210,
      },
    ],
  },
  {
    id: 'potato',
    name: { en: 'Potato', hi: 'आलू', kn: 'ಆಲೂಗಡ್ಡೆ' },
    variety: { en: 'Jyoti / Table Grade', hi: 'ज्योति / टेबल ग्रेड', kn: 'ಜ್ಯೋತಿ / ಟೇಬಲ್ ಗ್ರೇಡ್' },
    perishability: 'medium',
    series14d: [2280, 2260, 2250, 2240, 2210, 2190, 2175, 2150, 2140, 2110, 2090, 2065, 2040, 1985],
    mandis: [
      {
        mandiId: 'hassan',
        name: { en: 'Hassan APMC', hi: 'हासन APMC', kn: 'ಹಾಸನ ಎಪಿಎಂಸಿ' },
        district: 'Hassan',
        state: 'Karnataka',
        modalPrice: 1985,
        minPrice: 1700,
        maxPrice: 2150,
        arrivalsTonnes: 530,
      },
      {
        mandiId: 'belagavi',
        name: { en: 'Belagavi APMC', hi: 'बेलगावी APMC', kn: 'ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ' },
        district: 'Belagavi',
        state: 'Karnataka',
        modalPrice: 2040,
        minPrice: 1750,
        maxPrice: 2220,
        arrivalsTonnes: 610,
      },
      {
        mandiId: 'yeshwanthpur',
        name: { en: 'Yeshwanthpur APMC', hi: 'यशवंतपुर APMC', kn: 'ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ' },
        district: 'Bengaluru',
        state: 'Karnataka',
        modalPrice: 2120,
        minPrice: 1840,
        maxPrice: 2300,
        arrivalsTonnes: 920,
      },
      {
        mandiId: 'indore',
        name: { en: 'Indore Krishi Upaj Mandi', hi: 'इंदौर कृषि उपज मंडी', kn: 'ಇಂದೋರ್ ಮಂಡಿ' },
        district: 'Indore',
        state: 'Madhya Pradesh',
        modalPrice: 2190,
        minPrice: 1880,
        maxPrice: 2360,
        arrivalsTonnes: 1140,
      },
    ],
  },
];

// Deterministic linear regression + short-term momentum forecast (5 days ahead)
function computeLinearForecast(values: number[], horizonDays = 5): number[] {
  const n = values.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  // Blend linear slope with recent 4-day velocity for responsive commodity forecasting
  const recentVelocity = (values[n - 1] - values[Math.max(0, n - 4)]) / 3;
  const blendedSlope = slope * 0.55 + recentVelocity * 0.45;
  const latest = values[n - 1];

  const predicted: number[] = [];
  for (let d = 1; d <= horizonDays; d++) {
    const projected = Math.round(Math.max(latest * 0.75, latest + blendedSlope * d));
    predicted.push(projected);
  }
  return predicted;
}

const DISTRICT_COORDS: Record<string, [number, number]> = {
  davanagere: [14.4644, 75.9218],
  dharwad: [15.3647, 75.124],
  hubballi: [15.3647, 75.124],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  mysuru: [12.2958, 76.6394],
  mysore: [12.2958, 76.6394],
  kolar: [13.1362, 78.1292],
  chikkaballapur: [13.4355, 77.7315],
  haveri: [14.7951, 75.3991],
  raichur: [16.2076, 77.3463],
  koppal: [15.35, 76.1548],
  mandya: [12.5218, 76.8951],
  kalaburagi: [17.3297, 76.8343],
  gulbarga: [17.3297, 76.8343],
  yadgir: [16.77, 77.1376],
  bidar: [17.9104, 77.5199],
  chitradurga: [14.2251, 76.398],
  shivamogga: [13.9299, 75.5681],
  shimoga: [13.9299, 75.5681],
  'uttara kannada': [14.6195, 74.8354],
  sirsi: [14.6195, 74.8354],
  tumakuru: [13.3379, 77.1173],
  tumkur: [13.3379, 77.1173],
  hassan: [13.0033, 76.1004],
  belagavi: [15.8497, 74.4977],
  belgaum: [15.8497, 74.4977],
  nashik: [19.9975, 73.7898],
  delhi: [28.7041, 77.1025],
  indore: [22.7196, 75.8577],
  guntur: [16.3067, 80.4365],
};

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const sin1 = Math.sin(dLat / 2);
  const sin2 = Math.sin(dLon / 2);
  const h = sin1 * sin1 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sin2 * sin2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

function resolveFarmerCoords(place: string, locality: string): [number, number] {
  const combined = `${place} ${locality}`.toLowerCase();
  for (const [key, coords] of Object.entries(DISTRICT_COORDS)) {
    if (combined.includes(key)) {
      return coords;
    }
  }
  // Default central Karnataka hub if custom rural town name is entered
  return [14.4644, 75.9218];
}

export const QUALITY_GRADE_LABELS: Record<QualityGrade, Record<Language, string>> = {
  gradeA: {
    en: 'Grade A · Large / Export',
    hi: 'ग्रेड A · बड़ा आकार / प्रीमियम',
    kn: 'ಗ್ರೇಡ್ A · ದೊಡ್ಡ ಗಾತ್ರ / ಪ್ರೀಮಿಯಂ',
  },
  gradeB: {
    en: 'Grade B · Medium FAQ',
    hi: 'ग्रेड B · मध्यम आकार (FAQ)',
    kn: 'ಗ್ರೇಡ್ B · ಮಧ್ಯಮ ಗಾತ್ರ (FAQ)',
  },
  gradeC: {
    en: 'Grade C · Small / Mixed',
    hi: 'ग्रेड C · छोटा आकार / मिश्रित',
    kn: 'ಗ್ರೇಡ್ C · ಸಣ್ಣ ಗಾತ್ರ / ಮಿಶ್ರಿತ',
  },
};

const GRADE_SPECS_BY_CROP: Record<
  string,
  Record<QualityGrade, { sizeSpec: Record<Language, string>; multiplier: number; momentumBoost: number }>
> = {
  onion: {
    gradeA: {
      sizeSpec: {
        en: '> 55 mm · Dry Red, Tight Skin',
        hi: '> 55 मिमी · सूखा लाल, सख्त छिलका',
        kn: '> 55 ಮಿಮೀ · ಒಣ ಕೆಂಪು, ಗಟ್ಟಿ ಸಿಪ್ಪೆ',
      },
      multiplier: 1.16,
      momentumBoost: 1.012,
    },
    gradeB: {
      sizeSpec: {
        en: '40–55 mm · Standard FAQ',
        hi: '40–55 मिमी · मानक औसत गुणवत्ता',
        kn: '40–55 ಮಿಮೀ · ಸಾಮಾನ್ಯ ಮಧ್ಯಮ ಗುಣಮಟ್ಟ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: '< 40 mm · Small / Unsorted Lot',
        hi: '< 40 मिमी · छोटा / बिना छँटाई माल',
        kn: '< 40 ಮಿಮೀ · ಸಣ್ಣ / ವಿಂಗಡಿಸದ ರಾಶಿ',
      },
      multiplier: 0.79,
      momentumBoost: 0.985,
    },
  },
  tomato: {
    gradeA: {
      sizeSpec: {
        en: '> 60 mm · Firm Deep Red Table',
        hi: '> 60 मिमी · सख्त लाल टेबल टमाटर',
        kn: '> 60 ಮಿಮೀ · ಗಟ್ಟಿ ಕೆಂಪು ಟೇಬಲ್ ಟೊಮೆಟೊ',
      },
      multiplier: 1.18,
      momentumBoost: 1.01,
    },
    gradeB: {
      sizeSpec: {
        en: '45–60 mm · Medium Crate Grade',
        hi: '45–60 मिमी · मध्यम क्रेट ग्रेड',
        kn: '45–60 ಮಿಮೀ · ಮಧ್ಯಮ ಕ್ರೇಟ್ ಶ್ರೇಣಿ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: '< 45 mm · Small / Soft Processing',
        hi: '< 45 मिमी · छोटा / प्रोसेसिंग गुणवत्ता',
        kn: '< 45 ಮಿಮೀ · ಸಣ್ಣ / ಸಂಸ್ಕರಣಾ ಗುಣಮಟ್ಟ',
      },
      multiplier: 0.76,
      momentumBoost: 0.98,
    },
  },
  maize: {
    gradeA: {
      sizeSpec: {
        en: 'Bold Grain · < 12% Moisture, Clean',
        hi: 'बड़ा दाना · < 12% नमी, साफ माल',
        kn: 'ದಪ್ಪ ಕಾಳು · < 12% ತೇವಾಂಶ, ಸ್ವಚ್ಛ',
      },
      multiplier: 1.11,
      momentumBoost: 1.008,
    },
    gradeB: {
      sizeSpec: {
        en: 'Medium Grain · 12–14% Moisture FAQ',
        hi: 'मध्यम दाना · 12–14% नमी (FAQ)',
        kn: 'ಮಧ್ಯಮ ಕಾಳು · 12–14% ತೇವಾಂಶ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: 'Small / Broken · > 14% Moisture',
        hi: 'छोटा / टूटा दाना · > 14% नमी',
        kn: 'ಸಣ್ಣ / ಒಡೆದ ಕಾಳು · > 14% ತೇವಾಂಶ',
      },
      multiplier: 0.84,
      momentumBoost: 0.988,
    },
  },
  paddy: {
    gradeA: {
      sizeSpec: {
        en: 'Slender Long Grain · < 13% Moisture',
        hi: 'पतला लंबा दाना · < 13% नमी',
        kn: 'ತೆಳುವಾದ ಉದ್ದ ಕಾಳು · < 13% ತೇವಾಂಶ',
      },
      multiplier: 1.13,
      momentumBoost: 1.008,
    },
    gradeB: {
      sizeSpec: {
        en: 'Medium Sona FAQ · 13–15% Moisture',
        hi: 'मध्यम सोना FAQ · 13–15% नमी',
        kn: 'ಮಧ್ಯಮ ಸೋನಾ FAQ · 13–15% ತೇವಾಂಶ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: 'Short / High Moisture > 15%',
        hi: 'छोटा दाना / अधिक नमी > 15%',
        kn: 'ಸಣ್ಣ ಕಾಳು / ಹೆಚ್ಚು ತೇವಾಂಶ > 15%',
      },
      multiplier: 0.85,
      momentumBoost: 0.99,
    },
  },
  turdal: {
    gradeA: {
      sizeSpec: {
        en: '> 6 mm Bold Grain · < 10% Moisture',
        hi: '> 6 मिमी मोटा दाना · < 10% नमी',
        kn: '> 6 ಮಿಮೀ ದಪ್ಪ ಕಾಳು · < 10% ತೇವಾಂಶ',
      },
      multiplier: 1.12,
      momentumBoost: 1.01,
    },
    gradeB: {
      sizeSpec: {
        en: '4.5–6 mm Medium FAQ Clean',
        hi: '4.5–6 मिमी मध्यम साफ FAQ',
        kn: '4.5–6 ಮಿಮೀ ಮಧ್ಯಮ ಸ್ವಚ್ಛ FAQ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: '< 4.5 mm Small / Weathered Lot',
        hi: '< 4.5 मिमी छोटा / हल्का दाना',
        kn: '< 4.5 ಮಿಮೀ ಸಣ್ಣ / ಮಿಶ್ರ ಕಾಳು',
      },
      multiplier: 0.83,
      momentumBoost: 0.99,
    },
  },
  cotton: {
    gradeA: {
      sizeSpec: {
        en: '31+ mm Extra Long Staple · Bright White',
        hi: '31+ मिमी लंबा रेशा · चमकदार सफेद',
        kn: '31+ ಮಿಮೀ ಉದ್ದ ಎಳೆ · ಶುದ್ಧ ಬಿಳಿ',
      },
      multiplier: 1.14,
      momentumBoost: 1.01,
    },
    gradeB: {
      sizeSpec: {
        en: '28–30 mm Medium Staple FAQ',
        hi: '28–30 मिमी मध्यम रेशा FAQ',
        kn: '28–30 ಮಿಮೀ ಮಧ್ಯಮ ಎಳೆ FAQ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: '< 28 mm Short Staple / Stained',
        hi: '< 28 मिमी छोटा रेशा / दागी कपास',
        kn: '< 28 ಮಿಮೀ ಚಿಕ್ಕ ಎಳೆ / ಕಲೆ ಹತ್ತಿ',
      },
      multiplier: 0.82,
      momentumBoost: 0.985,
    },
  },
  arecanut: {
    gradeA: {
      sizeSpec: {
        en: 'Bold Rashi Grade-1 · Uniform Size',
        hi: 'बोल्ड राशि ग्रेड-1 · एक समान आकार',
        kn: 'ದಪ್ಪ ರಾಶಿ ಗ್ರೇಡ್-1 · ಒಂದೇ ಗಾತ್ರ',
      },
      multiplier: 1.15,
      momentumBoost: 1.008,
    },
    gradeB: {
      sizeSpec: {
        en: 'Medium Rashi FAQ · Sorted',
        hi: 'मध्यम राशि FAQ · छँटी हुई',
        kn: 'ಮಧ್ಯಮ ರಾಶಿ FAQ · ವಿಂಗಡಿಸಿದ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: 'Small / Bette & Chali Mix',
        hi: 'छोटा आकार / चाली मिक्स',
        kn: 'ಸಣ್ಣ ಗಾತ್ರ / ಬೆಟ್ಟೆ ಮತ್ತು ಚಾಲಿ ಮಿಶ್ರಣ',
      },
      multiplier: 0.8,
      momentumBoost: 0.99,
    },
  },
  potato: {
    gradeA: {
      sizeSpec: {
        en: '> 55 mm Jumbo Table · Blemish Free',
        hi: '> 55 मिमी बड़ा जंबो साइज · साफ',
        kn: '> 55 ಮಿಮೀ ದೊಡ್ಡ ಜಂಬೋ ಗಾತ್ರ · ಸ್ವಚ್ಛ',
      },
      multiplier: 1.16,
      momentumBoost: 1.01,
    },
    gradeB: {
      sizeSpec: {
        en: '40–55 mm Medium Standard FAQ',
        hi: '40–55 मिमी मध्यम मानक साइज',
        kn: '40–55 ಮಿಮೀ ಮಧ್ಯಮ ಸಾಮಾನ್ಯ ಗಾತ್ರ',
      },
      multiplier: 1.0,
      momentumBoost: 1.0,
    },
    gradeC: {
      sizeSpec: {
        en: '< 40 mm Baby / Chatta Grade',
        hi: '< 40 मिमी छोटा / छट्टा ग्रेड',
        kn: '< 40 ಮಿಮೀ ಸಣ್ಣ / ಚಟ್ಟಾ ಶ್ರೇಣಿ',
      },
      multiplier: 0.78,
      momentumBoost: 0.985,
    },
  },
};

export function evaluateMandisForFarmer(
  mandis: MandiRate[],
  farmerPlace: string,
  farmerLocality: string,
  priceMultiplier = 1
): MandiProfitEvaluation[] {
  const farmerCoords = resolveFarmerCoords(farmerPlace, farmerLocality);

  const evaluations = mandis.map((m) => {
    const mandiCoords =
      DISTRICT_COORDS[m.district.toLowerCase()] ??
      DISTRICT_COORDS[m.mandiId.toLowerCase()] ??
      [14.4644, 75.9218];
    const straightKm = haversineKm(farmerCoords, mandiCoords);
    // Road distance factor ~1.22x with minimum local haul 14 km
    const estimatedDistanceKm = Math.max(14, Math.round(straightKm * 1.22));
    // Transport cost ~ ₹1.35 per km per quintal + ₹35 loading/unloading
    const transportCostPerQtl = Math.round(35 + estimatedDistanceKm * 1.35);
    const scaledModalPrice = Math.round(m.modalPrice * priceMultiplier);
    const scaledMinPrice = Math.round(m.minPrice * priceMultiplier);
    const scaledMaxPrice = Math.round(m.maxPrice * priceMultiplier);
    const marketFeePerQtl = Math.round(scaledModalPrice * 0.015);
    const netProfitPerQtl = scaledModalPrice - transportCostPerQtl - marketFeePerQtl;

    return {
      ...m,
      modalPrice: scaledModalPrice,
      minPrice: scaledMinPrice,
      maxPrice: scaledMaxPrice,
      estimatedDistanceKm,
      transportCostPerQtl,
      marketFeePerQtl,
      netProfitPerQtl,
      isMostProfitable: false,
    };
  });

  evaluations.sort((a, b) => b.netProfitPerQtl - a.netProfitPerQtl);
  if (evaluations.length > 0) {
    evaluations[0].isMostProfitable = true;
  }
  return evaluations;
}

function buildQualityTierAnalysis(
  seed: RawCropSeed,
  grade: QualityGrade,
  baseBestMandiPrice: number,
  liveBoostFactor = 1
): QualitySizeAnalysis {
  const spec = GRADE_SPECS_BY_CROP[seed.id]?.[grade] ?? {
    sizeSpec: {
      en: 'Standard Grade',
      hi: 'मानक ग्रेड',
      kn: 'ಸಾಮಾನ್ಯ ಶ್ರೇಣಿ',
    },
    multiplier: grade === 'gradeA' ? 1.15 : grade === 'gradeC' ? 0.8 : 1.0,
    momentumBoost: grade === 'gradeA' ? 1.01 : grade === 'gradeC' ? 0.99 : 1.0,
  };

  const historyValues = seed.series14d.map((val, idx) => {
    const progress = idx / Math.max(seed.series14d.length - 1, 1);
    const dynamicFactor = spec.multiplier * (1 + (spec.momentumBoost - 1) * progress);
    const isLatestDay = idx === seed.series14d.length - 1;
    const surgeFactor = isLatestDay ? liveBoostFactor : 1;
    return Math.round(val * dynamicFactor * surgeFactor);
  });

  const latestSeriesPrice = historyValues[historyValues.length - 1];
  const previousDayPrice = historyValues[historyValues.length - 2];
  const priceDiff = latestSeriesPrice - previousDayPrice;
  const changePercent = Number(((priceDiff / previousDayPrice) * 100).toFixed(2));
  const trendDirection: 'up' | 'down' = priceDiff >= 0 ? 'up' : 'down';

  const forecastValues = computeLinearForecast(historyValues, 5);
  const predicted5DayPrice = forecastValues[forecastValues.length - 1];
  const forecastDiff = predicted5DayPrice - latestSeriesPrice;
  const forecastPercent = Number(((forecastDiff / latestSeriesPrice) * 100).toFixed(2));
  const forecastDirection: 'increment' | 'decrement' = forecastDiff >= 0 ? 'increment' : 'decrement';

  let recommendation: 'SELL' | 'HOLD' = 'SELL';
  if (seed.perishability === 'high') {
    recommendation = forecastPercent >= 6 ? 'HOLD' : 'SELL';
  } else if (seed.perishability === 'medium') {
    recommendation = forecastPercent >= 3.2 ? 'HOLD' : 'SELL';
  } else {
    recommendation = forecastPercent >= 2.2 ? 'HOLD' : 'SELL';
  }

  const history14d: PricePoint[] = historyValues.map((price, idx) => ({
    dayLabel: `D-${13 - idx === 0 ? '0' : 13 - idx}`.replace('D-0', 'Today'),
    price,
    isForecast: false,
  }));

  const forecast5d: PricePoint[] = forecastValues.map((price, idx) => ({
    dayLabel: `+${idx + 1}d`,
    price,
    isForecast: true,
  }));

  return {
    grade,
    label: QUALITY_GRADE_LABELS[grade],
    sizeSpec: spec.sizeSpec,
    multiplier: spec.multiplier,
    currentBestPrice: Math.round(baseBestMandiPrice * spec.multiplier * liveBoostFactor),
    previousDayPrice,
    priceDiff,
    changePercent,
    trendDirection,
    predicted5DayPrice,
    forecastPercent,
    forecastDirection,
    recommendation,
    history14d,
    forecast5d,
  };
}

export function buildAllCropAnalyses(
  farmerPlace = 'Davanagere',
  farmerLocality = 'Harihar',
  liveBoostsByCrop: Record<string, number> = {}
): CropAnalysis[] {
  return RAW_CROPS.map((seed) => {
    const liveBoostFactor = liveBoostsByCrop[seed.id] ?? 1;
    const baseBestMandiPrice = Math.max(...seed.mandis.map((m) => m.modalPrice));
    const effectiveMandis: MandiRate[] =
      liveBoostFactor === 1
        ? seed.mandis
        : seed.mandis.map((m) => ({
            ...m,
            modalPrice: Math.round(m.modalPrice * liveBoostFactor),
            minPrice: Math.round(m.minPrice * liveBoostFactor),
            maxPrice: Math.round(m.maxPrice * liveBoostFactor),
          }));

    const gradeA = buildQualityTierAnalysis(seed, 'gradeA', baseBestMandiPrice, liveBoostFactor);
    const gradeB = buildQualityTierAnalysis(seed, 'gradeB', baseBestMandiPrice, liveBoostFactor);
    const gradeC = buildQualityTierAnalysis(seed, 'gradeC', baseBestMandiPrice, liveBoostFactor);

    const evaluatedMandis = evaluateMandisForFarmer(effectiveMandis, farmerPlace, farmerLocality, 1);
    const bestMandi = evaluatedMandis[0];

    return {
      id: seed.id,
      name: seed.name,
      variety: seed.variety,
      unit: 'Qtl',
      perishability: seed.perishability,
      currentBestPrice: gradeB.currentBestPrice,
      previousDayPrice: gradeB.previousDayPrice,
      priceDiff: gradeB.priceDiff,
      changePercent: gradeB.changePercent,
      trendDirection: gradeB.trendDirection,
      predicted5DayPrice: gradeB.predicted5DayPrice,
      forecastPercent: gradeB.forecastPercent,
      forecastDirection: gradeB.forecastDirection,
      recommendation: gradeB.recommendation,
      confidencePercent: seed.perishability === 'high' ? 79 : seed.perishability === 'medium' ? 86 : 91,
      history14d: gradeB.history14d,
      forecast5d: gradeB.forecast5d,
      mandiRates: effectiveMandis,
      bestMandiName: bestMandi.name,
      qualityTiers: {
        gradeA,
        gradeB,
        gradeC,
      },
    };
  });
}
