// 郵便番号（7桁、またはハイフン付き）から地域IDへの近似マッピング。
// 日本郵便の地域番号の頭3桁をもとに、UPGRADE_PROMPT.md の8地域へ分類。
import type { RegionId } from './regions';

export function postalToRegion(postal: string): RegionId | null {
  const digits = postal.replace(/[^0-9]/g, '');
  if (digits.length < 3) return null;
  const p = parseInt(digits.slice(0, 3), 10);
  if (isNaN(p)) return null;

  // 北海道（一部）
  if (p >= 0 && p <= 9) return 'hokkaido';
  // 東北（秋田・岩手・青森）
  if (p >= 10 && p <= 39) return 'tohoku';
  // 北海道
  if (p >= 40 && p <= 99) return 'hokkaido';
  // 関東
  if (p >= 100 && p <= 379) return 'kanto';
  // 中部（長野・山梨・静岡・愛知・岐阜）
  if (p >= 380 && p <= 509) return 'chubu';
  // 近畿（三重〜和歌山）
  if (p >= 510 && p <= 679) return 'kinki';
  // 中国
  if (p >= 680 && p <= 759) return 'chugoku';
  // 四国
  if (p >= 760 && p <= 799) return 'shikoku';
  // 九州・沖縄
  if (p >= 800 && p <= 909) return 'kyushu_okinawa';
  // 北陸（中部扱い: 新潟・富山・石川・福井）
  if (p >= 910 && p <= 959) return 'chubu';
  // 東北（福島・宮城・山形）
  if (p >= 960 && p <= 999) return 'tohoku';
  return null;
}
