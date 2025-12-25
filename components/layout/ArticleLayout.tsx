import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Article } from '@/lib/types';
import * as MDXComponents from '@/components/mdx'; 

export function ArticleLayout({ article }: { article: Article }) {
  return (
      <article className="max-w-4xl mx-auto">
        <h1 className="font-serif text-6xl mb-4 text-center">
          {article.title}
        </h1>
      
        <p className="text-center mb-12">
          by {article.author?.name}
        </p>
        
        <div className="prose prose-lg max-w-prose mx-auto font-serif">
          <MDXRemote 
            source={article.body}
            components={MDXComponents}
          />
        </div>
        <div className="max-w-prose mx-auto text-zinc-500 font-mono font-thin">{article.author.bio}</div>
      </article>
  );
}