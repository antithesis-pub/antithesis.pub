"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config/siteConfig";

export default function SiteHeader() {
  return (
    <header className="w-full bg-black text-white font-sans font-light">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
  
        <div>
          <Link href="/about" className="hover:opacity-70">
                About
          </Link>
        </div>

                <div>
          <Link href="/articles" className="hover:opacity-70">
                Articles
          </Link>
        </div>
        
        <div className="border-b border-zinc-50">
          <Link
            href="/" className="flex text-2xl items-center hover:opacity-80" aria-label={siteConfig.name}
          > {siteConfig.name}
          </Link>
        </div>
        <div>
          <Link href="/contact" className="hover:opacity-70">
                Contact
          </Link>
        </div>
      </div>
        
    </header>
  );
}