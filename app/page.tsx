import { SiteGrid } from "@/components/site-grid";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Architect&apos;s website
          </h1>
        </div>
        <SiteGrid />
      </main>
      <Footer />
    </div>
  );
}
