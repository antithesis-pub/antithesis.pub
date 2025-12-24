import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";

export default function Home() {
  return (
    
      <main>
       <PageShell>
        <div className="font-mono text-white">
          
          Some more content for the home page

          <p className="font-sans">
            Some font in sans
          </p>
  
        </div>
       </PageShell>  
      </main>
    
  );
}
