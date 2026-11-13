import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Bell, BellRing, CheckCheck, Plus, Trash2, TrendingUp } from 'lucide-react';
import { QUALITY_GRADE_LABELS } from '../data/marketData.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import type {
  CropAnalysis,
  Language,
  PriceAlertRule,
  PriceNotification,
  QualityGrade,
} from '../types.ts';

interface PriceAlertsPanelProps {
  crops: CropAnalysis[];
  language: Language;
  defaultCropId: string;
  defaultGrade: QualityGrade;
  rules: PriceAlertRule[];
  notifications: PriceNotification[];
  onAddRule: (rule: Omit<PriceAlertRule, 'id' | 'createdAt' | 'enabled'>) => void;
  onRemoveRule: (ruleId: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
  onCheckLiveSurge: () => void;
  onSelectNotificationCrop: (cropId: string, grade: QualityGrade) => void;
}

const GRADES: QualityGrade[] = ['gradeA', 'gradeB', 'gradeC'];

export const PriceAlertsPanel: React.FC<PriceAlertsPanelProps> = ({
  crops,
  language,
  defaultCropId,
  defaultGrade,
  rules,
  notifications,
  onAddRule,
  onRemoveRule,
  onMarkAllRead,
  onClearNotifications,
  onCheckLiveSurge,
  onSelectNotificationCrop,
}) => {
  const t = TRANSLATIONS[language];
  const [cropId, setCropId] = useState(defaultCropId);
  const [grade, setGrade] = useState<QualityGrade>(defaultGrade);
  const [minIncreasePercent, setMinIncreasePercent] = useState<number>(3);

  const selectedCrop = crops.find((c) => c.id === cropId) ?? crops[0];
  const selectedTier = selectedCrop.qualityTiers[grade];
  const [targetPrice, setTargetPrice] = useState<number>(() =>
    Math.round(selectedTier.currentBestPrice * 1.04)
  );

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>(
    () => {
      if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
      return window.Notification.permission;
    }
  );

  useEffect(() => {
    setCropId(defaultCropId);
    setGrade(defaultGrade);
  }, [defaultCropId, defaultGrade]);

  useEffect(() => {
    const cropObj = crops.find((c) => c.id === cropId) ?? crops[0];
    const tier = cropObj.qualityTiers[grade];
    setTargetPrice(Math.round(tier.currentBestPrice * 1.04));
  }, [cropId, grade, crops]);

  const handleEnableBrowserAlerts = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const perm = await window.Notification.requestPermission();
      setBrowserPermission(perm);
    } catch {
      // Ignore permission rejection errors cleanly
    }
  };

  const handleSubmitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) return;
    onAddRule({
      cropId,
      grade,
      targetPrice: Math.round(targetPrice),
      minIncreasePercent: Math.max(0.5, Number(minIncreasePercent) || 2),
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getReasonLabel = (reason: PriceNotification['reason']) => {
    if (reason === 'target_reached') return t.alerts.reasonTargetReached;
    if (reason === 'live_surge') return t.alerts.reasonLiveSurge;
    return t.alerts.reasonDailyGain;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            {t.alerts.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.alerts.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onCheckLiveSurge}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.alerts.checkNowBtn}</span>
          </button>

          {browserPermission === 'default' && (
            <button
              type="button"
              onClick={() => void handleEnableBrowserAlerts()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-emerald-700" />
              <span>{t.alerts.enableBrowserBtn}</span>
            </button>
          )}

          {browserPermission === 'granted' && (
            <span className="text-xs font-medium text-emerald-700 px-2 py-1">
              {t.alerts.browserEnabledLabel}
            </span>
          )}
        </div>
      </div>

      {browserPermission === 'denied' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
          {t.alerts.browserBlockedHint}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Create Alert Rule + Active Rules */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmitRule}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.alerts.createRuleTitle}
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t.alerts.cropLabel}
              </label>
              <select
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[language]} (₹{c.currentBestPrice.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t.alerts.gradeLabel}
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as QualityGrade)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {QUALITY_GRADE_LABELS[g][language]} (₹
                    {selectedCrop.qualityTiers[g].currentBestPrice.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t.alerts.targetPriceLabel}
                </label>
                <input
                  type="number"
                  min={100}
                  step={10}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t.alerts.minPercentLabel}
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={50}
                  step={0.5}
                  value={minIncreasePercent}
                  onChange={(e) => setMinIncreasePercent(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm font-mono-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.alerts.addRuleBtn}</span>
            </button>
          </form>

          {/* Saved Rules */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.alerts.activeRulesTitle}
            </h2>

            {rules.length === 0 ? (
              <p className="text-xs text-slate-500 leading-relaxed">{t.alerts.noRulesText}</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {rules.map((rule) => {
                  const c = crops.find((item) => item.id === rule.cropId);
                  return (
                    <div key={rule.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {c ? c.name[language] : rule.cropId} <span aria-hidden="true">·</span>{' '}
                          <span className="font-normal text-slate-600">
                            {QUALITY_GRADE_LABELS[rule.grade][language]}
                          </span>
                        </div>
                        <div className="text-xs font-mono-nums text-slate-500 mt-0.5">
                          ≥ ₹{rule.targetPrice.toLocaleString('en-IN')} <span aria-hidden="true">·</span>{' '}
                          +{rule.minIncreasePercent}%
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveRule(rule.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.alerts.removeRule}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications Feed */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 flex flex-col">
          <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700" />
              <h2 className="font-display text-base font-bold text-slate-900">
                {t.alerts.inboxTitle}
              </h2>
              {unreadCount > 0 && (
                <span className="text-xs font-mono-nums font-semibold text-emerald-700">
                  ({unreadCount} {t.alerts.unreadLabel})
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{t.alerts.markAllRead}</span>
                </button>
                <button
                  type="button"
                  onClick={onClearNotifications}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  {t.alerts.clearAll}
                </button>
              </div>
            )}
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                {t.alerts.noNotificationsText}
              </div>
            ) : (
              notifications.map((notif) => {
                const c = crops.find((item) => item.id === notif.cropId);
                return (
                  <div
                    key={notif.id}
                    className={`py-4 flex flex-wrap items-center justify-between gap-4 ${
                      notif.read ? '' : 'bg-emerald-50/40 -mx-5 px-5'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-emerald-700">
                          {getReasonLabel(notif.reason)}
                        </span>{' '}
                        <span aria-hidden="true">·</span>{' '}
                        <span className="font-mono-nums">{notif.timestamp}</span>
                        {!notif.read && (
                          <>
                            {' '}
                            <span aria-hidden="true">·</span>{' '}
                            <span className="font-semibold text-emerald-800">
                              {t.alerts.unreadLabel}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="font-display text-base font-bold text-slate-900">
                        {c ? c.name[language] : notif.cropId} <span aria-hidden="true">·</span>{' '}
                        <span className="font-normal text-sm text-slate-600">
                          {QUALITY_GRADE_LABELS[notif.grade][language]}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-700 font-mono-nums">
                        {t.alerts.priceRoseFrom}{' '}
                        <span className="text-slate-500">
                          ₹{notif.previousPrice.toLocaleString('en-IN')}
                        </span>{' '}
                        {t.alerts.toLabel}{' '}
                        <span className="font-bold text-slate-900">
                          ₹{notif.newPrice.toLocaleString('en-IN')}
                        </span>{' '}
                        <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 ml-1">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          +₹{notif.diffRs.toLocaleString('en-IN')} (+{notif.changePercent}%)
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        {notif.bestMandiName[language]}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectNotificationCrop(notif.cropId, notif.grade)}
                      className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {t.alerts.viewCropBtn}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
