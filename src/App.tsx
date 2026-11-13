import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Landmark,
  LogOut,
  MapPin,
  MessageSquareText,
  Search,
  Sprout,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { FarmerLogin } from './components/FarmerLogin.tsx';
import { GovtSchemesPanel } from './components/GovtSchemesPanel.tsx';
import { MandiProfitTable } from './components/MandiProfitTable.tsx';
import { PriceAdvisorChat } from './components/PriceAdvisorChat.tsx';
import { PriceAlertsPanel } from './components/PriceAlertsPanel.tsx';
import { PriceTrendChart } from './components/PriceTrendChart.tsx';
import {
  buildAllCropAnalyses,
  evaluateMandisForFarmer,
  QUALITY_GRADE_LABELS,
} from './data/marketData.ts';
import { DEFAULT_CULTIVATION_COST_PER_QTL } from './data/schemesData.ts';
import { TRANSLATIONS } from './i18n/translations.ts';
import type {
  CropAnalysis,
  FarmerProfile,
  GovernmentScheme,
  Language,
  PriceAlertRule,
  PriceNotification,
  QualityGrade,
} from './types.ts';

type ActiveTab = 'dashboard' | 'chatbot' | 'mandis' | 'schemes' | 'alerts' | 'profile';
type MarketFilter = 'all' | 'gainers' | 'sell';

const QUALITY_GRADES: QualityGrade[] = ['gradeA', 'gradeB', 'gradeC'];

const STORAGE_KEY = 'mandimitra_farmer_profile_v1';
const ALERTS_RULES_STORAGE_KEY = 'mandimitra_alert_rules_v1';
const ALERTS_NOTIFS_STORAGE_KEY = 'mandimitra_notifications_v1';
const ALERTS_SEEDED_STORAGE_KEY = 'mandimitra_alerts_seeded_v1';

const LANGUAGE_SWITCHER: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

function loadSavedFarmer(): FarmerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FarmerProfile;
    if (!parsed.name || !parsed.phone || !parsed.place || !parsed.locality) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadSavedAlertRules(): PriceAlertRule[] {
  try {
    const raw = localStorage.getItem(ALERTS_RULES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PriceAlertRule[]) : [];
  } catch {
    return [];
  }
}

function loadSavedNotifications(): PriceNotification[] {
  try {
    const raw = localStorage.getItem(ALERTS_NOTIFS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PriceNotification[]) : [];
  } catch {
    return [];
  }
}

function formatNowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildDailyGainerNotifications(crops: CropAnalysis[]): PriceNotification[] {
  const timestamp = formatNowTime();
  return [...crops]
    .filter((crop) => crop.trendDirection === 'up' && crop.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3)
    .map((crop) => {
      const tier = crop.qualityTiers.gradeB;
      return {
        id: `daily-${crop.id}-gradeB`,
        cropId: crop.id,
        grade: 'gradeB',
        newPrice: tier.currentBestPrice,
        previousPrice: Math.max(100, tier.currentBestPrice - Math.max(0, tier.priceDiff)),
        diffRs: Math.max(0, tier.priceDiff),
        changePercent: tier.changePercent,
        bestMandiName: crop.bestMandiName,
        reason: 'daily_gain',
        timestamp,
        read: false,
      };
    });
}

