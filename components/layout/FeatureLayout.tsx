import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { MDXRemote } from 'next-mdx-remote/rsc';
import * as MDXComponents from '@/components/mdx'; 
import type { FeatureArticle } from '@/lib/types';
import Image from "next/image";

export function FeatureLayout({ feature }: { feature: FeatureArticle }) {

  console.log('Feature article:', feature);  // ← Add this
  console.log('Cover image:', feature.coverImage);  // ← Add this
  
  return (
    <article className="max-w-4xl mx-auto">
      <SiteHeader />
      
      {/* TITLE */}
      <h1 className="text-6xl text-center pb-4 font-sans">
        {feature.title}
      </h1>
      
      {/* COVER IMAGE - only show if exists */}
      {feature.coverImage && (
        <div className="w-full my-8">
          <Image
            src={feature.coverImage.url}
            alt={feature.coverImage.alt}
            width={feature.coverImage.width}
            height={feature.coverImage.height}
            className="w-full h-auto"  // Make responsive
            priority
          />
        </div>
      )}
      
      {/* SUBTITLE */}
      <h2 className="text-4xl text-center pb-4 font-mono">
        {feature.subtitle}
      </h2>
      
      {/* AUTHOR BYLINE */}
      <p className="text-2xl text-center pb-4 font-mono">
        by {feature.author.name}
      </p>
      
      {/* BODY */}
      <div className="prose prose-lg max-w-prose mx-auto">
        <MDXRemote 
          source={feature.body}
          components={MDXComponents}
        />
      </div>
      
      <SiteFooter />
    </article>
  );
}