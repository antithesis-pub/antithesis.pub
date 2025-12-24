import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { getArticle, getArticles } from "@/lib/strapi";  // ← Import both
import { notFound } from "next/navigation";

// TypeScript types for params
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch SINGLE article by slug
  const article = await getArticle(slug);  // ← Changed from getArticles
  
  // Handle article not found
  if (!article) {
    notFound();
  }
  
  // Render different template based on content type
  if (article.type === 'featureArticle') {
    return <FeatureLayout feature={article} />;
  }
  
  return <ArticleLayout article={article} />;
}

// Generate static paths at build time
export async function generateStaticParams() {
  const articles = await getArticles();  // ← This one is correct (no slug)
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}