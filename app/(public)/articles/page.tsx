import { getArticles } from "@/lib/strapi";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import Image from "next/image";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      
        <h1 className="text-5xl text-center mb-12">Articles</h1>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className="group border rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Show cover image for feature articles */}
              {article.type === 'featureArticle' && article.coverImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.coverImage.url}
                    alt={article.coverImage.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">
                  {article.title}
                </h2>
                
                {article.type === 'featureArticle' && article.subtitle && (
                  <p className="text-lg text-gray-600 mb-2">{article.subtitle}</p>
                )}
                
                <p className="text-gray-700 mb-4 line-clamp-3">{article.description}</p>
                
                <div className="text-sm text-gray-500">
                  by {article.author?.name || 'Unknown'} • {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      
    </div>
  );
}