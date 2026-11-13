import type { Language } from '../types.ts';

export interface TranslationBundle {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    chatbot: string;
    mandiFinder: string;
    schemes: string;
    alerts: string;
    profile: string;
  };
  login: {
    heading: string;
    subheading: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    placeLabel: string;
    placePlaceholder: string;
    localityLabel: string;
    localityPlaceholder: string;
    languageLabel: string;
    submitButton: string;
    validationPhone: string;
    validationRequired: string;
    heroCaption: string;
    heroSubcaption: string;
  };
  header: {
    welcome: string;
    switchFarmer: string;
    language: string;
  };
  dashboard: {
    marketOverview: string;
    searchCrop: string;
    allCrops: string;
    gainersOnly: string;
    sellNowFilter: string;
    bestCurrentPrice: string;
    dailyChange: string;
    fiveDayForecast: string;
    advisoryDecision: string;
    sellNow: string;
    holdWait: string;
    priceTrendTitle: string;
    historicalLabel: string;
    predictedLabel: string;
    perQuintal: string;
    expectedIncrement: string;
    expectedDecrement: string;
    askAdvisorBtn: string;
    setPriceAlertBtn: string;
    mostProfitableMandi: string;
    netProfitEstimate: string;
    comparedAcross: string;
    mandisLabel: string;
    confidence: string;
    noResults: string;
    resetFilter: string;
    qualitySelectorLabel: string;
    qualityBreakdownTitle: string;
    qualityGradeCol: string;
    qualitySizeCol: string;
    qualityPriceCol: string;
    qualityChangeCol: string;
    qualityForecastCol: string;
    qualityAdviceCol: string;
  };
  mandiTable: {
    title: string;
    subtitle: string;
    mandiName: string;
    district: string;
    modalPrice: string;
    distance: string;
    transportCost: string;
    netProfit: string;
    arrivals: string;
    topProfitTag: string;
    quantityLabel: string;
    cultivationCostLabel: string;
    totalProjectedNet: string;
    estimatedProfitLoss: string;
    profitStatus: string;
    lossStatus: string;
  };
  schemes: {
    title: string;
    subtitle: string;
    lossBannerTitle: string;
    lossBannerPriceDip: string;
    lossBannerNegativeMargin: string;
    alwaysVisibleTitle: string;
    alwaysVisibleSubtitle: string;
    viewAllSchemes: string;
    searchPlaceholder: string;
    situationLabel: string;
    situations: {
      auto: string;
      price_crash: string;
      crop_damage: string;
      debt_relief: string;
      livelihood: string;
    };
    benefitLabel: string;
    eligibilityLabel: string;
    documentsLabel: string;
    howToApplyLabel: string;
    portalLabel: string;
    visitPortal: string;
    askHowToApply: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    thinking: string;
    voiceListen: string;
    voiceListening: string;
    voiceTapToStop: string;
    voiceProcessing: string;
    micPermissionError: string;
    readAloud: string;
    stopReading: string;
    clearChat: string;
    quickPromptsLabel: string;
    quickPrompts: string[];
    welcomeMessage: string;
    cardLabels: {
      bestPrice: string;
      marketMove: string;
      forecast5d: string;
      decision: string;
      topMandi: string;
      netProfit: string;
      sell: string;
      hold: string;
      up: string;
      down: string;
    };
  };
  alerts: {
    title: string;
    subtitle: string;
    checkNowBtn: string;
    enableBrowserBtn: string;
    browserEnabledLabel: string;
    browserBlockedHint: string;
    markAllRead: string;
    clearAll: string;
    unreadLabel: string;
    createRuleTitle: string;
    cropLabel: string;
    gradeLabel: string;
    targetPriceLabel: string;
    minPercentLabel: string;
    addRuleBtn: string;
    activeRulesTitle: string;
    noRulesText: string;
    removeRule: string;
    inboxTitle: string;
    noNotificationsText: string;
    reasonDailyGain: string;
    reasonTargetReached: string;
    reasonLiveSurge: string;
    priceRoseFrom: string;
    toLabel: string;
    viewCropBtn: string;
    toastTitle: string;
    dismissBtn: string;
  };
  profile: {
    title: string;
    subtitle: string;
    saveChanges: string;
    savedToast: string;
    logout: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    appName: 'MANDIMITRA',
    tagline: 'Agricultural Market Intelligence & Advisory',
    nav: {
      dashboard: 'Market Dashboard',
      chatbot: 'Price Advisor Chat',
      mandiFinder: 'Profitable Mandis',
      schemes: 'Loss Relief & Schemes',
      alerts: 'Price Alerts',
      profile: 'Farmer Profile',
    },
    login: {
      heading: 'Farmer Sign In',
      subheading: 'Enter your farm details to unlock localized mandi rates, 5-day price predictions, and multilingual AI advisory.',
      nameLabel: 'Farmer Name',
      namePlaceholder: 'e.g. Ramesh Gowda',
      phoneLabel: 'Mobile Number',
      phonePlaceholder: '10-digit phone number',
      placeLabel: 'Place (District / Taluk)',
      placePlaceholder: 'e.g. Davanagere, Hubballi, Nashik',
      localityLabel: 'Locality (Village / Hobli)',
      localityPlaceholder: 'e.g. Harihar, Channagiri',
      languageLabel: 'Preferred Language',
      submitButton: 'Open My Mandi Dashboard',
      validationPhone: 'Please enter a valid 10-digit mobile number.',
      validationRequired: 'Please fill in all required farmer details.',
      heroCaption: 'Real-time mandi rates, stock-style momentum & profit routing.',
      heroSubcaption: 'Built for Indian farmers in Kannada, Hindi & English.',
    },
    header: {
      welcome: 'Farmer',
      switchFarmer: 'Switch Farmer',
      language: 'Language',
    },
    dashboard: {
      marketOverview: 'Live Commodity Market',
      searchCrop: 'Search crop...',
      allCrops: 'All Crops',
      gainersOnly: 'Price Gainers',
      sellNowFilter: 'Sell Signals',
      bestCurrentPrice: 'Current Best Price',
      dailyChange: '24h Market Change',
      fiveDayForecast: '5-Day Price Forecast',
      advisoryDecision: 'Trade Advisory',
      sellNow: 'SELL NOW',
      holdWait: 'HOLD / WAIT',
      priceTrendTitle: '14-Day History & 5-Day Forecast',
      historicalLabel: '14-Day Actual',
      predictedLabel: '5-Day Predicted',
      perQuintal: '/ Qtl',
      expectedIncrement: 'Expected Rise',
      expectedDecrement: 'Expected Dip',
      askAdvisorBtn: 'Ask AI Advisor',
      setPriceAlertBtn: 'Set Price Alert',
      mostProfitableMandi: 'Most Profitable Mandi',
      netProfitEstimate: 'Est. Net Profit',
      comparedAcross: 'Calculated from',
      mandisLabel: 'mandis',
      confidence: 'Model Confidence',
      noResults: 'No crops match your current search or filter.',
      resetFilter: 'Show All Crops',
      qualitySelectorLabel: 'Quality & Size Grade',
      qualityBreakdownTitle: 'Price Analysis by Product Quality & Size',
      qualityGradeCol: 'Quality Grade',
      qualitySizeCol: 'Size & Quality Spec',
      qualityPriceCol: 'Best Price',
      qualityChangeCol: '24h Change',
      qualityForecastCol: '5-Day Forecast',
      qualityAdviceCol: 'Advisory',
    },
    mandiTable: {
      title: 'Mandi Profit Comparison',
      subtitle: 'Ranked by net profit after subtracting estimated transport & 1.5% APMC charges from your location',
      mandiName: 'Mandi / APMC',
      district: 'District / State',
      modalPrice: 'Modal Price',
      distance: 'Est. Distance',
      transportCost: 'Transport Cost',
      netProfit: 'Net Profit / Qtl',
      arrivals: 'Arrivals',
      topProfitTag: 'Highest Profit',
      quantityLabel: 'Your Harvest Quantity (Quintals)',
      cultivationCostLabel: 'Est. Cost / Qtl (₹)',
      totalProjectedNet: 'Estimated Total Net Payout',
      estimatedProfitLoss: 'Net Margin After Cultivation Cost',
      profitStatus: 'Net Profit',
      lossStatus: 'Loss Detected',
    },
    schemes: {
      title: 'Government Schemes for Loss Recovery & Livelihood',
      subtitle: 'If market prices drop or your harvest yields a loss, these government income, insurance, and credit schemes help sustain your livelihood.',
      lossBannerTitle: 'Loss & Price-Dip Livelihood Support Recommended',
      lossBannerPriceDip: 'Market prices or forecast for this grade show a downward trend. Review these government support schemes to protect your income.',
      lossBannerNegativeMargin: 'At your cultivation cost, selling right now results in a net loss. These government relief & livelihood schemes can support your recovery.',
      alwaysVisibleTitle: 'Government Schemes for Farmers & Livelihood Support',
      alwaysVisibleSubtitle: 'Explore income transfers, crop insurance, 4% KCC loans, and price-crash protection schemes.',
      viewAllSchemes: 'Open All 8 Schemes',
      searchPlaceholder: 'Search scheme (e.g. PM-KISAN, Insurance, Loan)...',
      situationLabel: 'Filter by Support Need',
      situations: {
        auto: 'Recommended for Current Crop',
        price_crash: 'Market Price Crash',
        crop_damage: 'Crop / Weather Damage',
        debt_relief: 'Loan & Credit Relief',
        livelihood: 'Livelihood & Extra Income',
      },
      benefitLabel: 'Key Benefit',
      eligibilityLabel: 'Who Can Apply',
      documentsLabel: 'Required Documents',
      howToApplyLabel: 'How to Apply',
      portalLabel: 'Official Portal / Helpline',
      visitPortal: 'Official Portal',
      askHowToApply: 'Ask AI How to Apply',
    },
    chatbot: {
      title: 'MANDIMITRA Price Advisor',
      subtitle: 'Ask about any crop in English, Hindi, or Kannada to check live % movement, 5-day forecast, Sell/Hold signal, and best mandi.',
      placeholder: 'Ask e.g. "Should I sell Onion today or wait?"',
      send: 'Analyze',
      thinking: 'Analyzing mandi trends & forecast...',
      voiceListen: 'Voice Input',
      voiceListening: 'Listening...',
      voiceTapToStop: 'Tap mic to send',
      voiceProcessing: 'Transcribing voice & preparing audio reply...',
      micPermissionError: 'Microphone access was denied. Please allow microphone permission in your browser.',
      readAloud: 'Listen',
      stopReading: 'Stop',
      clearChat: 'New Chat',
      quickPromptsLabel: 'Suggested Questions',
      quickPrompts: [
        'Should I sell Onion today or hold for 5 days?',
        'Which mandi gives the highest profit for Tomato near me?',
        'Check Maize price movement and 5-day prediction.',
        'I got a crop loss — which government scheme helps me lead life?',
      ],
      welcomeMessage:
        'Namaste! I am MANDIMITRA, your agricultural price advisor. Ask me about any crop — I will check whether today’s price rose or fell (%), predict the next 5 days, tell you whether to SELL or HOLD, and find your most profitable mandi.',
      cardLabels: {
        bestPrice: 'Best Price',
        marketMove: 'Market Move',
        forecast5d: '5-Day Forecast',
        decision: 'Advisory',
        topMandi: 'Top Profit Mandi',
        netProfit: 'Net Profit',
        sell: 'SELL NOW',
        hold: 'HOLD / WAIT',
        up: 'Increased',
        down: 'Decreased',
      },
    },
    alerts: {
      title: 'Price Increase Alerts & Notifications',
      subtitle: 'Get instant alerts when crop prices increase, cross your target price, or surge in nearby mandis.',
      checkNowBtn: 'Check Live Price Surge',
      enableBrowserBtn: 'Enable Browser Alerts',
      browserEnabledLabel: 'Browser Alerts Enabled',
      browserBlockedHint: 'Browser notification permission is blocked; in-app alerts remain active.',
      markAllRead: 'Mark All Read',
      clearAll: 'Clear Feed',
      unreadLabel: 'Unread',
      createRuleTitle: 'Create Price Increase Alert',
      cropLabel: 'Crop',
      gradeLabel: 'Quality & Size Grade',
      targetPriceLabel: 'Target Price (₹/Qtl)',
      minPercentLabel: 'Min Rise (%)',
      addRuleBtn: 'Save Price Alert',
      activeRulesTitle: 'Your Active Alert Rules',
      noRulesText: 'No custom price alerts added yet. Add a target price above to get notified automatically.',
      removeRule: 'Remove',
      inboxTitle: 'Price Increase Notifications',
      noNotificationsText: 'No price increase notifications yet. Click "Check Live Price Surge" to scan for market gains.',
      reasonDailyGain: 'Daily Price Increase',
      reasonTargetReached: 'Target Price Reached',
      reasonLiveSurge: 'Live Market Surge',
      priceRoseFrom: 'Price increased from',
      toLabel: 'to',
      viewCropBtn: 'Open Market & Sell Plan',
      toastTitle: 'Crop Price Increased',
      dismissBtn: 'Dismiss',
    },
    profile: {
      title: 'Farmer Profile & Location Settings',
      subtitle: 'Update your locality and preferred language to recalculate mandi transport costs and advisor responses.',
      saveChanges: 'Save Profile',
      savedToast: 'Profile updated successfully.',
      logout: 'Sign Out / Switch Farmer',
    },
  },
  hi: {
    appName: 'मंडीमित्र (MANDIMITRA)',
    tagline: 'कृषि बाजार विश्लेषण एवं किसान सलाहकार',
    nav: {
      dashboard: 'बाज़ार डैशबोर्ड',
      chatbot: 'भाव सलाहकार चैट',
      mandiFinder: 'लाभदायक मंडियाँ',
      schemes: 'सरकारी योजनाएं व राहत',
      alerts: 'भाव बढ़ोतरी अलर्ट',
      profile: 'किसान प्रोफ़ाइल',
    },
    login: {
      heading: 'किसान लॉगिन',
      subheading: 'अपने क्षेत्र के मंडी भाव, 5-दिन का मूल्य पूर्वानुमान और हिंदी सलाह पाने के लिए विवरण दर्ज करें।',
      nameLabel: 'किसान का नाम',
      namePlaceholder: 'उदा. रमेश गौड़ा',
      phoneLabel: 'मोबाइल नंबर',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर',
      placeLabel: 'स्थान (जिला / तहसील)',
      placePlaceholder: 'उदा. इंदौर, नासिक, दावणगेरे',
      localityLabel: 'गाँव / क्षेत्र',
      localityPlaceholder: 'उदा. महू, चन्नगिरी',
      languageLabel: 'पसंदीदा भाषा',
      submitButton: 'मेरा मंडी डैशबोर्ड खोलें',
      validationPhone: 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।',
      validationRequired: 'कृपया सभी आवश्यक जानकारी भरें।',
      heroCaption: 'ताज़ा मंडी भाव, स्टॉक-स्टाइल उतार-चढ़ाव और अधिकतम लाभ वाली मंडी।',
      heroSubcaption: 'कन्नड़, हिंदी और अंग्रेज़ी में भारतीय किसानों के लिए निर्मित।',
    },
    header: {
      welcome: 'किसान',
      switchFarmer: 'किसान बदलें',
      language: 'भाषा',
    },
    dashboard: {
      marketOverview: 'लाइव कृषि बाज़ार भाव',
      searchCrop: 'फसल खोजें...',
      allCrops: 'सभी फसलें',
      gainersOnly: 'बढ़ते भाव',
      sellNowFilter: 'बेचने के संकेत',
      bestCurrentPrice: 'वर्तमान सर्वोत्तम भाव',
      dailyChange: '24 घंटे में बदलाव',
      fiveDayForecast: '5-दिन का अनुमान',
      advisoryDecision: 'बिक्री सलाह',
      sellNow: 'अभी बेचें',
      holdWait: 'रुकें (भाव बढ़ेगा)',
      priceTrendTitle: '14-दिन का इतिहास और 5-दिन का पूर्वानुमान',
      historicalLabel: '14-दिन का वास्तविक भाव',
      predictedLabel: '5-दिन का अनुमानित भाव',
      perQuintal: '/ क्विंटल',
      expectedIncrement: 'संभावित बढ़ोतरी',
      expectedDecrement: 'संभावित गिरावट',
      askAdvisorBtn: 'चैटबॉट से पूछें',
      setPriceAlertBtn: 'भाव अलर्ट लगाएं',
      mostProfitableMandi: 'सबसे लाभदायक मंडी',
      netProfitEstimate: 'अनुमानित शुद्ध लाभ',
      comparedAcross: 'तुलना:',
      mandisLabel: 'मंडियाँ',
      confidence: 'मॉडल सटीकता',
      noResults: 'आपकी खोज से मेल खाने वाली कोई फसल नहीं मिली।',
      resetFilter: 'सभी फसलें दिखाएं',
      qualitySelectorLabel: 'गुणवत्ता और आकार ग्रेड',
      qualityBreakdownTitle: 'उत्पाद गुणवत्ता और आकार के अनुसार मूल्य विश्लेषण',
      qualityGradeCol: 'गुणवत्ता ग्रेड',
      qualitySizeCol: 'आकार और गुणवत्ता विवरण',
      qualityPriceCol: 'सर्वोत्तम भाव',
      qualityChangeCol: '24 घंटे बदलाव',
      qualityForecastCol: '5-दिन अनुमान',
      qualityAdviceCol: 'सलाह',
    },
    mandiTable: {
      title: 'मंडी शुद्ध लाभ तुलना',
      subtitle: 'आपके स्थान से परिवहन लागत और 1.5% मंडी शुल्क घटाकर शुद्ध लाभ के आधार पर रैंकिंग',
      mandiName: 'मंडी / APMC',
      district: 'जिला / राज्य',
      modalPrice: 'मॉडल भाव',
      distance: 'अनुमानित दूरी',
      transportCost: 'परिवहन खर्च',
      netProfit: 'शुद्ध लाभ / क्विंटल',
      arrivals: 'आवक',
      topProfitTag: 'सर्वाधिक लाभ',
      quantityLabel: 'आपकी फसल की मात्रा (क्विंटल में)',
      cultivationCostLabel: 'लागत खर्च / क्विंटल (₹)',
      totalProjectedNet: 'अनुमानित कुल शुद्ध आय',
      estimatedProfitLoss: 'लागत घटाकर शुद्ध लाभ / हानि',
      profitStatus: 'शुद्ध लाभ',
      lossStatus: 'हानि का संकेत',
    },
    schemes: {
      title: 'फसल हानि व आजीविका के लिए सरकारी योजनाएं',
      subtitle: 'यदि बाजार भाव गिरने या फसल खराब होने से आपको नुकसान होता है, तो ये सरकारी योजनाएं आपके जीवन यापन और आर्थिक सुधार में मदद करती हैं।',
      lossBannerTitle: 'नुकसान व कम भाव से बचाव हेतु सरकारी योजना सहायता',
      lossBannerPriceDip: 'इस ग्रेड के बाजार भाव या 5-दिन के अनुमान में गिरावट दिख रही है। अपनी आय सुरक्षित करने के लिए ये सरकारी योजनाएं देखें।',
      lossBannerNegativeMargin: 'आपकी खेती लागत के अनुसार अभी बिक्री पर नुकसान हो रहा है। ये सरकारी राहत और आजीविका योजनाएं आपकी मदद कर सकती हैं।',
      alwaysVisibleTitle: 'किसानों व आजीविका के लिए सरकारी योजनाएं',
      alwaysVisibleSubtitle: 'सीधी आय सहायता, फसल बीमा, 4% KCC ऋण और कम भाव सुरक्षा योजनाएं देखें।',
      viewAllSchemes: 'सभी 8 योजनाएं देखें',
      searchPlaceholder: 'योजना खोजें (जैसे PM-KISAN, बीमा, ऋण)...',
      situationLabel: 'सहायता श्रेणी चुनें',
      situations: {
        auto: 'वर्तमान फसल के लिए उपयुक्त',
        price_crash: 'बाजार भाव में गिरावट',
        crop_damage: 'फसल / मौसम से नुकसान',
        debt_relief: 'ऋण व ब्याज राहत',
        livelihood: 'आजीविका व अतिरिक्त आय',
      },
      benefitLabel: 'मुख्य लाभ',
      eligibilityLabel: 'पात्रता',
      documentsLabel: 'आवश्यक दस्तावेज़',
      howToApplyLabel: 'आवेदन कैसे करें',
      portalLabel: 'आधिकारिक पोर्टल / हेल्पलाइन',
      visitPortal: 'आधिकारिक पोर्टल',
      askHowToApply: 'आवेदन प्रक्रिया पूछें',
    },
    chatbot: {
      title: 'मंडीमित्र भाव सलाहकार',
      subtitle: 'किसी भी फसल के बारे में पूछें — भाव बढ़ा या घटा (%), 5-दिन का अनुमान, बेचें या रुकें, और सबसे लाभदायक मंडी जानें।',
      placeholder: 'पूछें उदा. "क्या मुझे आज प्याज बेचना चाहिए या रुकना चाहिए?"',
      send: 'विश्लेषण करें',
      thinking: 'मंडी भाव और भविष्य के रुझान का विश्लेषण हो रहा है...',
      voiceListen: 'बोलकर पूछें',
      voiceListening: 'सुन रहे हैं...',
      voiceTapToStop: 'भेजने के लिए माइक दबाएं',
      voiceProcessing: 'आवाज़ समझी जा रही है और जवाब तैयार हो रहा है...',
      micPermissionError: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक की अनुमति दें।',
      readAloud: 'सुनें',
      stopReading: 'रोकें',
      clearChat: 'नई चैट',
      quickPromptsLabel: 'त्वरित प्रश्न',
      quickPrompts: [
        'क्या मुझे आज प्याज बेचना चाहिए या 5 दिन रुकना चाहिए?',
        'मेरे पास टमाटर बेचने के लिए सबसे ज्यादा मुनाफे वाली मंडी कौन सी है?',
        'मक्का के भाव में कितना बदलाव हुआ और अगले 5 दिन में भाव बढ़ेगा?',
        'मुझे फसल में नुकसान हुआ है — जीवन यापन के लिए कौन सी सरकारी योजना है?',
      ],
      welcomeMessage:
        'नमस्ते! मैं मंडीमित्र आपका कृषि भाव सलाहकार हूँ। किसी भी फसल के बारे में पूछें — मैं बताऊँगा कि आज भाव कितना % बढ़ा या घटा है, अगले 5 दिनों में भाव बढ़ेगा या नहीं, अभी बेचना सही है या रुकना, और किस मंडी में आपको सबसे ज्यादा मुनाफा मिलेगा।',
      cardLabels: {
        bestPrice: 'सर्वोत्तम भाव',
        marketMove: 'बाज़ार बदलाव',
        forecast5d: '5-दिन अनुमान',
        decision: 'सलाह',
        topMandi: 'सर्वश्रेष्ठ मंडी',
        netProfit: 'शुद्ध लाभ',
        sell: 'अभी बेचें',
        hold: 'रुकें / प्रतीक्षा करें',
        up: 'बढ़ा है',
        down: 'गिरा है',
      },
    },
    alerts: {
      title: 'भाव बढ़ोतरी अलर्ट और सूचनाएं',
      subtitle: 'जब किसी फसल का मंडी भाव बढ़े या आपके लक्ष्य भाव को पार करे, तो तुरंत सूचना पाएं।',
      checkNowBtn: 'ताज़ा भाव उछाल जांचें',
      enableBrowserBtn: 'ब्राउज़र अलर्ट चालू करें',
      browserEnabledLabel: 'ब्राउज़र अलर्ट सक्रिय हैं',
      browserBlockedHint: 'ब्राउज़र सूचना अनुमति बंद है; ऐप के भीतर अलर्ट सक्रिय रहेंगे।',
      markAllRead: 'सभी पढ़ा हुआ चिह्नित करें',
      clearAll: 'सूचनाएं साफ़ करें',
      unreadLabel: 'अपठित',
      createRuleTitle: 'नया भाव बढ़ोतरी अलर्ट बनाएं',
      cropLabel: 'फसल',
      gradeLabel: 'गुणवत्ता और आकार ग्रेड',
      targetPriceLabel: 'लक्ष्य भाव (₹/क्विंटल)',
      minPercentLabel: 'न्यूनतम बढ़ोतरी (%)',
      addRuleBtn: 'अलर्ट सहेजें',
      activeRulesTitle: 'आपके सक्रिय भाव अलर्ट',
      noRulesText: 'अभी कोई कस्टम अलर्ट नहीं है। ऊपर अपना लक्ष्य भाव जोड़ें।',
      removeRule: 'हटाएं',
      inboxTitle: 'भाव बढ़ोतरी सूचनाएं',
      noNotificationsText: 'अभी कोई नई सूचना नहीं है। बाज़ार की तेजी जांचने के लिए "ताज़ा भाव उछाल जांचें" दबाएं।',
      reasonDailyGain: 'दैनिक भाव में बढ़ोतरी',
      reasonTargetReached: 'लक्ष्य भाव प्राप्त हुआ',
      reasonLiveSurge: 'लाइव बाज़ार उछाल',
      priceRoseFrom: 'भाव बढ़कर',
      toLabel: 'से',
      viewCropBtn: 'भाव और मंडी देखें',
      toastTitle: 'फसल का भाव बढ़ा है',
      dismissBtn: 'बंद करें',
    },
    profile: {
      title: 'किसान प्रोफ़ाइल और स्थान सेटिंग्स',
      subtitle: 'मंडी परिवहन खर्च और सलाह को अपडेट करने के लिए अपना स्थान और भाषा बदलें।',
      saveChanges: 'प्रोफ़ाइल सहेजें',
      savedToast: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई।',
      logout: 'लॉग आउट / किसान बदलें',
    },
  },
  kn: {
    appName: 'ಮಂಡಿಮಿತ್ರ (MANDIMITRA)',
    tagline: 'ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ರೈತ ಸಲಹಾ ವೇದಿಕೆ',
    nav: {
      dashboard: 'ಮಾರುಕಟ್ಟೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      chatbot: 'ಬೆಲೆ ಸಲಹೆಗಾರ ಚಾಟ್',
      mandiFinder: 'ಲಾಭದಾಯಕ ಮಂಡಿಗಳು',
      schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      alerts: 'ಬೆಲೆ ಏರಿಕೆ ಅಲರ್ಟ್‌ಗಳು',
      profile: 'ರೈತರ ಪ್ರೊಫೈಲ್',
    },
    login: {
      heading: 'ರೈತರ ಲಾಗಿನ್',
      subheading: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಮಂಡಿ ದರಗಳು, 5-ದಿನಗಳ ಬೆಲೆ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕನ್ನಡ ಸಲಹೆ ಪಡೆಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
      nameLabel: 'ರೈತರ ಹೆಸರು',
      namePlaceholder: 'ಉದಾ. ರಮೇಶ್ ಗೌಡ',
      phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      phonePlaceholder: '10 ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆ',
      placeLabel: 'ಸ್ಥಳ (ಜಿಲ್ಲೆ / ತಾಲ್ಲೂಕು)',
      placePlaceholder: 'ಉದಾ. ದಾವಣಗೆರೆ, ಹುಬ್ಬಳ್ಳಿ, ಮೈಸೂರು',
      localityLabel: 'ಗ್ರಾಮ / ಹೋಬಳಿ',
      localityPlaceholder: 'ಉದಾ. ಹರಿಹರ, ಚನ್ನಗಿರಿ',
      languageLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
      submitButton: 'ನನ್ನ ಮಂಡಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
      validationPhone: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
      validationRequired: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
      heroCaption: 'ಲೈವ್ ಮಂಡಿ ದರಗಳು, ಸ್ಟಾಕ್-ಶೈಲಿಯ ಏರಿಳಿತ ಮತ್ತು ಹೆಚ್ಚು ಲಾಭ ತರುವ ಮಂಡಿ.',
      heroSubcaption: 'ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
    },
    header: {
      welcome: 'ರೈತ',
      switchFarmer: 'ರೈತರನ್ನು ಬದಲಿಸಿ',
      language: 'ಭಾಷೆ',
    },
    dashboard: {
      marketOverview: 'ಲೈವ್ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು',
      searchCrop: 'ಬೆಳೆ ಹುಡುಕಿ...',
      allCrops: 'ಎಲ್ಲಾ ಬೆಳೆಗಳು',
      gainersOnly: 'ಬೆಲೆ ಏರಿಕೆ',
      sellNowFilter: 'ಮಾರಾಟ ಸೂಚನೆ',
      bestCurrentPrice: 'ಪ್ರಸ್ತುತ ಉತ್ತಮ ಬೆಲೆ',
      dailyChange: '24 ಗಂಟೆಗಳ ಬದಲಾವಣೆ',
      fiveDayForecast: '5-ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
      advisoryDecision: 'ಮಾರಾಟ ಸಲಹೆ',
      sellNow: 'ಈಗ ಮಾರಾಟ ಮಾಡಿ',
      holdWait: 'ಕಾಯಿರಿ (ಬೆಲೆ ಏರಲಿದೆ)',
      priceTrendTitle: '14-ದಿನಗಳ ಇತಿಹಾಸ ಮತ್ತು 5-ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
      historicalLabel: '14-ದಿನಗಳ ನೈಜ ಬೆಲೆ',
      predictedLabel: '5-ದಿನಗಳ ಅಂದಾಜು ಬೆಲೆ',
      perQuintal: '/ ಕ್ವಿಂಟಲ್',
      expectedIncrement: 'ನಿರೀಕ್ಷಿತ ಏರಿಕೆ',
      expectedDecrement: 'ನಿರೀಕ್ಷಿತ ಇಳಿಕೆ',
      askAdvisorBtn: 'ಚಾಟ್‌ಬಾಟ್ ಕೇಳಿ',
      setPriceAlertBtn: 'ಬೆಲೆ ಅಲರ್ಟ್ ಇಡಿ',
      mostProfitableMandi: 'ಅತ್ಯಂತ ಲಾಭದಾಯಕ ಮಂಡಿ',
      netProfitEstimate: 'ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ',
      comparedAcross: 'ಹೋಲಿಕೆ:',
      mandisLabel: 'ಮಂಡಿಗಳು',
      confidence: 'ಮಾದರಿ ನಿಖರತೆ',
      noResults: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಬೆಳೆ ಕಂಡುಬಂದಿಲ್ಲ.',
      resetFilter: 'ಎಲ್ಲಾ ಬೆಳೆಗಳನ್ನು ತೋರಿಸಿ',
      qualitySelectorLabel: 'ಗುಣಮಟ್ಟ ಮತ್ತು ಗಾತ್ರ ಶ್ರೇಣಿ',
      qualityBreakdownTitle: 'ಉತ್ಪನ್ನದ ಗುಣಮಟ್ಟ ಮತ್ತು ಗಾತ್ರದ ಪ್ರಕಾರ ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ',
      qualityGradeCol: 'ಗುಣಮಟ್ಟ ಶ್ರೇಣಿ',
      qualitySizeCol: 'ಗಾತ್ರ ಮತ್ತು ಗುಣಮಟ್ಟ ವಿವರ',
      qualityPriceCol: 'ಉತ್ತಮ ಬೆಲೆ',
      qualityChangeCol: '24 ಗಂಟೆ ಬದಲಾವಣೆ',
      qualityForecastCol: '5-ದಿನ ಮುನ್ಸೂಚನೆ',
      qualityAdviceCol: 'ಸಲಹೆ',
    },
    mandiTable: {
      title: 'ಮಂಡಿ ನಿವ್ವಳ ಲಾಭ ಹೋಲಿಕೆ',
      subtitle: 'ನಿಮ್ಮ ಸ್ಥಳದಿಂದ ಸಾಗಣೆ ವೆಚ್ಚ ಮತ್ತು 1.5% ಎಪಿಎಂಸಿ ಶುಲ್ಕವನ್ನು ಕಳೆದ ನಂತರ ನಿವ್ವಳ ಲಾಭದ ಶ್ರೇಯಾಂಕ',
      mandiName: 'ಮಂಡಿ / APMC',
      district: 'ಜಿಲ್ಲೆ / ರಾಜ್ಯ',
      modalPrice: 'ಮಾದರಿ ಬೆಲೆ',
      distance: 'ಅಂದಾಜು ದೂರ',
      transportCost: 'ಸಾಗಣೆ ವೆಚ್ಚ',
      netProfit: 'ನಿವ್ವಳ ಲಾಭ / ಕ್ವಿಂಟಲ್',
      arrivals: 'ಆವಕ',
      topProfitTag: 'ಅತಿ ಹೆಚ್ಚು ಲಾಭ',
      quantityLabel: 'ನಿಮ್ಮ ಬೆಳೆ ಪ್ರಮಾಣ (ಕ್ವಿಂಟಲ್‌ಗಳಲ್ಲಿ)',
      cultivationCostLabel: 'ಬೆಳೆ ವೆಚ್ಚ / ಕ್ವಿಂಟಲ್ (₹)',
      totalProjectedNet: 'ಅಂದಾಜು ಒಟ್ಟು ನಿವ್ವಳ ಆದಾಯ',
      estimatedProfitLoss: 'ಬೆಳೆ ವೆಚ್ಚ ಕಳೆದ ನಂತರ ಲಾಭ / ನಷ್ಟ',
      profitStatus: 'ನಿವ್ವಳ ಲಾಭ',
      lossStatus: 'ನಷ್ಟ ಕಂಡುಬಂದಿದೆ',
    },
    schemes: {
      title: 'ಬೆಳೆ ನಷ್ಟ ಮತ್ತು ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      subtitle: 'ಮಾರುಕಟ್ಟೆ ದರ ಕುಸಿತ ಅಥವಾ ಬೆಳೆ ಹಾನಿಯಿಂದ ರೈತರಿಗೆ ನಷ್ಟವಾದರೆ, ಕುಟುಂಬದ ಜೀವನೋಪಾಯ ಮತ್ತು ಚೇತರಿಕೆಗೆ ನೆರವಾಗುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು.',
      lossBannerTitle: 'ನಷ್ಟ ಮತ್ತು ಬೆಲೆ ಇಳಿಕೆಯಿಂದ ರಕ್ಷಣೆಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      lossBannerPriceDip: 'ಈ ಶ್ರೇಣಿಯ ಮಾರುಕಟ್ಟೆ ದರ ಅಥವಾ ಮುನ್ಸೂಚನೆ ಇಳಿಕೆಯಲ್ಲಿದೆ. ನಿಮ್ಮ ಆದಾಯವನ್ನು ರಕ್ಷಿಸಲು ಈ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      lossBannerNegativeMargin: 'ನಿಮ್ಮ ಕೃಷಿ ವೆಚ್ಚಕ್ಕೆ ಹೋಲಿಸಿದರೆ ಈಗ ಮಾರಾಟ ಮಾಡಿದರೆ ನಷ್ಟವಾಗುತ್ತದೆ. ಈ ಸರ್ಕಾರಿ ಪರಿಹಾರ ಮತ್ತು ಜೀವನೋಪಾಯ ಯೋಜನೆಗಳು ನಿಮಗೆ ನೆರವಾಗುತ್ತವೆ.',
      alwaysVisibleTitle: 'ರೈತರು ಮತ್ತು ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      alwaysVisibleSubtitle: 'ನೇರ ಆದಾಯ ನೆರವು, ಬೆಳೆ ವಿಮೆ, 4% KCC ಸಾಲ ಮತ್ತು ಬೆಲೆ ರಕ್ಷಣೆ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ.',
      viewAllSchemes: 'ಎಲ್ಲಾ 8 ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
      searchPlaceholder: 'ಯೋಜನೆ ಹುಡುಕಿ (ಉದಾ. PM-KISAN, ವಿಮೆ, ಸಾಲ)...',
      situationLabel: 'ನೆರವಿನ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ',
      situations: {
        auto: 'ಪ್ರಸ್ತುತ ಬೆಳೆಗೆ ಸೂಕ್ತವಾದದ್ದು',
        price_crash: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಕುಸಿತ',
        crop_damage: 'ಬೆಳೆ / ಹವಾಮಾನ ಹಾನಿ',
        debt_relief: 'ಸಾಲ ಮತ್ತು ಬಡ್ಡಿ ನೆರವು',
        livelihood: 'ಜೀವನೋಪಾಯ ಮತ್ತು ಹೆಚ್ಚುವರಿ ಆದಾಯ',
      },
      benefitLabel: 'ಪ್ರಮುಖ ಪ್ರಯೋಜನ',
      eligibilityLabel: 'ಅರ್ಹತೆ',
      documentsLabel: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
      howToApplyLabel: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ',
      portalLabel: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ / ಸಹಾಯವಾಣಿ',
      visitPortal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್',
      askHowToApply: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ ಎಂದು ಕೇಳಿ',
    },
    chatbot: {
      title: 'ಮಂಡಿಮಿತ್ರ ಬೆಲೆ ಸಲಹೆಗಾರ',
      subtitle: 'ಯಾವುದೇ ಬೆಳೆಯ ಬಗ್ಗೆ ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ — ಇಂದಿನ ಶೇಕಡಾ ಬದಲಾವಣೆ, 5-ದಿನಗಳ ಮುನ್ಸೂಚನೆ, ಮಾರಾಟ/ಕಾಯಿರಿ ಸಲಹೆ ಮತ್ತು ಉತ್ತಮ ಮಂಡಿ ತಿಳಿಯಿರಿ.',
      placeholder: 'ಕೇಳಿ ಉದಾ. "ನಾನು ಇಂದು ಈರುಳ್ಳಿ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ ಕಾಯಬೇಕೇ?"',
      send: 'ವಿಶ್ಲೇಷಿಸಿ',
      thinking: 'ಮಂಡಿ ದರಗಳು ಮತ್ತು ಮುನ್ಸೂಚನೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      voiceListen: 'ಧ್ವನಿ ಮೂಲಕ ಕೇಳಿ',
      voiceListening: 'ಆಲಿಸುತ್ತಿದ್ದೇವೆ...',
      voiceTapToStop: 'ಕಳುಹಿಸಲು ಮೈಕ್ ಒತ್ತಿ',
      voiceProcessing: 'ಧ್ವನಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಉತ್ತರ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
      micPermissionError: 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ.',
      readAloud: 'ಕೇಳಿಸಿ',
      stopReading: 'ನಿಲ್ಲಿಸಿ',
      clearChat: 'ಹೊಸ ಚಾಟ್',
      quickPromptsLabel: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು',
      quickPrompts: [
        'ನಾನು ಇಂದು ಈರುಳ್ಳಿ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ 5 ದಿನ ಕಾಯಬೇಕೇ?',
        'ನನ್ನ ಹತ್ತಿರ ಟೊಮೆಟೊ ಮಾರಾಟ ಮಾಡಲು ಯಾವ ಮಂಡಿಯಲ್ಲಿ ಹೆಚ್ಚು ಲಾಭ ಸಿಗುತ್ತದೆ?',
        'ಮೆಕ್ಕೆಜೋಳದ ಬೆಲೆ ಎಷ್ಟು % ಏರಿಕೆಯಾಗಿದೆ ಮತ್ತು ಮುಂದಿನ 5 ದಿನದಲ್ಲಿ ಬೆಲೆ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
        'ನನಗೆ ಬೆಳೆಯಲ್ಲಿ ನಷ್ಟವಾಗಿದೆ — ಜೀವನೋಪಾಯಕ್ಕೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?',
      ],
      welcomeMessage:
        'ನಮಸ್ಕಾರ! ನಾನು ಮಂಡಿಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಬೆಲೆ ಸಲಹೆಗಾರ. ಯಾವುದೇ ಬೆಳೆಯ ಬಗ್ಗೆ ಕೇಳಿ — ಇಂದಿನ ಬೆಲೆ ಎಷ್ಟು % ಏರಿದೆ ಅಥವಾ ಇಳಿದಿದೆ, ಮುಂದಿನ 5 ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ, ಈಗ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ ಕಾಯಬೇಕೇ, ಮತ್ತು ಯಾವ ಮಂಡಿಯಲ್ಲಿ ಹೆಚ್ಚು ಲಾಭ ಸಿಗುತ್ತದೆ ಎಂಬುದನ್ನು ನಾನು ತಿಳಿಸುತ್ತೇನೆ.',
      cardLabels: {
        bestPrice: 'ಉತ್ತಮ ಬೆಲೆ',
        marketMove: 'ಮಾರುಕಟ್ಟೆ ಚಲನೆ',
        forecast5d: '5-ದಿನದ ಮುನ್ಸೂಚನೆ',
        decision: 'ಸಲಹೆ',
        topMandi: 'ಅತ್ಯುತ್ತಮ ಮಂಡಿ',
        netProfit: 'ನಿವ್ವಳ ಲಾಭ',
        sell: 'ಈಗ ಮಾರಾಟ ಮಾಡಿ',
        hold: 'ಕಾಯಿರಿ / ಹಿಡಿದಿಡಿ',
        up: 'ಏರಿಕೆಯಾಗಿದೆ',
        down: 'ಇಳಿಕೆಯಾಗಿದೆ',
      },
    },
    alerts: {
      title: 'ಬೆಲೆ ಏರಿಕೆ ಅಲರ್ಟ್ ಮತ್ತು ಸೂಚನೆಗಳು',
      subtitle: 'ಬೆಳೆ ದರ ಹೆಚ್ಚಾದಾಗ ಅಥವಾ ನಿಮ್ಮ ಗುರಿ ಬೆಲೆಯನ್ನು ದಾಟಿದಾಗ ತಕ್ಷಣ ಸೂಚನೆ ಪಡೆಯಿರಿ.',
      checkNowBtn: 'ಲೈವ್ ಬೆಲೆ ಏರಿಕೆ ಪರಿಶೀಲಿಸಿ',
      enableBrowserBtn: 'ಬ್ರೌಸರ್ ಅಲರ್ಟ್ ಆನ್ ಮಾಡಿ',
      browserEnabledLabel: 'ಬ್ರೌಸರ್ ಅಲರ್ಟ್ ಸಕ್ರಿಯವಾಗಿದೆ',
      browserBlockedHint: 'ಬ್ರೌಸರ್ ಸೂಚನೆ ಅನುಮತಿ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ; ಆ್ಯಪ್ ಒಳಗಿನ ಅಲರ್ಟ್‌ಗಳು ಸಕ್ರಿಯವಾಗಿವೆ.',
      markAllRead: 'ಎಲ್ಲಾ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ',
      clearAll: 'ಸೂಚನೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
      unreadLabel: 'ಓದದಿರುವುದು',
      createRuleTitle: 'ಹೊಸ ಬೆಲೆ ಏರಿಕೆ ಅಲರ್ಟ್ ರಚಿಸಿ',
      cropLabel: 'ಬೆಳೆ',
      gradeLabel: 'ಗುಣಮಟ್ಟ ಮತ್ತು ಗಾತ್ರ ಶ್ರೇಣಿ',
      targetPriceLabel: 'ಗುರಿ ಬೆಲೆ (₹/ಕ್ವಿಂಟಲ್)',
      minPercentLabel: 'ಕನಿಷ್ಠ ಏರಿಕೆ (%)',
      addRuleBtn: 'ಅಲರ್ಟ್ ಉಳಿಸಿ',
      activeRulesTitle: 'ನಿಮ್ಮ ಸಕ್ರಿಯ ಬೆಲೆ ಅಲರ್ಟ್‌ಗಳು',
      noRulesText: 'ಇನ್ನೂ ಯಾವುದೇ ಕಸ್ಟಮ್ ಅಲರ್ಟ್ ಸೇರಿಸಿಲ್ಲ. ಮೇಲೆ ನಿಮ್ಮ ಗುರಿ ಬೆಲೆಯನ್ನು ಸೇರಿಸಿ.',
      removeRule: 'ತೆಗೆದುಹಾಕಿ',
      inboxTitle: 'ಬೆಲೆ ಏರಿಕೆ ಸೂಚನೆಗಳು',
      noNotificationsText: 'ಇನ್ನೂ ಯಾವುದೇ ಹೊಸ ಸೂಚನೆಗಳಿಲ್ಲ. ಮಾರುಕಟ್ಟೆ ಏರಿಕೆ ಪರಿಶೀಲಿಸಲು "ಲೈವ್ ಬೆಲೆ ಏರಿಕೆ ಪರಿಶೀಲಿಸಿ" ಒತ್ತಿ.',
      reasonDailyGain: 'ದೈನಂದಿನ ಬೆಲೆ ಏರಿಕೆ',
      reasonTargetReached: 'ಗುರಿ ಬೆಲೆ ತಲುಪಿದೆ',
      reasonLiveSurge: 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಏರಿಕೆ',
      priceRoseFrom: 'ಬೆಲೆ',
      toLabel: 'ರಿಂದ',
      viewCropBtn: 'ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಮಾರಾಟ ಯೋಜನೆ ನೋಡಿ',
      toastTitle: 'ಬೆಳೆ ಬೆಲೆ ಏರಿಕೆಯಾಗಿದೆ',
      dismissBtn: 'ಮುಚ್ಚಿ',
    },
    profile: {
      title: 'ರೈತರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸ್ಥಳ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      subtitle: 'ಮಂಡಿ ಸಾಗಣೆ ವೆಚ್ಚ ಮತ್ತು ಸಲಹೆಗಳನ್ನು ನವೀಕರಿಸಲು ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ.',
      saveChanges: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
      savedToast: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.',
      logout: 'ಸೈನ್ ಔಟ್ / ರೈತರನ್ನು ಬದಲಿಸಿ',
    },
  },
};
