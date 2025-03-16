import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background p-2">
      <Header />
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Architect&apos;s website
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            建築家のウェブサイトを集めたデータベースです
          </p>
          <Link
            href="/architects"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md inline-block"
          >
            サイト一覧を見る
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
