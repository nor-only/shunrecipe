// 西暦と旧暦風月名を組み合わせた誌面用ラベル。
// 例: 2026年　卯月  (4月)
const WAFU_MONTHS = [
  '睦月', '如月', '弥生', '卯月', '皐月', '水無月',
  '文月', '葉月', '長月', '神無月', '霜月', '師走',
];

export function wafuLabel(d: Date = new Date()): string {
  const y = d.getFullYear();
  const month = WAFU_MONTHS[d.getMonth()];
  return `${y}年　${month}`;
}
