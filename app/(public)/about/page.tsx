import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { siteConfig } from "@/lib/config/siteConfig";

export default function Home() {
  return (
    
      <main>
       <PageShell>
        <div className="text-white">
          
          <h1 className="text-3xl text-center pb-4">
            {siteConfig.tagline}
          </h1>

          And what is it that we want to say. It is something worthwhile. Gather round and hear. Listen. Speak.
  
        </div>
       </PageShell>  
      </main>
    
  );
}
