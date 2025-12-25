// Base interface for all Strapi responses
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Article as it comes from Strapi API
export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  body: string;
  issueNumber: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Raw author data as it comes from Strapi API
export interface StrapiAuthorData {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Image data as it comes from Strapi API
export interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
  url: string;
  mime: string;
  size: number;
}

// Flat article JSON 
export interface Article {
  id: number;
  documentId: string;
  author?: Author;
  title: string;
  description: string;
  slug: string;
  body: string;
  issueNumber: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: "article";
}

// Flat featureArticle JSON 
export interface FeatureArticle {
  title: string;
  subtitle: string;
  author?: Author;
  slug: string;
  id: number;
  coverImage?: Image;
  documentId: string;
  description: string;
  body: string;
  issueNumber: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: "featureArticle";
}

// Flat author JSON
export interface Author {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  bio?: string;
}

// Flat image JSON
export interface Image {
  url: string;
  alt: string;
  width: number;
  height: number;
}