import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { getArticle, getArticles } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

// TypeScript types for params
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch SINGLE article by slug
  const article = await getArticle(slug);
  
  // Handle article not found
  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: article.author ? {
      '@type': 'Person',
      name: article.author.name,
    } : undefined,
    datePublished: article.publishedAt.toString(),
    dateModified: article.updatedAt.toString(),
    image: article.type === 'featureArticle' && article.coverImage 
      ? article.coverImage.url 
      : undefined,
  };
  
  // Render different template based on content type with JSON-LD
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {article.type === 'featureArticle' ? (
        <FeatureLayout feature={article} />
      ) : (
        <ArticleLayout article={article} />
      )}
    </>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const articles = await getArticles();
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Antithesis`,
    description: article.description,
    authors: article.author ? [{ name: article.author.name }] : [],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt.toString(),
      authors: article.author ? [article.author.name] : [],
      images: article.type === 'featureArticle' && article.coverImage 
        ? [article.coverImage.url]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.type === 'featureArticle' && article.coverImage 
        ? [article.coverImage.url]
        : [],
    },
  };
}