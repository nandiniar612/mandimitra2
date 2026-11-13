import type { CropAnalysis, GovernmentScheme, LossSituation, QualitySizeAnalysis } from '../types.ts';

// Estimated average farmer cultivation cost per quintal (₹/Qtl) for baseline profit/loss calculation
export const DEFAULT_CULTIVATION_COST_PER_QTL: Record<string, number> = {
  onion: 1950,
  tomato: 1750,
  maize: 1850,
  paddy: 2150,
  turdal: 7800,
  cotton: 6950,
  arecanut: 31500,
  potato: 1780,
};

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pmfby',
    code: 'PMFBY',
    category: 'crop_damage',
    name: {
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY)',
    },
    summary: {
      en: 'Crop insurance compensation when harvest fails or suffers loss due to drought, flood, unseasonal rain, pests, or post-harvest damage.',
      hi: 'सूखा, बाढ़, बेमौसम बारिश, कीट या कटाई के बाद नुकसान होने पर फसल बीमा मुआवजा प्रदान करता है।',
      kn: 'ಬರ, ಪ್ರವಾಹ, ಅಕಾಲಿಕ ಮಳೆ, ಕೀಟ ಬಾಧೆ ಅಥವಾ ಕೊಯ್ಲಿನ ನಂತರದ ನಷ್ಟಕ್ಕೆ ಬೆಳೆ ವಿಮೆ ಪರಿಹಾರ ನೀಡುತ್ತದೆ.',
    },
    benefit: {
      en: 'Up to 100% insured sum payout; farmer premium capped at 2% (Kharif), 1.5% (Rabi), 5% (Horticulture).',
      hi: 'बीमित राशि का 100% तक मुआवजा; किसान प्रीमियम केवल 2% (खरीफ), 1.5% (रबी), 5% (बागवानी)।',
      kn: 'ವಿಮಾ ಮೊತ್ತದ 100% ವರೆಗೆ ಪರಿಹಾರ; ರೈತರ ಪ್ರೀಮಿಯಂ ಕೇವಲ 2% (ಮುಂಗಾರು), 1.5% (ಹಿಂಗಾರು), 5% (ತೋಟಗಾರಿಕೆ).',
    },
    eligibility: {
      en: 'All loanee and non-loanee farmers cultivating notified crops; report localized loss within 72 hours.',
      hi: 'अधिसूचित फसलें उगाने वाले सभी ऋणी व गैर-ऋणी किसान; नुकसान के 72 घंटे के भीतर सूचना दें।',
      kn: 'ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುವ ಎಲ್ಲಾ ರೈತರು; ನಷ್ಟವಾದ 72 ಗಂಟೆಗಳ ಒಳಗೆ ದೂರು ದಾಖಲಿಸಿ.',
    },
    documents: {
      en: 'Aadhaar Card, Land Record (RTC/Pahani/Khata), Bank Passbook, Sowing Certificate.',
      hi: 'आधार कार्ड, भूमि अभिलेख (खतौनी/पहानी), बैंक पासबुक, बुवाई प्रमाण पत्र।',
      kn: 'ಆಧಾರ್ ಕಾರ್ಡ್, ಭೂ ದಾಖಲೆ (RTC/ಪಹಣಿ), ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಬಿತ್ತನೆ ಪ್ರಮಾಣಪತ್ರ.',
    },
    applySteps: {
      en: [
        'Visit pmfby.gov.in or your nearest CSC / Gram Panchayat / Bank branch.',
        'Enroll before seasonal cutoff date or report crop loss within 72 hours on the Crop Insurance App or helpline 14447.',
        'Claim amount is credited directly to your Aadhaar-linked bank account after survey.',
      ],
      hi: [
        'pmfby.gov.in पर जाएं या नजदीकी CSC केंद्र / बैंक शाखा में पंजीकरण करें।',
        'फसल नुकसान होने पर 72 घंटे के भीतर क्रॉप इंश्योरेंस ऐप या हेल्पलाइन 14447 पर सूचना दें।',
        'सर्वेक्षण के बाद मुआवजा राशि सीधे आपके आधार-लिंक्ड बैंक खाते में आती है।',
      ],
      kn: [
        'pmfby.gov.in ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ಹತ್ತಿರದ CSC / ಗ್ರಾಮ ಪಂಚಾಯಿತಿ / ಬ್ಯಾಂಕ್ ಶಾಖೆಯಲ್ಲಿ ನೋಂದಾಯಿಸಿ.',
        'ಬೆಳೆ ಹಾನಿಯಾದ 72 ಗಂಟೆಗಳ ಒಳಗೆ ಕ್ರಾಪ್ ಇನ್ಶುರೆನ್ಸ್ ಆ್ಯಪ್ ಅಥವಾ 14447 ಸಹಾಯವಾಣಿಗೆ ತಿಳಿಸಿ.',
        'ಸಮೀಕ್ಷೆಯ ನಂತರ ಪರಿಹಾರ ಮೊತ್ತ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
      ],
    },
    officialUrl: 'https://pmfby.gov.in/',
    helplineOrPortal: 'pmfby.gov.in · Helpline: 14447',
  },
  {
    id: 'pm-kisan',
    code: 'PM-KISAN',
    category: 'livelihood',
    name: {
      en: 'PM-KISAN Direct Livelihood Income Support',
      hi: 'पीएम-किसान सम्मान निधि (आय सहायता)',
      kn: 'ಪಿಎಂ-ಕಿಸಾನ್ ನೇರ ಆದಾಯ ಬೆಂಬಲ ಯೋಜನೆ',
    },
    summary: {
      en: 'Guaranteed direct bank transfer to help farmer families meet household livelihood and emergency farm expenses during difficult seasons.',
      hi: 'कठिन मौसम में किसान परिवारों के जीवन यापन और खेती के खर्च के लिए सीधे बैंक खाते में सहायता।',
      kn: 'ಕಷ್ಟದ ಸಮಯದಲ್ಲಿ ರೈತ ಕುಟುಂಬಗಳ ಜೀವನೋಪಾಯ ಮತ್ತು ಕೃಷಿ ವೆಚ್ಚಗಳಿಗಾಗಿ ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಧನಸಹಾಯ.',
    },
    benefit: {
      en: '₹6,000 per year transferred directly in three ₹2,000 installments via DBT.',
      hi: 'प्रति वर्ष ₹6,000 (हर 4 महीने में ₹2,000 की 3 किस्तें) सीधे बैंक खाते में।',
      kn: 'ವರ್ಷಕ್ಕೆ ₹6,000 (ಪ್ರತಿ 4 ತಿಂಗಳಿಗೊಮ್ಮೆ ₹2,000 ರಂತೆ 3 ಕಂತುಗಳು) ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ.',
    },
    eligibility: {
      en: 'All landholding farmer families with valid e-KYC and Aadhaar-linked bank account.',
      hi: 'वैध ई-केवाईसी और आधार-लिंक्ड बैंक खाते वाले सभी भूमिधारक किसान परिवार।',
      kn: 'ಮಾನ್ಯ ಇ-ಕೆವೈಸಿ ಮತ್ತು ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿರುವ ಬ್ಯಾಂಕ್ ಖಾತೆ ಹೊಂದಿರುವ ಎಲ್ಲಾ ಭೂಮಾಲೀಕ ರೈತ ಕುಟುಂಬಗಳು.',
    },
    documents: {
      en: 'Aadhaar Card, Land Ownership Record (RTC/Khatauni), Bank Account with DBT enabled.',
      hi: 'आधार कार्ड, जमीन की नकल (खतौनी), डीबीटी सक्षम बैंक खाता।',
      kn: 'ಆಧಾರ್ ಕಾರ್ಡ್, ಜಮೀನು ದಾಖಲೆ (RTC), DBT ಸಕ್ರಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆ.',
    },
    applySteps: {
      en: [
        'Open pmkisan.gov.in and select "New Farmer Registration" (or visit CSC / Revenue Officer).',
        'Complete OTP-based Aadhaar e-KYC and upload land record details.',
        'Track installment status anytime via "Know Your Status" on the portal.',
      ],
      hi: [
        'pmkisan.gov.in पर जाएं और "New Farmer Registration" चुनें या नजदीकी CSC केंद्र जाएं।',
        'आधार OTP द्वारा ई-केवाईसी पूरा करें और भूमि विवरण अपलोड करें।',
        'पोर्टल पर "Know Your Status" से अपनी किस्त की स्थिति देखें।',
      ],
      kn: [
        'pmkisan.gov.in ನಲ್ಲಿ "New Farmer Registration" ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ CSC ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
        'ಆಧಾರ್ OTP ಮೂಲಕ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ಭೂ ದಾಖಲೆ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ.',
        'ಪೋರ್ಟಲ್‌ನಲ್ಲಿ "Know Your Status" ಮೂಲಕ ಕಂತಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
      ],
    },
    officialUrl: 'https://pmkisan.gov.in/',
    helplineOrPortal: 'pmkisan.gov.in · Helpline: 155261',
  },
  {
    id: 'pm-aasha',
    code: 'PM-AASHA / PDPS',
    category: 'price_crash',
    name: {
      en: 'PM-AASHA Price Deficiency & MSP Protection',
      hi: 'पीएम-आशा (भावांतर भुगतान व MSP सुरक्षा)',
      kn: 'ಪಿಎಂ-ಆಶಾ ಬೆಲೆ ಕೊರತೆ ಪಾವತಿ ಮತ್ತು MSP ರಕ್ಷಣೆ',
    },
    summary: {
      en: 'Compensates farmers when mandi market rates fall below the Government Minimum Support Price (MSP) or triggers direct procurement.',
      hi: 'जब मंडी भाव सरकारी न्यूनतम समर्थन मूल्य (MSP) से नीचे गिर जाए तो अंतर की राशि की भरपाई करता है।',
      kn: 'ಮಾರುಕಟ್ಟೆ ದರವು ಸರ್ಕಾರದ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆಗಿಂತ (MSP) ಕಡಿಮೆಯಾದಾಗ ವ್ಯತ್ಯಾಸದ ಮೊತ್ತವನ್ನು ಭರಿಸುತ್ತದೆ.',
    },
    benefit: {
      en: 'Direct price-difference reimbursement or assured MSP procurement at registered APMC centers.',
      hi: 'पंजीकृत मंडी केंद्रों पर सुनिश्चित MSP खरीद या भाव के अंतर का सीधा भुगतान।',
      kn: 'ನೋಂದಾಯಿತ ಎಪಿಎಂಸಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ಖಚಿತ MSP ಖರೀದಿ ಅಥವಾ ಬೆಲೆ ವ್ಯತ್ಯಾಸದ ನೇರ ಪಾವತಿ.',
    },
    eligibility: {
      en: 'Farmers registered on state procurement / e-Samridhi portal selling notified pulses, oilseeds, cotton, or paddy.',
      hi: 'राज्य खरीद या ई-समृद्धि पोर्टल पर पंजीकृत किसान जो दालें, तिलहन, कपास या धान बेचते हैं।',
      kn: 'ರಾಜ್ಯ ಖರೀದಿ ಅಥವಾ ಇ-ಸಮೃದ್ಧಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿತ ದ್ವಿದಳ ಧಾನ್ಯ, ಹತ್ತಿ, ಭತ್ತ ಬೆಳೆಗಾರರು.',
    },
    documents: {
      en: 'Farmer Registration ID, APMC Sale Slip (Tak Patti), Land Record, Bank Details.',
      hi: 'किसान पंजीकरण आईडी, मंडी बिक्री पर्ची, भूमि रिकॉर्ड, बैंक विवरण।',
      kn: 'ರೈತ ನೋಂದಣಿ ಸಂಖ್ಯೆ, ಎಪಿಎಂಸಿ ಮಾರಾಟ ರಶೀದಿ, ಭೂ ದಾಖಲೆ, ಬ್ಯಾಂಕ್ ವಿವರ.',
    },
    applySteps: {
      en: [
        'Register on your State Agriculture Procurement / e-Samridhi portal before harvest.',
        'Sell produce at a notified APMC mandi and retain the official electronic sale slip.',
        'Price deficiency difference is credited directly to your registered bank account.',
      ],
      hi: [
        'कटाई से पहले राज्य खरीद या ई-समृद्धि पोर्टल पर अपना पंजीकरण कराएं।',
        'अधिसूचित मंडी में फसल बेचें और आधिकारिक बिक्री पर्ची सुरक्षित रखें।',
        'MSP और मंडी भाव के अंतर की राशि सीधे आपके बैंक खाते में जमा होती है।',
      ],
      kn: [
        'ಕೊಯ್ಲಿಗೆ ಮುನ್ನ ರಾಜ್ಯ ಖರೀದಿ ಅಥವಾ ಇ-ಸಮೃದ್ಧಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಿ.',
        'ಅಧಿಸೂಚಿತ ಎಪಿಎಂಸಿ ಮಂಡಿಯಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ ಅಧಿಕೃತ ರಶೀದಿ ಪಡೆಯಿರಿ.',
        'MSP ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯ ವ್ಯತ್ಯಾಸ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
      ],
    },
    officialUrl: 'https://agricoop.gov.in/',
    helplineOrPortal: 'agricoop.gov.in · Kisan Call Centre: 1800-180-1551',
  },
  {
    id: 'kcc-relief',
    code: 'KCC + MISS',
    category: 'debt_relief',
    name: {
      en: 'Kisan Credit Card (KCC) & Loss Restructuring Relief',
      hi: 'किसान क्रेडिट कार्ड (KCC) व ब्याज राहत योजना',
      kn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಮತ್ತು ಸಾಲ ಪುನರ್ರಚನೆ ನೆರವು',
    },
    summary: {
      en: 'Provides ultra-low-interest working capital (4% p.a.) and allows loan restructuring/extension if a farmer faces crop or price loss.',
      hi: 'सस्ते ब्याज (4% वार्षिक) पर खेती पूंजी और फसल नुकसान होने पर ऋण पुनर्गठन की सुविधा देता है।',
      kn: 'ಕಡಿಮೆ ಬಡ್ಡಿಯಲ್ಲಿ (ವಾರ್ಷಿಕ 4%) ಕೃಷಿ ಬಂಡವಾಳ ಮತ್ತು ಬೆಳೆ ನಷ್ಟವಾದಾಗ ಸಾಲ ಮರುಹೊಂದಾಣಿಕೆ ಸೌಲಭ್ಯ ನೀಡುತ್ತದೆ.',
    },
    benefit: {
      en: 'Loans up to ₹3 Lakh at 4% effective interest; collateral-free up to ₹1.6 Lakh; moratorium during calamity loss.',
      hi: '₹3 लाख तक का ऋण केवल 4% प्रभावी ब्याज पर; ₹1.6 लाख तक बिना गारंटी; नुकसान पर किस्त मोहलत।',
      kn: '₹3 ಲಕ್ಷದವರೆಗೆ ಕೇವಲ 4% ಬಡ್ಡಿಯಲ್ಲಿ ಸಾಲ; ₹1.6 ಲಕ್ಷದವರೆಗೆ ಆಧಾರ ರಹಿತ; ನಷ್ಟದ ಸಮಯದಲ್ಲಿ ಕಂತು ವಿನಾಯಿತಿ.',
    },
    eligibility: {
      en: 'Small, marginal, tenant farmers, and SHG/JLG cultivators.',
      hi: 'सभी छोटे, सीमांत, बटाईदार किसान और स्वयं सहायता समूह।',
      kn: 'ಎಲ್ಲಾ ಸಣ್ಣ, ಅತಿ ಸಣ್ಣ, ಗೇಣಿ ರೈತರು ಮತ್ತು ಸ್ವ-ಸಹಾಯ ಗುಂಪುಗಳು.',
    },
    documents: {
      en: 'Aadhaar, PAN/Voter ID, Land Record or Tenancy Proof, Passport Photo.',
      hi: 'आधार, पहचान पत्र, भूमि दस्तावेज या बटाई प्रमाण, पासपोर्ट फोटो।',
      kn: 'ಆಧಾರ್, ಗುರುತಿನ ಚೀಟಿ, ಭೂ ದಾಖಲೆ ಅಥವಾ ಗೇಣಿ ಪುರಾವೆ, ಫೋಟೋ.',
    },
    applySteps: {
      en: [
        'Apply online via jansamarth.in or visit your nearest Cooperative / Public Sector Bank.',
        'Submit land/crop sowing details for KCC limit approval within 14 days.',
        'If crop loss occurs, submit a written restructuring request to your branch manager.',
      ],
      hi: [
        'jansamarth.in पर ऑनलाइन आवेदन करें या अपने नजदीकी सहकारी / सरकारी बैंक जाएं।',
        'भूमि व फसल विवरण जमा करें; 14 दिनों में KCC सीमा स्वीकृत हो जाती है।',
        'फसल नुकसान होने पर बैंक शाखा प्रबंधक को ऋण पुनर्गठन का आवेदन दें।',
      ],
      kn: [
        'jansamarth.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಹತ್ತಿರದ ಸಹಕಾರಿ / ರಾಷ್ಟ್ರೀಕೃತ ಬ್ಯಾಂಕ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.',
        'ಭೂಮಿ ಮತ್ತು ಬೆಳೆ ವಿವರ ಸಲ್ಲಿಸಿ; 14 ದಿನಗಳಲ್ಲಿ KCC ಮಿತಿ ಮಂಜೂರಾಗುತ್ತದೆ.',
        'ಬೆಳೆ ನಷ್ಟವಾದಲ್ಲಿ ಬ್ಯಾಂಕ್ ವ್ಯವಸ್ಥಾಪಕರಿಗೆ ಸಾಲ ಮರುಹೊಂದಾಣಿಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
      ],
    },
    officialUrl: 'https://www.jansamarth.in/',
    helplineOrPortal: 'jansamarth.in · Nearest Cooperative / Public Bank',
  },
  {
    id: 'enwr-storage',
    code: 'e-NWR / AIF',
    category: 'price_crash',
    name: {
      en: 'Warehouse Pledge Loan (e-NWR) — Avoid Distress Sale',
      hi: 'ई-गोदाम रसीद ऋण (नुकसान में बिक्री से बचें)',
      kn: 'ಇ-ಉಗ್ರಾಣ ರಸೀದಿ ಸಾಲ (ನಷ್ಟದ ಮಾರಾಟ ತಪ್ಪಿಸಿ)',
    },
    summary: {
      en: 'Store non-perishable crops in WDRA-registered warehouses during price drops and take an instant low-interest bank loan against the stock.',
      hi: 'भाव कम होने पर अनाज को मान्यता प्राप्त गोदाम में रखकर तुरंत सस्ता बैंक ऋण प्राप्त करें और सही भाव आने पर बेचें।',
      kn: 'ಬೆಲೆ ಕುಸಿದಾಗ ಧಾನ್ಯಗಳನ್ನು ನೋಂದಾಯಿತ ಉಗ್ರಾಣದಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ, ತಕ್ಷಣ ಕಡಿಮೆ ಬಡ್ಡಿ ಸಾಲ ಪಡೆದು ಉತ್ತಮ ಬೆಲೆ ಬಂದಾಗ ಮಾರಾಟ ಮಾಡಿ.',
    },
    benefit: {
      en: 'Instant pledge loan up to 70% of crop value at ~7% interest (with interest subvention for small farmers).',
      hi: 'फसल मूल्य के 70% तक का तुरंत ऋण, छोटे किसानों के लिए ब्याज अनुदान के साथ।',
      kn: 'ಬೆಳೆ ಮೌಲ್ಯದ 70% ವರೆಗೆ ತಕ್ಷಣದ ಸಾಲ, ಸಣ್ಣ ರೈತರಿಗೆ ಬಡ್ಡಿ ಸಹಾಯಧನದೊಂದಿಗೆ.',
    },
    eligibility: {
      en: 'Farmers holding storable crops (Maize, Paddy, Tur Dal, Cotton, Arecanut) at WDRA warehouses.',
      hi: 'भंडारण योग्य फसलों (मक्का, धान, तूर दाल, कपास) वाले सभी किसान।',
      kn: 'ಸಂಗ್ರಹಿಸಬಹುದಾದ ಬೆಳೆಗಳನ್ನು (ಮೆಕ್ಕೆಜೋಳ, ಭತ್ತ, ತೊಗರಿ, ಹತ್ತಿ, ಅಡಿಕೆ) ಹೊಂದಿರುವ ರೈತರು.',
    },
    documents: {
      en: 'Electronic Negotiable Warehouse Receipt (e-NWR), Aadhaar, Bank Account.',
      hi: 'ई-गोदाम रसीद (e-NWR), आधार कार्ड, बैंक खाता।',
      kn: 'ಇ-ಉಗ್ರಾಣ ರಸೀದಿ (e-NWR), ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಖಾತೆ.',
    },
    applySteps: {
      en: [
        'Locate a WDRA-accredited warehouse near your APMC on wdra.gov.in.',
        'Deposit your graded dry produce and receive an electronic e-NWR receipt.',
        'Present the e-NWR at your bank to receive up to 70% pledge loan while waiting for higher prices.',
      ],
      hi: [
        'wdra.gov.in पर अपने नजदीकी WDRA मान्यता प्राप्त गोदाम का पता लगाएं।',
        'सूखी व साफ उपज गोदाम में जमा करके इलेक्ट्रॉनिक e-NWR रसीद प्राप्त करें।',
        'बैंक में e-NWR दिखाकर तुरंत 70% तक ऋण लें और बेहतर भाव आने पर फसल बेचें।',
      ],
      kn: [
        'wdra.gov.in ನಲ್ಲಿ ನಿಮ್ಮ ಸಮೀಪದ WDRA ಮಾನ್ಯತೆ ಪಡೆದ ಉಗ್ರಾಣವನ್ನು ಹುಡುಕಿ.',
        'ಒಣಗಿದ ಬೆಳೆಯನ್ನು ಸಂಗ್ರಹಿಸಿ ಎಲೆಕ್ಟ್ರಾನಿಕ್ e-NWR ರಶೀದಿ ಪಡೆಯಿರಿ.',
        'ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ e-NWR ನೀಡಿ 70% ವರೆಗೆ ಸಾಲ ಪಡೆದು ಉತ್ತಮ ಬೆಲೆ ಬಂದಾಗ ಮಾರಾಟ ಮಾಡಿ.',
      ],
    },
    officialUrl: 'https://wdra.gov.in/',
    helplineOrPortal: 'wdra.gov.in · enam.gov.in',
  },
  {
    id: 'allied-livelihood',
    code: 'NLM / PM-KUSUM',
    category: 'livelihood',
    name: {
      en: 'Allied Livelihood & Solar Income Support (NLM + PM-KUSUM)',
      hi: 'पशुपालन, डेयरी व सौर आय सहायता योजना (NLM / PM-KUSUM)',
      kn: 'ಪಶುಸಂಗೋಪನೆ, ಹೈನುಗಾರಿಕೆ ಮತ್ತು ಸೌರ ಆದಾಯ ಯೋಜನೆ',
    },
    summary: {
      en: 'Helps farmers build steady year-round secondary income via dairy, goat/poultry farming, beekeeping, and subsidized solar pumps when crop income drops.',
      hi: 'फसल नुकसान के बावजूद डेयरी, बकरी/मुर्गी पालन, मधुमक्खी पालन और सोलर पंप पर सब्सिडी से स्थायी अतिरिक्त आय।',
      kn: 'ಬೆಳೆ ನಷ್ಟದ ನಡುವೆಯೂ ಹೈನುಗಾರಿಕೆ, ಕುರಿ/ಕೋಳಿ ಸಾಕಾಣಿಕೆ, ಜೇನು ಕೃಷಿ ಮತ್ತು ಸಬ್ಸಿಡಿ ಸೌರ ಪಂಪ್‌ಗಳಿಂದ ನಿರಂತರ ಆದಾಯ.',
    },
    benefit: {
      en: '50% capital subsidy under National Livestock Mission & up to 60% subsidy on standalone solar pumps.',
      hi: 'राष्ट्रीय पशुधन मिशन के तहत 50% सब्सिडी और सोलर पंप पर 60% तक अनुदान।',
      kn: 'ರಾಷ್ಟ್ರೀಯ ಜಾನುವಾರು ಮಿಷನ್ ಅಡಿ 50% ಸಹಾಯಧನ ಮತ್ತು ಸೌರ ಪಂಪ್‌ಗಳಿಗೆ 60% ವರೆಗೆ ಸಬ್ಸಿಡಿ.',
    },
    eligibility: {
      en: 'Small & marginal farmers, rural women SHGs, and farmers in drought/loss-prone blocks.',
      hi: 'छोटे व सीमांत किसान, महिला स्वयं सहायता समूह और सूखा/नुकसान प्रभावित क्षेत्र के किसान।',
      kn: 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರು, ಮಹಿಳಾ ಸ್ವ-ಸಹಾಯ ಗುಂಪುಗಳು ಮತ್ತು ನಷ್ಟ ಪೀಡಿತ ಪ್ರದೇಶದ ರೈತರು.',
    },
    documents: {
      en: 'Aadhaar, Land/Residence Proof, Bank Passbook, Project Proposal (assisted by Gram Panchayat / KVK).',
      hi: 'आधार कार्ड, निवास/भूमि प्रमाण, बैंक पासबुक, परियोजना विवरण (KVK सहायता से)।',
      kn: 'ಆಧಾರ್ ಕಾರ್ಡ್, ವಾಸಸ್ಥಳ/ಭೂ ದಾಖಲೆ, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಯೋಜನಾ ವರದಿ.',
    },
    applySteps: {
      en: [
        'Visit nlm.udyamimitra.in or contact your District Veterinary / Agriculture Officer.',
        'Select dairy, goat, poultry, or solar pump module and submit Aadhaar + bank details.',
        'Subsidy is released directly upon unit verification.',
      ],
      hi: [
        'nlm.udyamimitra.in पर जाएं या जिला पशुपालन / कृषि कार्यालय से संपर्क करें।',
        'डेयरी, बकरी पालन, मुर्गी पालन या सोलर पंप योजना चुनें और दस्तावेज़ अपलोड करें।',
        'सत्यापन के बाद अनुदान राशि सीधे खाते में जारी की जाती है।',
      ],
      kn: [
        'nlm.udyamimitra.in ಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ಜಿಲ್ಲಾ ಪಶುಸಂಗೋಪನೆ / ಕೃಷಿ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        'ಹೈನುಗಾರಿಕೆ, ಕುರಿ/ಕೋಳಿ ಸಾಕಾಣಿಕೆ ಅಥವಾ ಸೌರ ಪಂಪ್ ಘಟಕ ಆಯ್ಕೆಮಾಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
        'ಪರಿಶೀಲನೆಯ ನಂತರ ಸಬ್ಸಿಡಿ ಮೊತ್ತ ನೇರವಾಗಿ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.',
      ],
    },
    officialUrl: 'https://nlm.udyamimitra.in/',
    helplineOrPortal: 'nlm.udyamimitra.in · KVK Helpline: 1800-180-1551',
  },
  {
    id: 'krishi-sinchayee',
    code: 'PMKSY / RKVY',
    category: 'crop_damage',
    name: {
      en: 'Drip Irrigation & Farm Pond Subsidy (PMKSY / Krishi Bhagya)',
      hi: 'ड्रिप सिंचाई व खेत तालाब अनुदान योजना (PMKSY)',
      kn: 'ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ಹೊಂಡ ಸಬ್ಸಿಡಿ ಯೋಜನೆ (PMKSY / ಕೃಷಿ ಭಾಗ್ಯ)',
    },
    summary: {
      en: 'Protects farmers against future drought and rainfall failure by funding farm ponds, micro-irrigation, and polyhouse shade nets.',
      hi: 'भविष्य में सूखे से फसल बचाने के लिए ड्रिप/स्प्रिंकलर सिंचाई और खेत तालाब निर्माण पर भारी सरकारी अनुदान।',
      kn: 'ಬರಗಾಲದಿಂದ ಬೆಳೆಗಳನ್ನು ರಕ್ಷಿಸಲು ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಾಣಕ್ಕೆ ಸರ್ಕಾರಿ ಸಹಾಯಧನ.',
    },
    benefit: {
      en: '55%–90% subsidy on drip/sprinkler irrigation and rainwater harvesting ponds for small & marginal farmers.',
      hi: 'छोटे व सीमांत किसानों को ड्रिप/स्प्रिंकलर और खेत तालाब पर 55% से 90% तक सब्सिडी।',
      kn: 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ಹೊಂಡಕ್ಕೆ 55%–90% ವರೆಗೆ ಸಬ್ಸಿಡಿ.',
    },
    eligibility: {
      en: 'Farmers with cultivable land (priority for rain-fed and SC/ST/smallholder farmers).',
      hi: 'खेती योग्य भूमि वाले सभी किसान (वर्षा आधारित व छोटे किसानों को प्राथमिकता)।',
      kn: 'ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತರು (ಮಳೆಯಾಶ್ರಿತ ಮತ್ತು ಸಣ್ಣ ರೈತರಿಗೆ ಆದ್ಯತೆ).',
    },
    documents: {
      en: 'Aadhaar Card, RTC/Land Record, Caste/Small Farmer Certificate (if applicable), Bank Passbook.',
      hi: 'आधार कार्ड, भूमि खतौनी, छोटे किसान प्रमाण पत्र, बैंक पासबुक।',
      kn: 'ಆಧಾರ್ ಕಾರ್ಡ್, RTC ಭೂ ದಾಖಲೆ, ಸಣ್ಣ ರೈತ ಪ್ರಮಾಣಪತ್ರ, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್.',
    },
    applySteps: {
      en: [
        'Apply at your local Raitha Samparka Kendra (RSK) / Block Agriculture Office or pmksy.gov.in.',
        'Receive technical inspection and approval for drip pipes or pond excavation.',
        'Subsidy is credited after installation inspection.',
      ],
      hi: [
        'अपने ब्लॉक कृषि कार्यालय या pmksy.gov.in पोर्टल पर आवेदन करें।',
        'कृषि अधिकारी द्वारा खेत निरीक्षण और स्वीकृति प्राप्त करें।',
        'सिंचाई प्रणाली लगने के बाद अनुदान राशि खाते में आ जाती है।',
      ],
      kn: [
        'ನಿಮ್ಮ ಸಮೀಪದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK) ಅಥವಾ pmksy.gov.in ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
        'ತಾಂತ್ರಿಕ ಪರಿಶೀಲನೆಯ ನಂತರ ಹನಿ ನೀರಾವರಿ ಅಥವಾ ಕೃಷಿ ಹೊಂಡಕ್ಕೆ ಅನುಮೋದನೆ ಪಡೆಯಿರಿ.',
        'ಅಳವಡಿಕೆ ಪರಿಶೀಲನೆಯ ನಂತರ ಸಬ್ಸಿಡಿ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.',
      ],
    },
    officialUrl: 'https://pmksy.gov.in/',
    helplineOrPortal: 'pmksy.gov.in · Local Raitha Samparka Kendra',
  },
  {
    id: 'pm-fme',
    code: 'PM-FME',
    category: 'livelihood',
    name: {
      en: 'PM-FME Value-Addition & Micro Processing Subsidy',
      hi: 'पीएम-एफएमई (फसल प्रसंस्करण एवं उद्यम सब्सिडी)',
      kn: 'ಪಿಎಂ-ಎಫ್‌ಎಂಇ ಮೌಲ್ಯವರ್ಧನೆ ಮತ್ತು ಆಹಾರ ಸಂಸ್ಕರಣಾ ಸಬ್ಸಿಡಿ',
    },
    summary: {
      en: 'When raw crop prices crash (like Tomato, Onion, Potato), convert harvest into puree, dehydrated flakes, flour, or spices with government grant.',
      hi: 'टमाटर, प्याज या आलू के भाव गिरने पर उन्हें प्यूरी, पाउडर, चिप्स या मसालों में बदलकर अधिक मुनाफा कमाने की योजना।',
      kn: 'ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ, ಆಲೂಗಡ್ಡೆ ಬೆಲೆ ಕುಸಿದಾಗ ಅವುಗಳನ್ನು ಪ್ಯೂರಿ, ಪುಡಿ ಅಥವಾ ಮೌಲ್ಯವರ್ಧಿತ ಉತ್ಪನ್ನಗಳನ್ನಾಗಿ ಮಾಡಲು ಸಬ್ಸಿಡಿ.',
    },
    benefit: {
      en: '35% credit-linked capital subsidy up to ₹10 Lakh per unit plus ₹40,000 seed capital for SHG members.',
      hi: 'प्रति इकाई ₹10 लाख तक 35% पूंजीगत सब्सिडी और महिला समूहों को ₹40,000 प्रारंभिक पूंजी।',
      kn: 'ಪ್ರತಿ ಘಟಕಕ್ಕೆ ₹10 ಲಕ್ಷದವರೆಗೆ 35% ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ ಮತ್ತು ಸ್ವ-ಸಹಾಯ ಗುಂಪುಗಳಿಗೆ ₹40,000 ಬೀಜ ಬಂಡವಾಳ.',
    },
    eligibility: {
      en: 'Individual farmers, FPOs, cooperatives, and rural Self-Help Groups (SHGs).',
      hi: 'व्यक्तिगत किसान, FPO, सहकारी समितियाँ और ग्रामीण स्वयं सहायता समूह।',
      kn: 'ವೈಯಕ್ತಿಕ ರೈತರು, FPOಗಳು, ಸಹಕಾರಿ ಸಂಘಗಳು ಮತ್ತು ಗ್ರಾಮೀಣ ಸ್ವ-ಸಹಾಯ ಗುಂಪುಗಳು.',
    },
    documents: {
      en: 'Aadhaar, PAN, Bank Statement, Simple Unit Cost Estimate (District Resource Person helps free).',
      hi: 'आधार, पैन कार्ड, बैंक स्टेटमेंट, प्रोजेक्ट लागत विवरण (जिला संसाधन व्यक्ति निःशुल्क मदद करते हैं)।',
      kn: 'ಆಧಾರ್, ಪ್ಯಾನ್, ಬ್ಯಾಂಕ್ ವಿವರ, ಘಟಕದ ವೆಚ್ಚದ ಅಂದಾಜು (ಜಿಲ್ಲಾ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ ಉಚಿತ ನೆರವು ನೀಡುತ್ತಾರೆ).',
    },
    applySteps: {
      en: [
        'Visit pmfme.mofpi.gov.in and register under "Individual / Group Micro Enterprise".',
        'Connect with your District Resource Person (DRP) for free project DPR preparation.',
        'Bank sanctions loan with 35% government subsidy support.',
      ],
      hi: [
        'pmfme.mofpi.gov.in पर "Individual / Group Micro Enterprise" में पंजीकरण करें।',
        'मुफ्त प्रोजेक्ट रिपोर्ट के लिए जिला संसाधन व्यक्ति (DRP) की मदद लें।',
        'बैंक से ऋण स्वीकृत होते ही 35% सरकारी सब्सिडी जुड़ जाती है।',
      ],
      kn: [
        'pmfme.mofpi.gov.in ನಲ್ಲಿ "Individual / Group Micro Enterprise" ಅಡಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಿ.',
        'ಉಚಿತ ಯೋಜನಾ ವರದಿಗಾಗಿ ಜಿಲ್ಲಾ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಯ (DRP) ಸಹಾಯ ಪಡೆಯಿರಿ.',
        'ಬ್ಯಾಂಕ್ ಸಾಲ ಮಂಜೂರಾದ ನಂತರ 35% ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಲಭಿಸುತ್ತದೆ.',
      ],
    },
    officialUrl: 'https://pmfme.mofpi.gov.in/',
    helplineOrPortal: 'pmfme.mofpi.gov.in · Toll-Free: 1800-11-1979',
  },
];

