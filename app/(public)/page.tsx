import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/strapi";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Antithesis | Literary Magazine',
  description: 'Antithesis is a literary magazine featuring fiction, poetry, essays, and visual art.',
  keywords: ['literary magazine', 'fiction', 'poetry', 'essays', 'creative writing'],
  openGraph: {
    title: 'Antithesis | Literary Magazine',
    description: 'Antithesis is a literary magazine featuring fiction, poetry, essays, and visual art.',
    url: 'https://antithesis.pub',
    siteName: 'Antithesis',
    images: [
      {
        url: 'https://antithesis.pub/og-image.jpg', // You'll create this
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antithesis | Literary Magazine',
    description: 'Antithesis is a literary magazine featuring fiction, poetry, essays, and visual art.',
    images: ['https://antithesis.pub/og-image.jpg'],
  },
};


export default async function Home() {
  // Get all articles
  const allArticles = await getArticles();
  
  // Separate feature articles from regular articles
  const featureArticles = allArticles.filter(article => article.type === 'featureArticle');
  const regularArticles = allArticles.filter(article => article.type === 'article');
  
  // Get the most recent feature article (first one)
  const heroArticle = featureArticles[0];
  
  // Get the 6 most recent regular articles
  const recentArticles = regularArticles.slice(0, 6);

  return (
    <div className="min-h-screen">

      <div className="text-center pb-4 text-sm font-mono">A Magazine Of Literature and the Arts</div>
      {/* Hero Feature Article */}
      {heroArticle && heroArticle.type === 'featureArticle' && (
        <section className="mb-16">
          <Link 
            href={`/articles/${heroArticle.slug}`}
            className="group block"
          >
            <div className="relative h-[60vh] w-full overflow-hidden">
              {heroArticle.coverImage && (
                <Image
                  src={heroArticle.coverImage.url}
                  alt={heroArticle.coverImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Hero content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 group-hover:text-gray-200 transition">
                    {heroArticle.title}
                  </h1>
                  
                  {heroArticle.subtitle && (
                    <p className="text-xl md:text-2xl text-gray-200 mb-2 font-light">
                      {heroArticle.subtitle}
                    </p>
                  )}
                  
                  <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-2xl">
                    {heroArticle.description}
                  </p>
                  
                  {heroArticle.author && (
                    <div className="text-sm text-gray-300">
                      by {heroArticle.author.name} • {new Date(heroArticle.publishedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recent Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-8">Recent Articles</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className="group"
            >
              <article className="h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 grow line-clamp-3">
                  {article.description}
                </p>
                
                <div className="text-sm text-gray-500 pt-2 border-t border-gray-200">
                  {article.author?.name && (
                    <span>by {article.author.name} • </span>
                  )}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View all articles link */}
        <div className="mt-12 text-center">
          <Link 
            href="/articles" 
            className="inline-block px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition font-medium"
          >
            View All Articles →
          </Link>
        </div>
      </section>
    </div>
  );
}