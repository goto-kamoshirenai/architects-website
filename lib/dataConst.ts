export interface ArchitectSite {
  id: string;
  url: string;
  name: string;
  furigana: string;
  isInternational: boolean;
  location: string;
  canDisplayIframe: boolean;
  thumbnail?: string;
  rate: number;
  notQuote: boolean;
  tech: string[];
  performancePoint: number;
  seoPoint: number;
  accessibilityPoint: number;
  techStackPoint: number;
  responsivePoint: number;
}

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// CSVレコードの型定義
interface CSVRecord {
  id: string;
  url: string;
  name: string;
  furigana: string;
  isInternational: string;
  location: string;
  canDisplayIframe: string;
  rate: number;
  notQuote: string;
  tech: string[];
  performancePoint: string;
  seoPoint: string;
  accessibilityPoint: string;
  techStackPoint: string;
  responsivePoint: string;
}

// CSVファイルからデータを読み込む関数
function loadArchitectSitesFromCSV(): ArchitectSite[] {
  try {
    // CSVファイルのパスを取得
    const csvFilePath = path.join(process.cwd(), "lib", "defalutData.csv");

    // CSVファイルを読み込む
    const csvData = fs.readFileSync(csvFilePath, "utf8");

    // CSVをパースする
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    }) as CSVRecord[];

    // データを変換する
    const sites = records.map((record: CSVRecord) => {
      const site = {
        id: record.id,
        url: record.url,
        name: record.name,
        furigana: record.furigana.trim(),
        isInternational: record.isInternational === "Yes",
        location: record.location,
        canDisplayIframe: record.canDisplayIframe === "Yes",
        rate: record.rate,
        notQuote: record.notQuote === "Yes",
        tech: record.tech,
        performancePoint: Number(record.performancePoint || 0),
        seoPoint: Number(record.seoPoint || 0),
        accessibilityPoint: Number(record.accessibilityPoint || 0),
        techStackPoint: Number(record.techStackPoint || 0),
        responsivePoint: Number(record.responsivePoint || 0),
      };

      return site;
    });

    return sites;
  } catch (error) {
    console.error("CSVファイルの読み込みに失敗しました:", error);
    throw new Error("CSVファイルの読み込みに失敗しました");
  }
}

// CSVからデータを読み込む
export const architectSites: ArchitectSite[] = loadArchitectSitesFromCSV();