export default function App() {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(() => loadSavedFarmer());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');
  const [selectedGrade, setSelectedGrade] = useState<QualityGrade>('gradeB');
  const [cultivationCostByCrop, setCultivationCostByCrop] = useState<Record<string, number>>(
    () => ({ ...DEFAULT_CULTIVATION_COST_PER_QTL })
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [profileNotice, setProfileNotice] = useState('');

  const [liveBoostsByCrop, setLiveBoostsByCrop] = useState<Record<string, number>>({});
  const [alertRules, setAlertRules] = useState<PriceAlertRule[]>(() => loadSavedAlertRules());
  const [notifications, setNotifications] = useState<PriceNotification[]>(() =>
    loadSavedNotifications()
  );
  const [activeToast, setActiveToast] = useState<PriceNotification | null>(null);
  const surgeIndexRef = useRef(0);

  // Profile form state when editing inside Profile tab
  const [editName, setEditName] = useState(farmer?.name ?? '');
  const [editPhone, setEditPhone] = useState(farmer?.phone ?? '');
  const [editPlace, setEditPlace] = useState(farmer?.place ?? '');
  const [editLocality, setEditLocality] = useState(farmer?.locality ?? '');

  const language: Language = farmer?.language ?? 'en';
  const t = TRANSLATIONS[language];

  const crops = useMemo(() => {
    return buildAllCropAnalyses(
      farmer?.place ?? 'Davanagere',
      farmer?.locality ?? 'Harihar',
      liveBoostsByCrop
    );
  }, [farmer?.place, farmer?.locality, liveBoostsByCrop]);

  // Seed initial daily price-increase notifications once per user browser storage
  useEffect(() => {
    try {
      const alreadySeeded = localStorage.getItem(ALERTS_SEEDED_STORAGE_KEY) === '1';
      if (alreadySeeded || notifications.length > 0) return;
      const seeded = buildDailyGainerNotifications(crops);
      localStorage.setItem(ALERTS_SEEDED_STORAGE_KEY, '1');
      if (seeded.length > 0) {
        setNotifications(seeded);
        localStorage.setItem(ALERTS_NOTIFS_STORAGE_KEY, JSON.stringify(seeded));
      }
    } catch {
      // Ignore storage failures cleanly
    }
  }, [crops, notifications.length]);

  useEffect(() => {
    if (!activeToast) return;
    const timer = window.setTimeout(() => {
      setActiveToast(null);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [activeToast]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const filteredCrops = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return crops.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.en.toLowerCase().includes(q) ||
        c.name.hi.toLowerCase().includes(q) ||
        c.name.kn.toLowerCase().includes(q);

      if (!matchesQuery) return false;
      if (marketFilter === 'gainers') return c.trendDirection === 'up';
      if (marketFilter === 'sell') return c.recommendation === 'SELL';
      return true;
    });
  }, [crops, searchQuery, marketFilter]);

  const selectedCrop = useMemo(() => {
    return crops.find((c) => c.id === selectedCropId) ?? crops[0];
  }, [crops, selectedCropId]);

  const activeQualityTier = selectedCrop.qualityTiers[selectedGrade];

  const evaluatedMandis = useMemo(() => {
    return evaluateMandisForFarmer(
      selectedCrop.mandiRates,
      farmer?.place ?? 'Davanagere',
      farmer?.locality ?? 'Harihar',
      activeQualityTier.multiplier
    );
  }, [selectedCrop, farmer?.place, farmer?.locality, activeQualityTier.multiplier]);

  const topMandi = evaluatedMandis[0];
  const currentCultivationCost = cultivationCostByCrop[selectedCrop.id] ?? 1800;
  const netMarginPerQtl = topMandi ? topMandi.netProfitPerQtl - currentCultivationCost : 0;
  const isNegativeMargin = netMarginPerQtl < 0;
  const isMarketDownturn =
    activeQualityTier.trendDirection === 'down' || activeQualityTier.forecastDirection === 'decrement';
  const showLossSupportBanner = isNegativeMargin || isMarketDownturn;

  const fireBrowserNotification = (notif: PriceNotification, cropObj: CropAnalysis) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (window.Notification.permission !== 'granted') return;
    try {
      const title = `${t.alerts.toastTitle}: ${cropObj.name[language]}`;
      const body = `${QUALITY_GRADE_LABELS[notif.grade][language]} — ₹${notif.newPrice.toLocaleString('en-IN')} (+${notif.changePercent}%) · ${notif.bestMandiName[language]}`;
      new window.Notification(title, { body });
    } catch {
      // Ignore browser notification errors cleanly
    }
  };

  const persistNotifications = (next: PriceNotification[]) => {
    setNotifications(next);
    try {
      localStorage.setItem(ALERTS_NOTIFS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors cleanly
    }
  };

  const persistAlertRules = (next: PriceAlertRule[]) => {
    setAlertRules(next);
    try {
      localStorage.setItem(ALERTS_RULES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors cleanly
    }
  };

  const handleAddAlertRule = (
    ruleInput: Omit<PriceAlertRule, 'id' | 'createdAt' | 'enabled'>
  ) => {
    const newRule: PriceAlertRule = {
      ...ruleInput,
      id: `rule-${Date.now()}`,
      enabled: true,
      createdAt: formatNowTime(),
    };
    const nextRules = [newRule, ...alertRules];
    persistAlertRules(nextRules);

    // Check immediately if the current market price already meets the farmer's rule
    const targetCrop = crops.find((c) => c.id === ruleInput.cropId);
    if (!targetCrop) return;
    const tier = targetCrop.qualityTiers[ruleInput.grade];
    const meetsTarget = tier.currentBestPrice >= ruleInput.targetPrice;
    const meetsPercent = tier.trendDirection === 'up' && tier.changePercent >= ruleInput.minIncreasePercent;
    if (meetsTarget || meetsPercent) {
      const notif: PriceNotification = {
        id: `notif-${Date.now()}`,
        cropId: targetCrop.id,
        grade: ruleInput.grade,
        newPrice: tier.currentBestPrice,
        previousPrice: Math.max(100, tier.currentBestPrice - Math.max(0, tier.priceDiff)),
        diffRs: Math.max(0, tier.priceDiff),
        changePercent: Math.max(0, tier.changePercent),
        bestMandiName: targetCrop.bestMandiName,
        reason: 'target_reached',
        timestamp: formatNowTime(),
        read: false,
      };
      persistNotifications([notif, ...notifications]);
      setActiveToast(notif);
      fireBrowserNotification(notif, targetCrop);
    }
  };

  const handleRemoveAlertRule = (ruleId: string) => {
    persistAlertRules(alertRules.filter((r) => r.id !== ruleId));
  };

  const handleMarkAllRead = () => {
    persistNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    try {
      localStorage.setItem(ALERTS_SEEDED_STORAGE_KEY, '1');
    } catch {
      // Ignore storage errors cleanly
    }
    setActiveToast(null);
    persistNotifications([]);
  };

  const handleCheckLiveSurge = () => {
    const idx = surgeIndexRef.current;
    surgeIndexRef.current += 1;

    const enabledRules = alertRules.filter((r) => r.enabled);
    const chosenRule = enabledRules.length > 0 ? enabledRules[idx % enabledRules.length] : null;
    const fallbackCrop = crops[idx % crops.length];
    const targetCropId = chosenRule ? chosenRule.cropId : fallbackCrop.id;
    const targetGrade: QualityGrade = chosenRule ? chosenRule.grade : selectedGrade;

    const targetCrop = crops.find((c) => c.id === targetCropId) ?? fallbackCrop;
    const tierBefore = targetCrop.qualityTiers[targetGrade];
    const previousPrice = tierBefore.currentBestPrice;

    const surgePercent = Number((3.4 + (idx % 3) * 0.6).toFixed(1));
    const currentFactor = liveBoostsByCrop[targetCrop.id] ?? 1;
    const nextFactor = Number((currentFactor * (1 + surgePercent / 100)).toFixed(4));

    setLiveBoostsByCrop((prev) => ({
      ...prev,
      [targetCrop.id]: nextFactor,
    }));

    const newPrice = Math.round(previousPrice * (1 + surgePercent / 100));
    const diffRs = Math.max(1, newPrice - previousPrice);
    const reachedTarget = Boolean(chosenRule && newPrice >= chosenRule.targetPrice);

    const newNotif: PriceNotification = {
      id: `surge-${Date.now()}`,
      cropId: targetCrop.id,
      grade: targetGrade,
      newPrice,
      previousPrice,
      diffRs,
      changePercent: surgePercent,
      bestMandiName: targetCrop.bestMandiName,
      reason: reachedTarget ? 'target_reached' : 'live_surge',
      timestamp: formatNowTime(),
      read: false,
    };

    persistNotifications([newNotif, ...notifications]);
    setActiveToast(newNotif);
    fireBrowserNotification(newNotif, targetCrop);
  };

  const handleSelectNotificationCrop = (cropId: string, grade: QualityGrade) => {
    persistNotifications(
      notifications.map((n) => (n.cropId === cropId && n.grade === grade ? { ...n, read: true } : n))
    );
    setSelectedCropId(cropId);
    setSelectedGrade(grade);
    setActiveToast(null);
    setActiveTab('dashboard');
  };

  const handleLogin = (profile: FarmerProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setFarmer(profile);
    setEditName(profile.name);
    setEditPhone(profile.phone);
    setEditPlace(profile.place);
    setEditLocality(profile.locality);
    setActiveTab('dashboard');
  };

  const handleLanguageChange = (nextLang: Language) => {
    if (!farmer) return;
    const updated = { ...farmer, language: nextLang };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFarmer(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFarmer(null);
  };

  const handleAskAdvisorForCrop = (cropName: string) => {
    const gradeLabel = QUALITY_GRADE_LABELS[selectedGrade][language];
    const promptByLang: Record<Language, string> = {
      en: `Analyze ${cropName} (${gradeLabel}): tell me current price % change, 5-day prediction, whether to sell or hold, and the best mandi for maximum profit.`,
      hi: `${cropName} (${gradeLabel}) का विश्लेषण करें: आज भाव कितना % बढ़ा या घटा है, अगले 5 दिन का अनुमान, अभी बेचें या रुकें, और सबसे ज्यादा मुनाफे वाली मंडी बताएं।`,
      kn: `${cropName} (${gradeLabel}) ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ ಮಾಡಿ: ಇಂದಿನ ಬೆಲೆ % ಬದಲಾವಣೆ, 5-ದಿನಗಳ ಮುನ್ಸೂಚನೆ, ಈಗ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ ಕಾಯಬೇಕೇ, ಮತ್ತು ಹೆಚ್ಚು ಲಾಭದಾಯಕ ಮಂಡಿ ತಿಳಿಸಿ.`,
    };
    setPendingChatPrompt(promptByLang[language]);
    setActiveTab('chatbot');
  };

  const handleAskSchemeAdvice = (scheme: GovernmentScheme) => {
    const schemeName = scheme.name[language];
    const promptByLang: Record<Language, string> = {
      en: `I am facing a loss in ${selectedCrop.name.en}. Please explain how to apply for ${schemeName}, what documents I need, and how it supports my livelihood.`,
      hi: `मुझे ${selectedCrop.name.hi} में नुकसान हो रहा है। कृपया बताएं कि ${schemeName} के लिए आवेदन कैसे करें, कौन से दस्तावेज़ चाहिए, और यह मेरी आजीविका में कैसे मदद करेगी।`,
      kn: `ನನಗೆ ${selectedCrop.name.kn} ಬೆಳೆಯಲ್ಲಿ ನಷ್ಟವಾಗಿದೆ. ${schemeName} ಯೋಜನೆಗೆ ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು, ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು ಮತ್ತು ಇದು ನನ್ನ ಜೀವನೋಪಾಯಕ್ಕೆ ಹೇಗೆ ನೆರವಾಗುತ್ತದೆ ಎಂದು ತಿಳಿಸಿ.`,
    };
    setPendingChatPrompt(promptByLang[language]);
    setActiveTab('chatbot');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) return;
    const cleanedPhone = editPhone.replace(/\D/g, '');
    if (!editName.trim() || !editPlace.trim() || !editLocality.trim() || cleanedPhone.length !== 10) {
      return;
    }
    const updated: FarmerProfile = {
      ...farmer,
      name: editName.trim(),
      phone: cleanedPhone,
      place: editPlace.trim(),
      locality: editLocality.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFarmer(updated);
    setProfileNotice(t.profile.savedToast);
    setTimeout(() => setProfileNotice(''), 3000);
  };

  if (!farmer) {
    return <FarmerLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-slate-900 flex flex-col lg:flex-row">
      {/* Left Desktop Sidebar (256px) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r border-slate-200 shrink-0">
        <div className="h-16 px-6 flex items-center gap-2.5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap">
            MANDIMITRA
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.nav.dashboard}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chatbot')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'chatbot'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MessageSquareText className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.nav.chatbot}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mandis')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'mandis'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.nav.mandiFinder}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'schemes'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.nav.schemes}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <Bell className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.nav.alerts}</span>
            </span>
            {unreadCount > 0 && (
              <span className="font-mono-nums text-xs font-semibold text-emerald-700 shrink-0">
                ({unreadCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.nav.profile}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-900 truncate">{farmer.name}</div>
          <div className="truncate">
            {farmer.locality}, {farmer.place}
          </div>
          <div className="font-mono-nums text-slate-500">{farmer.phone}</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (3-zone workspace header) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="text-sm text-slate-600 truncate">
              <span className="font-semibold text-slate-900">MANDIMITRA</span>
              <span className="mx-2 text-slate-300" aria-hidden="true">
                /
              </span>
              <span>
                {farmer.locality}, {farmer.place}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 p-1 bg-slate-100 rounded-lg">
              {LANGUAGE_SWITCHER.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    language === item.code
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.header.switchFarmer}</span>
            </button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'dashboard', label: t.nav.dashboard },
              { id: 'chatbot', label: t.nav.chatbot },
              { id: 'mandis', label: t.nav.mandiFinder },
              { id: 'schemes', label: t.nav.schemes },
              {
                id: 'alerts',
                label: unreadCount > 0 ? `${t.nav.alerts} (${unreadCount})` : t.nav.alerts,
              },
              { id: 'profile', label: t.nav.profile },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    {t.dashboard.marketOverview}
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {t.header.welcome}: {farmer.name} <span aria-hidden="true">·</span> {farmer.locality}, {farmer.place}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.dashboard.searchCrop}
                      className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-48 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {(
                      [
                        { id: 'all', label: t.dashboard.allCrops },
                        { id: 'gainers', label: t.dashboard.gainersOnly },
                        { id: 'sell', label: t.dashboard.sellNowFilter },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setMarketFilter(f.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          marketFilter === f.id
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commodity Ticker Grid */}
              {filteredCrops.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-slate-600">{t.dashboard.noResults}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setMarketFilter('all');
                    }}
                    className="mt-3 px-4 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 cursor-pointer"
                  >
                    {t.dashboard.resetFilter}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {filteredCrops.map((crop) => {
                    const isSelected = crop.id === selectedCrop.id;
                    const isUp = crop.trendDirection === 'up';
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => setSelectedCropId(crop.id)}
                        className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white border-emerald-700 ring-1 ring-emerald-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-display font-semibold text-base text-slate-900">
                              {crop.name[language]}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[140px]">
                              {crop.variety[language]}
                            </div>
                          </div>
                          <div
                            className={`text-xs font-semibold whitespace-nowrap ${
                              crop.recommendation === 'SELL'
                                ? 'text-emerald-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {crop.recommendation === 'SELL'
                              ? t.dashboard.sellNow
                              : t.dashboard.holdWait}
                          </div>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between gap-2">
                          <div className="font-mono-nums text-lg font-bold text-slate-900">
                            ₹{crop.currentBestPrice.toLocaleString('en-IN')}
                          </div>
                          <div
                            className={`inline-flex items-center gap-0.5 font-mono-nums text-xs font-semibold ${
                              isUp ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {isUp ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {crop.changePercent >= 0 ? '+' : ''}
                              {crop.changePercent}%
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected Crop Deep-Dive */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">
                {/* Crop Detail Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      {selectedCrop.name[language]} <span aria-hidden="true">·</span>{' '}
                      <span className="font-normal text-slate-600 text-base">
                        {selectedCrop.variety[language]}
                      </span>
                    </h2>
                    <div className="text-xs text-slate-500 mt-1">
                      {activeQualityTier.sizeSpec[language]} <span aria-hidden="true">·</span>{' '}
                      {t.dashboard.comparedAcross} {selectedCrop.mandiRates.length}{' '}
                      {t.dashboard.mandisLabel} <span aria-hidden="true">·</span>{' '}
                      {t.dashboard.confidence}:{' '}
                      <span className="font-mono-nums font-medium text-slate-700">
                        {selectedCrop.confidencePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                      {QUALITY_GRADES.map((gradeKey) => (
                        <button
                          key={gradeKey}
                          type="button"
                          onClick={() => setSelectedGrade(gradeKey)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            selectedGrade === gradeKey
                              ? 'bg-white text-emerald-800 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {QUALITY_GRADE_LABELS[gradeKey][language]}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('alerts')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span>{t.dashboard.setPriceAlertBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAskAdvisorForCrop(selectedCrop.name[language])}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      <span>{t.dashboard.askAdvisorBtn}</span>
                    </button>
                  </div>
                </div>

                {/* 4 KPI Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-5 border-b border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500">{t.dashboard.bestCurrentPrice}</div>
                    <div className="mt-1 font-mono-nums text-2xl font-bold text-slate-900">
                      ₹{activeQualityTier.currentBestPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        {t.dashboard.perQuintal}
                      </span>
                    </div>
                    <div
                      className={`mt-1 inline-flex items-center gap-1 font-mono-nums text-xs font-semibold ${
                        activeQualityTier.trendDirection === 'up'
                          ? 'text-emerald-700'
                          : 'text-red-600'
                      }`}
                    >
                      {activeQualityTier.trendDirection === 'up' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {activeQualityTier.priceDiff >= 0 ? '+' : ''}₹
                        {activeQualityTier.priceDiff.toLocaleString('en-IN')} (
                        {activeQualityTier.changePercent >= 0 ? '+' : ''}
                        {activeQualityTier.changePercent}%)
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">{t.dashboard.fiveDayForecast}</div>
                    <div className="mt-1 font-mono-nums text-2xl font-bold text-slate-900">
                      ₹{activeQualityTier.predicted5DayPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        {t.dashboard.perQuintal}
                      </span>
                    </div>
                    <div
                      className={`mt-1 text-xs font-semibold font-mono-nums ${
                        activeQualityTier.forecastDirection === 'increment'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {activeQualityTier.forecastDirection === 'increment'
                        ? t.dashboard.expectedIncrement
                        : t.dashboard.expectedDecrement}{' '}
                      ({activeQualityTier.forecastPercent >= 0 ? '+' : ''}
                      {activeQualityTier.forecastPercent}%)
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">{t.dashboard.advisoryDecision}</div>
                    <div
                      className={`mt-1 font-display text-2xl font-bold ${
                        activeQualityTier.recommendation === 'SELL'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {activeQualityTier.recommendation === 'SELL'
                        ? t.dashboard.sellNow
                        : t.dashboard.holdWait}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {QUALITY_GRADE_LABELS[selectedGrade][language]}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">{t.dashboard.mostProfitableMandi}</div>
                    <div className="mt-1 font-display text-lg font-bold text-slate-900 truncate">
                      {topMandi.name[language]}
                    </div>
                    <div className="mt-1 text-xs text-slate-600 font-mono-nums">
                      {t.dashboard.netProfitEstimate}:{' '}
                      <span className="font-semibold text-emerald-700">
                        ₹{topMandi.netProfitPerQtl.toLocaleString('en-IN')}
                      </span>{' '}
                      ({topMandi.estimatedDistanceKm} km)
                    </div>
                  </div>
                </div>

                {/* Quality & Size Grade Price Breakdown Table */}
                <div className="pb-5 border-b border-slate-200">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-slate-800">
                      {t.dashboard.qualityBreakdownTitle}
                    </h3>
                    <span className="text-xs text-slate-500">{t.dashboard.qualitySelectorLabel}</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
                          <th className="py-2.5 px-3.5">{t.dashboard.qualityGradeCol}</th>
                          <th className="py-2.5 px-3.5">{t.dashboard.qualitySizeCol}</th>
                          <th className="py-2.5 px-3.5 text-right">{t.dashboard.qualityPriceCol}</th>
                          <th className="py-2.5 px-3.5 text-right">{t.dashboard.qualityChangeCol}</th>
                          <th className="py-2.5 px-3.5 text-right">{t.dashboard.qualityForecastCol}</th>
                          <th className="py-2.5 px-3.5 text-right">{t.dashboard.qualityAdviceCol}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {QUALITY_GRADES.map((gradeKey) => {
                          const tier = selectedCrop.qualityTiers[gradeKey];
                          const isSelectedGrade = gradeKey === selectedGrade;
                          const tierUp = tier.trendDirection === 'up';
                          return (
                            <tr
                              key={gradeKey}
                              onClick={() => setSelectedGrade(gradeKey)}
                              className={`cursor-pointer transition-colors ${
                                isSelectedGrade ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-3 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                                {tier.label[language]}
                              </td>
                              <td className="py-3 px-3.5 text-slate-600">
                                {tier.sizeSpec[language]}
                              </td>
                              <td className="py-3 px-3.5 text-right font-mono-nums font-bold text-slate-900 whitespace-nowrap">
                                ₹{tier.currentBestPrice.toLocaleString('en-IN')}
                              </td>
                              <td
                                className={`py-3 px-3.5 text-right font-mono-nums font-semibold whitespace-nowrap ${
                                  tierUp ? 'text-emerald-700' : 'text-red-600'
                                }`}
                              >
                                {tier.changePercent >= 0 ? '+' : ''}
                                {tier.changePercent}%
                              </td>
                              <td
                                className={`py-3 px-3.5 text-right font-mono-nums font-medium whitespace-nowrap ${
                                  tier.forecastDirection === 'increment'
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                ₹{tier.predicted5DayPrice.toLocaleString('en-IN')} (
                                {tier.forecastPercent >= 0 ? '+' : ''}
                                {tier.forecastPercent}%)
                              </td>
                              <td
                                className={`py-3 px-3.5 text-right font-semibold whitespace-nowrap ${
                                  tier.recommendation === 'SELL'
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {tier.recommendation === 'SELL'
                                  ? t.dashboard.sellNow
                                  : t.dashboard.holdWait}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stock-Style Trend & Forecast Chart */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">
                    {t.dashboard.priceTrendTitle} <span aria-hidden="true">·</span>{' '}
                    <span className="font-normal text-slate-600">
                      {QUALITY_GRADE_LABELS[selectedGrade][language]}
                    </span>
                  </h3>
                  <PriceTrendChart
                    history={activeQualityTier.history14d}
                    forecast={activeQualityTier.forecast5d}
                    trendDirection={activeQualityTier.trendDirection}
                    forecastDirection={activeQualityTier.forecastDirection}
                    historicalLabel={t.dashboard.historicalLabel}
                    predictedLabel={t.dashboard.predictedLabel}
                  />
                </div>
              </div>

              {/* Mandi Net Profit Table */}
              <MandiProfitTable
                crop={selectedCrop}
                evaluatedMandis={evaluatedMandis}
                language={language}
                farmerPlace={farmer.place}
                farmerLocality={farmer.locality}
                activeGradeLabel={QUALITY_GRADE_LABELS[selectedGrade][language]}
                cultivationCostPerQtl={currentCultivationCost}
                onCultivationCostChange={(nextCost) =>
                  setCultivationCostByCrop((prev) => ({ ...prev, [selectedCrop.id]: nextCost }))
                }
              />

              {/* Government Schemes & Loss Recovery Livelihood Support */}
              <GovtSchemesPanel
                crop={selectedCrop}
                tier={activeQualityTier}
                language={language}
                isNegativeMargin={isNegativeMargin}
                isMarketDownturn={isMarketDownturn}
                netMarginPerQtl={netMarginPerQtl}
                compact
                onOpenAllSchemes={() => setActiveTab('schemes')}
                onAskSchemeAdvice={handleAskSchemeAdvice}
              />
            </div>
          )}

          {activeTab === 'chatbot' && (
            <PriceAdvisorChat
              farmer={farmer}
              language={language}
              pendingPrompt={pendingChatPrompt}
              onConsumePendingPrompt={() => setPendingChatPrompt(null)}
            />
          )}

          {activeTab === 'mandis' && (
            <div className="space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-xl font-bold text-slate-900">
                    {t.nav.mandiFinder}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {farmer.locality}, {farmer.place}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {crops.map((crop) => (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => setSelectedCropId(crop.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          crop.id === selectedCrop.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {crop.name[language]}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {QUALITY_GRADES.map((gradeKey) => (
                      <button
                        key={gradeKey}
                        type="button"
                        onClick={() => setSelectedGrade(gradeKey)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedGrade === gradeKey
                            ? 'bg-white text-emerald-800 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {QUALITY_GRADE_LABELS[gradeKey][language]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <MandiProfitTable
                crop={selectedCrop}
                evaluatedMandis={evaluatedMandis}
                language={language}
                farmerPlace={farmer.place}
                farmerLocality={farmer.locality}
                activeGradeLabel={QUALITY_GRADE_LABELS[selectedGrade][language]}
                cultivationCostPerQtl={currentCultivationCost}
                onCultivationCostChange={(nextCost) =>
                  setCultivationCostByCrop((prev) => ({ ...prev, [selectedCrop.id]: nextCost }))
                }
              />

              {showLossSupportBanner && (
                <GovtSchemesPanel
                  crop={selectedCrop}
                  tier={activeQualityTier}
                  language={language}
                  isNegativeMargin={isNegativeMargin}
                  isMarketDownturn={isMarketDownturn}
                  netMarginPerQtl={netMarginPerQtl}
                  compact
                  onOpenAllSchemes={() => setActiveTab('schemes')}
                  onAskSchemeAdvice={handleAskSchemeAdvice}
                />
              )}
            </div>
          )}

          {activeTab === 'schemes' && (
            <GovtSchemesPanel
              crop={selectedCrop}
              tier={activeQualityTier}
              language={language}
              isNegativeMargin={isNegativeMargin}
              isMarketDownturn={isMarketDownturn}
              netMarginPerQtl={netMarginPerQtl}
              onAskSchemeAdvice={handleAskSchemeAdvice}
            />
          )}

          {activeTab === 'alerts' && (
            <PriceAlertsPanel
              crops={crops}
              language={language}
              defaultCropId={selectedCrop.id}
              defaultGrade={selectedGrade}
              rules={alertRules}
              notifications={notifications}
              onAddRule={handleAddAlertRule}
              onRemoveRule={handleRemoveAlertRule}
              onMarkAllRead={handleMarkAllRead}
              onClearNotifications={handleClearNotifications}
              onCheckLiveSurge={handleCheckLiveSurge}
              onSelectNotificationCrop={handleSelectNotificationCrop}
            />
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h1 className="font-display text-xl font-bold text-slate-900">
                  {t.profile.title}
                </h1>
                <p className="text-sm text-slate-500 mt-1">{t.profile.subtitle}</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    {t.login.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    {t.login.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1.5">
                      {t.login.placeLabel}
                    </label>
                    <input
                      type="text"
                      value={editPlace}
                      onChange={(e) => setEditPlace(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1.5">
                      {t.login.localityLabel}
                    </label>
                    <input
                      type="text"
                      value={editLocality}
                      onChange={(e) => setEditLocality(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      required
                    />
                  </div>
                </div>

                {profileNotice && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                    {profileNotice}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    {t.profile.saveChanges}
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.profile.logout}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* In-app Price Increase Notification Toast */}
      {activeToast && (() => {
        const toastCrop = crops.find((c) => c.id === activeToast.cropId);
        return (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-4 right-4 z-50 w-[min(calc(100vw-2rem),23rem)] bg-white border border-emerald-200 rounded-xl shadow-lg p-4 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>{t.alerts.toastTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveToast(null)}
                aria-label={t.alerts.dismissBtn}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-display text-sm font-bold text-slate-900">
                {toastCrop ? toastCrop.name[language] : activeToast.cropId}{' '}
                <span aria-hidden="true">·</span>{' '}
                <span className="font-normal text-xs text-slate-600">
                  {QUALITY_GRADE_LABELS[activeToast.grade][language]}
                </span>
              </div>
              <div className="font-mono-nums text-xs text-slate-700">
                <span className="font-bold text-slate-900">
                  ₹{activeToast.newPrice.toLocaleString('en-IN')}
                </span>{' '}
                <span className="font-semibold text-emerald-700">
                  (+₹{activeToast.diffRs.toLocaleString('en-IN')} / +{activeToast.changePercent}%)
                </span>{' '}
                <span aria-hidden="true">·</span>{' '}
                <span className="text-slate-500">{activeToast.bestMandiName[language]}</span>
              </div>
            </div>

            <div className="pt-0.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                {t.alerts.dismissBtn}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSelectNotificationCrop(activeToast.cropId, activeToast.grade)
                }
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.alerts.viewCropBtn}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
