export interface ArchitectSite {
  id: string;
  url: string;
  name: string;
  furigana: string;
  isInternational: boolean;
  location: string;
  canDisplayIframe: boolean;
  thumbnail?: string;
}

export const architectSites: ArchitectSite[] = [
  {
    id: "jun-igarashi",
    url: "https://jun-igarashi.jp/",
    name: "五十嵐淳建築設計事務所",
    furigana: "いがらしじゅんけんちくせっけいじむしょ",
    isInternational: false,
    location: "北海道",
    canDisplayIframe: true,
  },
  {
    id: "big",
    url: "https://big.dk/",
    name: "BIG (Bjarke Ingels Group)",
    furigana: "ビッグ",
    isInternational: true,
    location: "デンマーク",
    canDisplayIframe: false,
  },
  {
    id: "mvrdv",
    url: "https://www.mvrdv.com/",
    name: "MVRDV",
    furigana: "エムブイアールディーブイ",
    isInternational: true,
    location: "オランダ",
    canDisplayIframe: false,
  },
  {
    id: "kkaa",
    url: "https://kkaa.co.jp/",
    name: "隈研吾建築都市設計事務所",
    furigana: "くまけんごけんちくとしせっけいじむしょ",
    isInternational: false,
    location: "東京都",
    canDisplayIframe: true,
  },
  {
    id: "yasutaka-yoshimura",
    url: "https://www.yasutakayoshimura.com/",
    name: "吉村靖孝建築設計事務所",
    furigana: "よしむらやすたかけんちくせっけいじむしょ",
    isInternational: false,
    location: "東京都",
    canDisplayIframe: true,
  },
];
