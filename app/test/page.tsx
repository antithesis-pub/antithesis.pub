import { getArticles } from '@/lib/strapi';
import type { Article } from '@/lib/types';

export default async function TestPage() {
  const articles = await getArticles();
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Strapi Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Articles from Strapi:</h2>
        {articles.length === 0 ? (
          <p>No articles found</p>
        ) : (
          <div className="space-y-4">
            {articles.map((article: Article) => (
              <div key={article.id} className="border p-4 rounded">
                <h3 className="text-xl font-bold">{article.title}</h3>
                <p className="text-gray-600">{article.description}</p>
                <p className="text-sm mt-2">Issue: {article.issueNumber}</p>
                <p className="text-sm text-gray-500">
                  Published: {article.publishedAt.toLocaleDateString()}
                </p>
                <div className="mt-2 prose">
                  <p>{article.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}