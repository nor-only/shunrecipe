// 日本の旧暦風月名と令和年号ラベル。
const WAFU_MONTHS = [
  '睦月', '如月', '弥生', '卯月', '皐月', '水無月',
  '文月', '葉月', '長月', '神無月', '霜月', '師走',
];

export function wafuLabel(d: Date = new Date()): string {
  const y = d.getFullYear();
  // 令和元年 = 2019年5月〜。 簡易的に年のみで計算（4月以前の場合、厳密には前年度）。
  // 編集誌の奥付的な表記として、1月〜12月を通して同年の令和年で表す。
  const reiwa = y - 2018;
  const month = WAFU_MONTHS[d.getMonth()];
  return `令和${reiwa}年　${month}`;
}
