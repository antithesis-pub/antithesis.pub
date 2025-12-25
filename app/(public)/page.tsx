import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    
      <main>
       
        <div className="font-mono text-white">
          
          Some more content for the home page

          <p className="font-sans">
            Some font in sans
          </p>

          <Link href="/articles">Browse Articles</Link>
  
        </div>
         
      </main>
    
  );
}
