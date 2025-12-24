import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
            <SiteHeader />
            <div className="flex min-h-screen items-center justify-center font-serif bg-black">
              <main className="min-h-screen w-full max-w-3xl flex flex-col pt-10 px-8 py-12 bg-black">
                {children}
                </main>
            </div>
            <SiteFooter />
    </div>
  );
}