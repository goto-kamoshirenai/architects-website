export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-2">Architect&apos;s website</h2>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Architect&apos;s website. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
