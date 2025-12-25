// lib/strapi.ts

import {
  Article,
  FeatureArticle,
  DepartmentArticle,
  Author,
  Image,
  StrapiEntity,
} from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface StrapiImageData {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: Record<string, unknown>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface StrapiAuthorData {
  id: number;
  documentId: string;
  attributes: {
    name: string;
    email?: string;
    bio?: string;
    avatar?: {
      data?: StrapiImageData;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

interface StrapiArticleAttributes {
  title: string;
  description: string;
  slug: string;
  body: string;
  issueNumber: number;
  author?: {
    data?: StrapiAuthorData;
  };
  coverImage?: {
    data?: StrapiImageData;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Transform Strapi image to our Image type
function transformImage(strapiImage?: StrapiImageData): Image | undefined {
  if (!strapiImage) return undefined;

  return {
    id: strapiImage.id,
    documentId: strapiImage.documentId,
    name: strapiImage.attributes.name,
    alternativeText: strapiImage.attributes.alternativeText,
    caption: strapiImage.attributes.caption,
    width: strapiImage.attributes.width,
    height: strapiImage.attributes.height,
    formats: strapiImage.attributes.formats as Image['formats'],
    hash: strapiImage.attributes.hash,
    ext: strapiImage.attributes.ext,
    mime: strapiImage.attributes.mime,
    size: strapiImage.attributes.size,
    url: strapiImage.attributes.url,
    previewUrl: strapiImage.attributes.previewUrl,
    provider: strapiImage.attributes.provider,
    createdAt: strapiImage.attributes.createdAt,
    updatedAt: strapiImage.attributes.updatedAt,
  };
}

// Transform Strapi author to our Author type
function transformAuthor(strapiAuthor?: StrapiAuthorData): Author | undefined {
  if (!strapiAuthor) return undefined;

  return {
    id: strapiAuthor.id,
    documentId: strapiAuthor.documentId,
    name: strapiAuthor.attributes.name,
    email: strapiAuthor.attributes.email,
    bio: strapiAuthor.attributes.bio,
    avatar: transformImage(strapiAuthor.attributes.avatar?.data),
    createdAt: strapiAuthor.attributes.createdAt,
    updatedAt: strapiAuthor.attributes.updatedAt,
    publishedAt: strapiAuthor.attributes.publishedAt,
  };
}

// Transform Strapi article to our Article type
function transformArticle(strapiArticle: StrapiEntity<StrapiArticleAttributes>): Article {
  const attrs = strapiArticle.attributes;
  
  return {
    id: strapiArticle.id,
    documentId: strapiArticle.documentId,
    title: attrs.title,
    description: attrs.description,
    slug: attrs.slug,
    body: attrs.body,
    issueNumber: attrs.issueNumber,
    author: transformAuthor(attrs.author?.data),
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
    publishedAt: attrs.publishedAt,
    type: 'article',
  };
}

// Transform Strapi feature article to our FeatureArticle type
function transformFeatureArticle(strapiArticle: StrapiEntity<StrapiArticleAttributes>): FeatureArticle {
  const attrs = strapiArticle.attributes;
  
  return {
    id: strapiArticle.id,
    documentId: strapiArticle.documentId,
    title: attrs.title,
    description: attrs.description,
    slug: attrs.slug,
    body: attrs.body,
    issueNumber: attrs.issueNumber,
    coverImage: transformImage(attrs.coverImage?.data),
    author: transformAuthor(attrs.author?.data),
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
    publishedAt: attrs.publishedAt,
    type: 'feature',
  };
}

// Transform Strapi department article to our DepartmentArticle type
function transformDepartmentArticle(strapiArticle: StrapiEntity<StrapiArticleAttributes>): DepartmentArticle {
  const attrs = strapiArticle.attributes;
  
  return {
    id: strapiArticle.id,
    documentId: strapiArticle.documentId,
    title: attrs.title,
    description: attrs.description,
    slug: attrs.slug,
    body: attrs.body,
    issueNumber: attrs.issueNumber,
    author: transformAuthor(attrs.author?.data),
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
    publishedAt: attrs.publishedAt,
    type: 'article',
  };
}

// Fetch all articles
export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${STRAPI_URL}/api/articles?populate=*`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  const json = await res.json();
  return json.data.map(transformArticle);
}

// Fetch all feature articles
export async function getFeatureArticles(): Promise<FeatureArticle[]> {
  const res = await fetch(`${STRAPI_URL}/api/feature-articles?populate=*`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch feature articles');
  }

  const json = await res.json();
  return json.data.map(transformFeatureArticle);
}

// Fetch all department articles
export async function getDepartmentArticles(): Promise<DepartmentArticle[]> {
  const res = await fetch(`${STRAPI_URL}/api/department-articles?populate=*`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch department articles');
  }

  const json = await res.json();
  return json.data.map(transformDepartmentArticle);
}

// Fetch a single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch article');
  }

  const json = await res.json();
  
  if (!json.data || json.data.length === 0) {
    return null;
  }

  return transformArticle(json.data[0]);
}

// Fetch a single feature article by slug
export async function getFeatureArticleBySlug(slug: string): Promise<FeatureArticle | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/feature-articles?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch feature article');
  }

  const json = await res.json();
  
  if (!json.data || json.data.length === 0) {
    return null;
  }

  return transformFeatureArticle(json.data[0]);
}

// Fetch a single department article by slug
export async function getDepartmentArticleBySlug(slug: string): Promise<DepartmentArticle | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/department-articles?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch department article');
  }

  const json = await res.json();
  
  if (!json.data || json.data.length === 0) {
    return null;
  }

  return transformDepartmentArticle(json.data[0]);
}
