import React, { useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations.ts';
import type { CropAnalysis, Language, MandiProfitEvaluation } from '../types.ts';

interface MandiProfitTableProps {
  crop: CropAnalysis;
  evaluatedMandis: MandiProfitEvaluation[];
  language: Language;
  farmerPlace: string;
  farmerLocality: string;
  activeGradeLabel?: string;
  cultivationCostPerQtl: number;
  onCultivationCostChange: (nextCost: number) => void;
}

export const MandiProfitTable: React.FC<MandiProfitTableProps> = ({
  crop,
  evaluatedMandis,
  language,
  farmerPlace,
  farmerLocality,
  activeGradeLabel,
  cultivationCostPerQtl,
  onCultivationCostChange,
}) => {
  const t = TRANSLATIONS[language];
  const [quintals, setQuintals] = useState<number>(10);

  const topMandi = evaluatedMandis[0];
  const safeQuintals = Number.isFinite(quintals) && quintals > 0 ? quintals : 1;
  const safeCost = Number.isFinite(cultivationCostPerQtl) && cultivationCostPerQtl >= 0 ? cultivationCostPerQtl : 0;
  const netMarginPerQtl = topMandi ? topMandi.netProfitPerQtl - safeCost : 0;
  const isLoss = netMarginPerQtl < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">
            {t.mandiTable.title} <span aria-hidden="true">·</span> {crop.name[language]}
            {activeGradeLabel && (
              <>
                {' '}
                <span aria-hidden="true">·</span>{' '}
                <span className="text-sm font-medium text-emerald-700">{activeGradeLabel}</span>
              </>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t.mandiTable.subtitle} ({farmerLocality}, {farmerPlace})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span>{t.mandiTable.quantityLabel}:</span>
            <input
              type="number"
              min={1}
              max={1000}
              value={quintals}
              onChange={(e) => setQuintals(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 px-2.5 py-1.5 text-sm font-mono-nums border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span>{t.mandiTable.cultivationCostLabel}:</span>
            <input
              type="number"
              min={0}
              max={200000}
              step={50}
              value={safeCost}
              onChange={(e) => onCultivationCostChange(Math.max(0, Number(e.target.value) || 0))}
              className="w-24 px-2.5 py-1.5 text-sm font-mono-nums border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </label>

          {topMandi && (
            <div className="flex items-center gap-5 pl-2 border-l border-slate-200">
              <div className="text-right">
                <div className="text-[11px] text-slate-500">{t.mandiTable.totalProjectedNet}</div>
                <div className="font-mono-nums text-base font-bold text-emerald-700">
                  ₹{(topMandi.netProfitPerQtl * safeQuintals).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-500">{t.mandiTable.estimatedProfitLoss}</div>
                <div
                  className={`font-mono-nums text-base font-bold ${
                    isLoss ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {isLoss ? '-' : '+'}₹
                  {Math.abs(netMarginPerQtl * safeQuintals).toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-semibold">
                    ({isLoss ? t.mandiTable.lossStatus : t.mandiTable.profitStatus})
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
              <th className="py-3 px-4">{t.mandiTable.mandiName}</th>
              <th className="py-3 px-4">{t.mandiTable.district}</th>
              <th className="py-3 px-4 text-right">{t.mandiTable.modalPrice}</th>
              <th className="py-3 px-4 text-right">{t.mandiTable.distance}</th>
              <th className="py-3 px-4 text-right">{t.mandiTable.transportCost}</th>
              <th className="py-3 px-4 text-right">{t.mandiTable.arrivals}</th>
              <th className="py-3 px-4 text-right">{t.mandiTable.netProfit}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {evaluatedMandis.map((mandi) => (
              <tr
                key={mandi.mandiId}
                className={`transition-colors ${
                  mandi.isMostProfitable ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <td className="py-3.5 px-4 font-medium text-slate-900">
                  <div>{mandi.name[language]}</div>
                  {mandi.isMostProfitable && (
                    <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {t.mandiTable.topProfitTag}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {mandi.district} <span aria-hidden="true">·</span> {mandi.state}
                </td>
                <td className="py-3.5 px-4 text-right font-mono-nums text-slate-900">
                  ₹{mandi.modalPrice.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right font-mono-nums text-slate-600">
                  {mandi.estimatedDistanceKm} km
                </td>
                <td className="py-3.5 px-4 text-right font-mono-nums text-slate-600">
                  -₹{mandi.transportCostPerQtl.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right font-mono-nums text-slate-600">
                  {mandi.arrivalsTonnes} T
                </td>
                <td className="py-3.5 px-4 text-right font-mono-nums font-bold text-emerald-700">
                  ₹{mandi.netProfitPerQtl.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
