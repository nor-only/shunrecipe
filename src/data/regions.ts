export interface Region {
  id: string;
  name: string;
  nameEn: string;
  prefectures: string[];
  description: string;
}

export const regions: Region[] = [
  {
    id: "hokkaido",
    name: "北海道",
    nameEn: "Hokkaido",
    prefectures: ["北海道"],
    description: "冷涼な気候が育む、乳製品と根菜の宝庫。",
  },
  {
    id: "tohoku",
    name: "東北",
    nameEn: "Tohoku",
    prefectures: ["青森", "岩手", "宮城", "秋田", "山形", "福島"],
    description: "厳しい冬を越えた、滋味深い山の幸と米どころ。",
  },
  {
    id: "kanto",
    name: "関東",
    nameEn: "Kanto",
    prefectures: ["茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川"],
    description: "首都圏の食卓を支える、近郊野菜の一大産地。",
  },
  {
    id: "chubu",
    name: "中部",
    nameEn: "Chubu",
    prefectures: ["新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜", "静岡", "愛知"],
    description: "日本アルプスと太平洋が恵む、多彩な高原野菜。",
  },
  {
    id: "kinki",
    name: "近畿",
    nameEn: "Kinki",
    prefectures: ["三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山"],
    description: "京野菜・大和野菜など、伝統に根差した食文化の中心。",
  },
  {
    id: "chugoku",
    name: "中国",
    nameEn: "Chugoku",
    prefectures: ["鳥取", "島根", "岡山", "広島", "山口"],
    description: "山陰山陽の温暖な気候が育む、果実のような甘み。",
  },
  {
    id: "shikoku",
    name: "四国",
    nameEn: "Shikoku",
    prefectures: ["徳島", "香川", "愛媛", "高知"],
    description: "黒潮が運ぶ温暖な気候と、太陽をたっぷり浴びた早出し野菜。",
  },
  {
    id: "kyushu",
    name: "九州・沖縄",
    nameEn: "Kyushu & Okinawa",
    prefectures: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"],
    description: "温暖な気候を活かした、年中続く豊かな野菜づくり。",
  },
];

export type RegionId = (typeof regions)[number]["id"];

export function getRegionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}

export function getRegionName(id: string): string {
  return getRegionById(id)?.name ?? id;
}
