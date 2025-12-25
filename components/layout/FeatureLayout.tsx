import { MDXRemote } from 'next-mdx-remote/rsc';
import * as MDXComponents from '@/components/mdx'; 
import type { FeatureArticle } from '@/lib/types';
import Image from "next/image";

export function FeatureLayout({ feature }: { feature: FeatureArticle }) {
  return (
    
      <article className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1 className="text-6xl text-center pb-4 font-sans">
          {feature.title}
        </h1>
        
        {/* COVER IMAGE */}
        {feature.coverImage && (
          <div className="w-full my-8">
            <Image
              src={feature.coverImage.url}
              alt={feature.coverImage.alt}
              width={feature.coverImage.width}
              height={feature.coverImage.height}
              className="w-full h-auto"
              priority
            />
          </div>
        )}
        
        {/* SUBTITLE */}
        <h2 className="text-4xl text-center pb-4 font-mono">
          {feature.subtitle}
        </h2>
        
        {/* AUTHOR */}
        {feature.author && (
        <p className="text-2xl text-center pb-4 font-mono">
          by {feature.author.name}
        </p>
        )}
        
        {/* BODY */}
        <div className="prose prose-lg max-w-prose mx-auto">
          <MDXRemote 
            source={feature.body}
            components={MDXComponents}
          />
        </div>
        {feature.author?.bio && (
        <div className="max-w-prose mx-auto text-zinc-500 font-mono font-thin">{feature.author.bio}</div>
        )}
      </article>
    
  );
}