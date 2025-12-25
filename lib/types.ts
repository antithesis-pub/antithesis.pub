// lib/types.ts

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: Image;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  body: string;
  issueNumber: number;
  author?: Author; // Optional because it might not be populated
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: 'article' | 'feature';
}

export interface FeatureArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  body: string;
  issueNumber: number;
  coverImage?: Image; // Optional because it might not exist
  author?: Author; // Optional because it might not be populated
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: 'feature';
}

export interface DepartmentArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  body: string;
  issueNumber: number;
  author?: Author; // Optional because it might not be populated
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: 'article';
}

// Strapi API response structure
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
}

// Helper type for Strapi entity structure
export interface StrapiEntity<T> {
  id: number;
  documentId: string;
  attributes: T;
}
