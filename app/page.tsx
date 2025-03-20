import { SiteGrid } from "@/components/site-grid";
import { getArchitectSitesFromNotion } from "@/lib/notion";
import { architectSites } from "@/lib/dataConst";
import Image from "next/image";

// ISRの設定（60分ごとに再検証）
export const revalidate = 3600;

export default async function Home() {
  // ビルド時またはISR再検証時にNotionからデータを取得
  try {
    const sites = await getArchitectSitesFromNotion();

    return (
      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-2 gap-2 mt-6">
          <Image
            src="/logo.svg"
            alt="logo"
            width={500}
            height={100}
            style={{ height: "auto" }}
          />
          <p className="text-xl text-muted-foreground mb-8 text-forest">
            建築家のウェブサイトデータベース
          </p>
        </div>

        {sites && sites.length > 0 ? (
          <SiteGrid sites={sites} />
        ) : (
          <SiteGrid sites={architectSites} />
        )}
      </main>
    );
  } catch (error) {
    console.error("Error in HomePage:", error);
    return (
      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Architect&apos;s website
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            建築家のウェブサイトを集めたデータベースです
          </p>
        </div>

        <div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>
              データベースへの接続中にエラーが発生しました。ローカルデータを表示しています。
            </p>
          </div>
          <SiteGrid sites={architectSites} />
        </div>
      </main>
    );
  }
}
