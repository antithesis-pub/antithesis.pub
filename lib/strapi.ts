import type { Article, FeatureArticle, Author, StrapiAuthorData, Image } from './types';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Get all articles (both types)
export async function getArticles(): Promise<(Article | FeatureArticle)[]> {
  const [articlesRes, featureArticlesRes] = await Promise.all([
    fetch(`${STRAPI_URL}/api/articles?populate=*`, {
      next: { revalidate: 60 }
    }),
    fetch(`${STRAPI_URL}/api/feature-articles?populate=*`, {
      next: { revalidate: 60 }
    })
  ]);
  
  const articles = await articlesRes.json();
  const featureArticles = await featureArticlesRes.json();
  
  if (!articles.data || !featureArticles.data) {
    console.error('API returned unexpected format');
    return [];
  }
  
  const allArticles = [
    ...articles.data.map(transformArticle),
    ...featureArticles.data.map(transformFeatureArticle)
  ];
  
  return allArticles.sort((a, b) => 
    b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

// Get single article by slug (checks both content types)
export async function getArticle(slug: string): Promise<Article | FeatureArticle | null> {
  // Try regular articles first
  const articleRes = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );
  
  if (articleRes.ok) {
    const data = await articleRes.json();
    if (data.data.length > 0) {
      return transformArticle(data.data[0]);
    }
  }
  
  // Try feature articles
  const featureRes = await fetch(
    `${STRAPI_URL}/api/feature-articles?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );
  
  if (featureRes.ok) {
    const data = await featureRes.json();
    if (data.data.length > 0) {
      return transformFeatureArticle(data.data[0]);
    }
  }
  
  return null;
}

// Transform regular article
function transformArticle(data: any): Article {

  console.log('Article author data:', data.author);
  const authorData = data.author?.data || data.author;
  console.log('Extracted authorData:', authorData);
  
  const transformedAuthor = transformAuthor(authorData);
  console.log('Transformed author:', transformedAuthor);

    const result = {
    id: data.id,
    documentId: data.documentId,
    title: data.title,
    description: data.description,
    slug: data.slug,
    body: data.body,
    issueNumber: data.issueNumber,
    author: transformedAuthor,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
    type: "article"  as const,
  };

  console.log('Final article object:', result);  // ← Add this
  console.log('Final article.author:', result.author);  // ← And this

  return result;
}

// Transform feature article
function transformFeatureArticle(data: any): FeatureArticle {
  const authorData = data.author?.data || data.author;
  const transformedAuthor = transformAuthor(authorData);
  return {
    id: data.id,
    documentId: data.documentId,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    coverImage: transformImage(data.coverImage),
    slug: data.slug,
    body: data.body,
    issueNumber: data.issueNumber,
    author: transformedAuthor!,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
    type: "featureArticle" as const,
  };
}

// Helper to transform Strapi author response
function transformAuthor(strapiAuthor: StrapiAuthorData | undefined): Author | undefined {
  if (!strapiAuthor) return undefined;
  
  return {
    id: strapiAuthor.id,
    documentId: strapiAuthor.documentId,
    name: strapiAuthor.name,
    email: strapiAuthor.email,
    bio: strapiAuthor.bio,
    createdAt: strapiAuthor.createdAt,
    updatedAt: strapiAuthor.updatedAt,
    publishedAt: strapiAuthor.publishedAt,
  };
}

function transformImage(strapiImage: any): Image | undefined {
  if (!strapiImage) return undefined;
  
  // Handle both formats: {data: {attributes: {...}}} and direct object
  const img = strapiImage.data?.attributes || strapiImage.data || strapiImage;
  
  return {
    url: `${STRAPI_URL}${img.url}`,
    alt: img.alternativeText || img.name || '',
    width: img.width,
    height: img.height,
  };
}