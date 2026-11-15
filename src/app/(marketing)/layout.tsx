import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg-canvas)] text-foreground selection:bg-primary/20 overflow-x-clip">
      {/* Architectural Continuous Micro-Dot Background Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 select-none opacity-[0.45] dark:opacity-[0.22]"
        style={{
          backgroundImage: `radial-gradient(var(--border-subtle) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
        }}
      />

      <Navbar />
      <main className="relative z-10 flex-1 bg-transparent">{children}</main>
      <Footer />
    </div>
  );
}
