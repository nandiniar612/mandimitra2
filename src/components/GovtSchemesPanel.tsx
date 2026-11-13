import React, { useMemo, useState } from 'react';
import { ExternalLink, Landmark, MessageSquareText, Search, ShieldAlert } from 'lucide-react';
import { recommendSchemesForSituation } from '../data/schemesData.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import type {
  CropAnalysis,
  GovernmentScheme,
  Language,
  LossSituation,
  QualitySizeAnalysis,
} from '../types.ts';

interface GovtSchemesPanelProps {
  crop: CropAnalysis;
  tier: QualitySizeAnalysis;
  language: Language;
  isNegativeMargin: boolean;
  isMarketDownturn?: boolean;
  netMarginPerQtl: number;
  compact?: boolean;
  onOpenAllSchemes?: () => void;
  onAskSchemeAdvice: (scheme: GovernmentScheme) => void;
}

const SITUATION_FILTERS: Array<LossSituation | 'auto'> = [
  'auto',
  'price_crash',
  'crop_damage',
  'debt_relief',
  'livelihood',
];

export const GovtSchemesPanel: React.FC<GovtSchemesPanelProps> = ({
  crop,
  tier,
  language,
  isNegativeMargin,
  isMarketDownturn = false,
  netMarginPerQtl,
  compact = false,
  onOpenAllSchemes,
  onAskSchemeAdvice,
}) => {
  const t = TRANSLATIONS[language];
  const [situationFilter, setSituationFilter] = useState<LossSituation | 'auto'>('auto');
  const [searchQuery, setSearchQuery] = useState('');

  const isLossAlert = isNegativeMargin || isMarketDownturn;

  const schemes = useMemo(() => {
    const base = recommendSchemesForSituation({
      crop,
      tier,
      isLoss: isNegativeMargin,
      situationFilter,
    });
    const q = searchQuery.trim().toLowerCase();
    if (!q || compact) return base;
    return base.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.en.toLowerCase().includes(q) ||
        s.name.hi.toLowerCase().includes(q) ||
        s.name.kn.toLowerCase().includes(q) ||
        s.summary[language].toLowerCase().includes(q)
    );
  }, [crop, tier, isNegativeMargin, situationFilter, searchQuery, compact, language]);

  const visibleSchemes = compact ? schemes.slice(0, 3) : schemes;

  const headerTitle = compact
    ? isLossAlert
      ? t.schemes.lossBannerTitle
      : t.schemes.alwaysVisibleTitle
    : t.schemes.title;

  const headerSubtitle = compact
    ? isNegativeMargin
      ? `${t.schemes.lossBannerNegativeMargin} (${netMarginPerQtl.toLocaleString('en-IN')} ₹/Qtl)`
      : isMarketDownturn
      ? t.schemes.lossBannerPriceDip
      : t.schemes.alwaysVisibleSubtitle
    : t.schemes.subtitle;

  return (
    <section
      className={`rounded-xl border p-5 sm:p-6 space-y-5 ${
        isNegativeMargin
          ? 'bg-red-50/40 border-red-200'
          : compact && isMarketDownturn
          ? 'bg-amber-50/40 border-amber-200'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isNegativeMargin
                ? 'bg-red-100 text-red-700'
                : compact && isMarketDownturn
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {compact && isLossAlert ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <Landmark className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              {headerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {headerSubtitle}
            </p>
          </div>
        </div>

        {compact && onOpenAllSchemes && (
          <button
            type="button"
            onClick={onOpenAllSchemes}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.schemes.viewAllSchemes}
          </button>
        )}
      </div>

      {/* Filter & Search Bar (Full View Only) */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.schemes.searchPlaceholder}
              className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-64 sm:w-72"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {SITUATION_FILTERS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSituationFilter(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  situationFilter === key
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.schemes.situations[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scheme Cards Grid */}
      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
        {visibleSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="text-xs font-mono-nums font-medium text-emerald-700">
                {scheme.code} <span aria-hidden="true">·</span> {t.schemes.situations[scheme.category]}
              </div>

              <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                {scheme.name[language]}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">{scheme.summary[language]}</p>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{t.schemes.benefitLabel}: </span>
                  <span className="text-slate-600">{scheme.benefit[language]}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{t.schemes.eligibilityLabel}: </span>
                  <span className="text-slate-600">{scheme.eligibility[language]}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{t.schemes.documentsLabel}: </span>
                  <span className="text-slate-600">{scheme.documents[language]}</span>
                </div>

                {!compact && scheme.applySteps[language]?.length > 0 && (
                  <div className="pt-1.5">
                    <div className="font-semibold text-slate-800 mb-1">
                      {t.schemes.howToApplyLabel}:
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600">
                      {scheme.applySteps[language].map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-slate-800">{t.schemes.portalLabel}: </span>
                  <span className="font-mono-nums text-emerald-700">{scheme.helplineOrPortal}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAskSchemeAdvice(scheme)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>{t.schemes.askHowToApply}</span>
              </button>

              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>{t.schemes.visitPortal}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
