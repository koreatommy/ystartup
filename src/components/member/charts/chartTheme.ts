/** Recharts `fill`용 — SVG에서 CSS 변수 해석이 불안정해 hex 사용 */
export const FALLBACK_CHART_HEX = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#06b6d4", "#ec4899"];

export const CHART_RADIAL_TRACK = {
  fill: "rgba(51, 65, 85, 0.45)",
};

export function chartColorAt(index: number): string {
  const i = index % FALLBACK_CHART_HEX.length;
  return FALLBACK_CHART_HEX[i] ?? "#3b82f6";
}

export function pieSliceLabel(payload: { name?: string; percent?: number }) {
  const pct = Math.round((payload.percent ?? 0) * 100);
  return `${payload.name ?? ""} ${pct}%`;
}
