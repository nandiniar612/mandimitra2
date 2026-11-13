import React, { useState } from 'react';
import type { PricePoint } from '../types.ts';

interface PriceTrendChartProps {
  history: PricePoint[];
  forecast: PricePoint[];
  trendDirection: 'up' | 'down';
  forecastDirection: 'increment' | 'decrement';
  historicalLabel: string;
  predictedLabel: string;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  history,
  forecast,
  trendDirection,
  forecastDirection,
  historicalLabel,
  predictedLabel,
}) => {
  const allPoints = [...history, ...forecast];
  const [hoveredIdx, setHoveredIdx] = useState<number>(history.length - 1);

  const width = 760;
  const height = 250;
  const padLeft = 56;
  const padRight = 22;
  const padTop = 22;
  const padBottom = 34;

  const prices = allPoints.map((p) => p.price);
  const minVal = Math.min(...prices);
  const maxVal = Math.max(...prices);
  const spread = Math.max(maxVal - minVal, 50);
  const yMin = Math.floor(minVal - spread * 0.15);
  const yMax = Math.ceil(maxVal + spread * 0.15);

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getX = (idx: number) => padLeft + (idx / Math.max(allPoints.length - 1, 1)) * chartW;
  const getY = (price: number) => padTop + chartH - ((price - yMin) / (yMax - yMin || 1)) * chartH;

  const historyPath = history
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(p.price).toFixed(1)}`)
    .join(' ');

  const splitIdx = history.length - 1;
  const forecastPoints = [history[splitIdx], ...forecast];
  const forecastPath = forecastPoints
    .map((p, idx) => {
      const globalIdx = splitIdx + idx;
      return `${idx === 0 ? 'M' : 'L'} ${getX(globalIdx).toFixed(1)} ${getY(p.price).toFixed(1)}`;
    })
    .join(' ');

  const areaPath = `${historyPath} L ${getX(splitIdx).toFixed(1)} ${(padTop + chartH).toFixed(1)} L ${getX(0).toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`;

  const historyColor = trendDirection === 'up' ? '#16A34A' : '#DC2626';
  const forecastColor = forecastDirection === 'increment' ? '#047857' : '#D97706';

  const yTicks = [0, 0.33, 0.66, 1].map((t) => Math.round(yMin + t * (yMax - yMin)));
  const activePoint = allPoints[hoveredIdx] ?? history[history.length - 1];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs text-slate-600">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-0.5"
              style={{ backgroundColor: historyColor }}
            />
            <span>{historicalLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: forecastColor }}
            />
            <span>{predictedLabel}</span>
          </div>
        </div>
        <div className="font-mono-nums text-slate-800 font-medium">
          {activePoint.dayLabel} <span aria-hidden="true">·</span> ₹{activePoint.price.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="14-day historical and 5-day predicted price trend chart"
        >
          <defs>
            <linearGradient id="historyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={historyColor} stopOpacity="0.16" />
              <stop offset="100%" stopColor={historyColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[11px] font-mono"
                >
                  ₹{val.toLocaleString('en-IN')}
                </text>
              </g>
            );
          })}

          {/* Forecast Divider Line */}
          <line
            x1={getX(splitIdx)}
            y1={padTop}
            x2={getX(splitIdx)}
            y2={padTop + chartH}
            stroke="#CBD5E1"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Area & Lines */}
          <path d={areaPath} fill="url(#historyFill)" />
          <path
            d={historyPath}
            fill="none"
            stroke={historyColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={forecastPath}
            fill="none"
            stroke={forecastColor}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {allPoints.map((pt, idx) => {
            const cx = getX(idx);
            const cy = getY(pt.price);
            const isSelected = idx === hoveredIdx;
            const dotColor = pt.isForecast ? forecastColor : historyColor;

            return (
              <g key={idx}>
                {(idx === 0 || idx === 6 || idx === splitIdx || idx === allPoints.length - 1) && (
                  <text
                    x={cx}
                    y={height - 10}
                    textAnchor="middle"
                    className="fill-slate-500 text-[11px] font-mono"
                  >
                    {pt.dayLabel}
                  </text>
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 5.5 : 3}
                  fill={isSelected ? '#FFFFFF' : dotColor}
                  stroke={dotColor}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Hit target */}
                <rect
                  x={cx - chartW / (allPoints.length * 2)}
                  y={padTop}
                  width={chartW / allPoints.length}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => setHoveredIdx(idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