export function recommendSchemesForSituation(params: {
  crop: CropAnalysis;
  tier: QualitySizeAnalysis;
  isLoss: boolean;
  situationFilter?: LossSituation | 'auto';
}): GovernmentScheme[] {
  const { crop, tier, isLoss, situationFilter = 'auto' } = params;

  if (situationFilter !== 'auto') {
    const exact = GOVERNMENT_SCHEMES.filter((s) => s.category === situationFilter);
    const others = GOVERNMENT_SCHEMES.filter((s) => s.category !== situationFilter);
    return [...exact, ...others];
  }

  const prioritizedIds: string[] = [];

  if (tier.trendDirection === 'down' || tier.forecastDirection === 'decrement' || isLoss) {
    prioritizedIds.push('pm-aasha');
    if (crop.perishability === 'low') {
      prioritizedIds.push('enwr-storage');
    } else {
      prioritizedIds.push('pm-fme');
    }
    prioritizedIds.push('pm-kisan', 'kcc-relief', 'pmfby', 'allied-livelihood', 'krishi-sinchayee');
  } else {
    prioritizedIds.push(
      'pm-kisan',
      'pmfby',
      'kcc-relief',
      'allied-livelihood',
      'krishi-sinchayee',
      'pm-aasha',
      'enwr-storage',
      'pm-fme'
    );
  }

  const seen = new Set<string>();
  const ordered: GovernmentScheme[] = [];
  for (const id of prioritizedIds) {
    if (seen.has(id)) continue;
    const found = GOVERNMENT_SCHEMES.find((s) => s.id === id);
    if (found) {
      ordered.push(found);
      seen.add(id);
    }
  }
  return ordered;
}
