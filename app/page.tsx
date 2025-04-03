import { SiteGrid } from "@/components/site-grid";
import { getArchitectSitesFromNotion } from "@/lib/notion";
import { architectSites } from "@/lib/dataConst";
import Image from "next/image";

// ISRの設定（60分ごとに再検証）
export const revalidate = 3600;

export default async function Home() {
  try {
    const sites = await getArchitectSitesFromNotion();

    return (
      <div className="relative top-0">
        <div className="flex flex-col text-center min-h-screen bg-forest relative">
          <div className="relative w-[80%] h-[80vh] mr-auto">
            <Image
              src="/logo-white-wrap.svg"
              alt="logo"
              fill
              className="object-contain object-left p-8"
              priority
            />
          </div>
          <div className="max-w-6xl mx-auto px-8 py-32">
            {/* <p className="text-3xl font-light text-forest/80 tracking-wide leading-relaxed max-w-2xl">
                建築家のウェブサイトを集めた
                <br />
                ミニマルでエレガントなデータベース
              </p> */}
          </div>
          <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-10">
            <div className="arrow-down animate-bounce"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 pb-32">
          {sites && sites.length > 0 ? (
            <SiteGrid sites={sites} />
          ) : (
            <SiteGrid sites={architectSites} />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in HomePage:", error);
    return (
      <main className="min-h-screen">
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-forest/5 to-transparent" />
        </div>

        <div className="relative">
          <div className="max-w-6xl mx-auto px-8 py-32">
            <div className="flex flex-col items-center text-center space-y-8">
              <h1 className="text-6xl font-light text-forest tracking-tight">
                Architect&apos;s website
              </h1>
              <p className="text-3xl font-light text-forest/80 tracking-wide leading-relaxed max-w-2xl">
                建築家のウェブサイトを集めた
                <br />
                ミニマルでエレガントなデータベース
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 pb-32">
            <div className="bg-red-50/30 border border-red-200 text-red-700 px-8 py-6 rounded-lg mb-12 backdrop-blur-sm max-w-2xl mx-auto">
              <p className="text-lg">
                データベースへの接続中にエラーが発生しました。ローカルデータを表示しています。
              </p>
            </div>
            <SiteGrid sites={architectSites} />
          </div>
        </div>
      </main>
    );
  }
}
