import { siteConfig } from "@/lib/config/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="items-center text-center font-sans">
      <p>© {new Date().getFullYear()} {siteConfig.company}</p>
    </footer>
  );
}