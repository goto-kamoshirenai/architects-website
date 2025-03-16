import { Client } from "@notionhq/client";
import { ArchitectSite } from "./dataConst";

// Notionクライアントの初期化
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

// Notionデータベースからデータを取得する関数
export async function getArchitectSitesFromNotion(): Promise<ArchitectSite[]> {
  try {
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not defined");
    }

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(response);

    // IDの重複をチェックするためのセット
    const usedIds = new Set<string>();

    // 結果を処理し、IDが空または重複している場合は一意のIDを生成
    const sites = response.results.map((page, index) => {
      // @ts-expect-error - Notionの型定義が複雑なため、ここでは型チェックを無視
      const properties = page.properties;

      // IDを取得（空の場合はページIDを使用）
      let id = properties.id?.rich_text?.[0]?.plain_text || `notion-${page.id}`;

      // IDが既に使用されている場合は、インデックスを追加して一意にする
      if (usedIds.has(id)) {
        id = `${id}-${index}`;
      }

      // IDをセットに追加
      usedIds.add(id);

      return {
        id,
        url: properties.url?.url || "",
        name: properties.name?.rich_text?.[0]?.plain_text || "",
        furigana: properties.furigana?.rich_text?.[0]?.plain_text || "",
        isInternational: properties.isInternational?.checkbox || false,
        location: properties.location?.rich_text?.[0]?.plain_text || "",
        canDisplayIframe: properties.canDisplayIframe?.checkbox || false,
      };
    });

    // 空のIDがないことを確認
    const hasEmptyIds = sites.some((site) => !site.id);
    if (hasEmptyIds) {
      console.warn(
        "Some sites have empty IDs. This may cause React key issues."
      );
    }

    return sites;
  } catch (error) {
    console.error("Error fetching data from Notion:", error);

    return [];
  }
}
