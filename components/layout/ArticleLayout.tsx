import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from "next/image";
import type { Article } from '@/lib/types';
import * as MDXComponents from '@/components/mdx'; 

export function ArticleLayout({ article }: { article: Article }) {

  console.log('ArticleLayout received:', article);  // ← Add this
  console.log('Author in layout:', article.author);  // ← And this
  return (

    <article className="max-w-4xl mx-auto">
          <SiteHeader />

        
      <h1 className="font-serif text-6xl mb-4 text-center">
        {article.title}
      </h1>
    
      <p className="text-center mb-12">
        by {article.author.name}
      </p>
      
      <div className="prose prose-lg max-w-prose mx-auto">
        <MDXRemote 
          source={article.body}
          components={MDXComponents}
        />
      </div>
    <SiteFooter />
    </article>
  );
}