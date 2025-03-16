import { SiteGrid } from "@/components/site-grid";
import { getArchitectSitesFromNotion } from "@/lib/notion";
import { architectSites } from "@/lib/dataConst";

// ISRの設定（60分ごとに再検証）
export const revalidate = 3600;

export default async function ArchitectsPage() {
  // ビルド時またはISR再検証時にNotionからデータを取得
  try {
    const sites = await getArchitectSitesFromNotion();

    // Notionからデータが取得できた場合はそれを使用
    if (sites && sites.length > 0) {
      return (
        <div className="container py-8">
          <SiteGrid sites={sites} />
        </div>
      );
    }

    return (
      <div className="container py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-6">
          <p>
            Notionデータベースからデータを取得できませんでした。ローカルデータを表示しています。
          </p>
        </div>
        <SiteGrid sites={architectSites} />
      </div>
    );
  } catch (error) {
    // エラーが発生した場合もローカルデータを使用
    console.error("Error in ArchitectsPage:", error);
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>
            データベースへの接続中にエラーが発生しました。ローカルデータを表示しています。
          </p>
        </div>
        <SiteGrid sites={architectSites} />
      </div>
    );
  }
}
