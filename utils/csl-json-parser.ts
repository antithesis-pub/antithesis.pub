// utils/csl-json-parser.ts

import type { CitationData } from '@/components/CitationManager';

interface CSLItem {
  id: string;
  type: string;
  author?: Array<{ family: string; given: string }>;
  editor?: Array<{ family: string; given: string }>;
  issued?: { 'date-parts': number[][] };
  title?: string;
  'container-title'?: string;
  volume?: string | number;
  issue?: string | number;
  page?: string;
  DOI?: string;
  URL?: string;
  publisher?: string;
  'publisher-place'?: string;
}

/**
 * Parse CSL-JSON format into CitationData array
 */
export function parseCSLJSON(jsonString: string): CitationData[] {
  try {
    const data = JSON.parse(jsonString);
    const items = Array.isArray(data) ? data : [data];
    
    return items.map(convertCSLToCitation).filter((c): c is CitationData => c !== null);
  } catch (error) {
    console.error('Error parsing CSL-JSON:', error);
    return [];
  }
}

/**
 * Convert CSL item to CitationData
 */
function convertCSLToCitation(item: CSLItem): CitationData | null {
  // Extract authors
  const authorList = item.author || item.editor;
  if (!authorList) {
    console.warn(`No authors found for item: ${item.id}`);
    return null;
  }
  
  const authors = authorList.map(author => 
    `${author.family}, ${author.given?.charAt(0) || ''}.`
  );
  
  // Extract year
  const year = item.issued?.['date-parts']?.[0]?.[0];
  if (!year) {
    console.warn(`No year found for item: ${item.id}`);
    return null;
  }
  
  const title = item.title;
  if (!title) {
    console.warn(`No title found for item: ${item.id}`);
    return null;
  }
  
  const citation: CitationData = {
    id: item.id,
    authors,
    year,
    title,
  };
  
  // Add optional fields
  if (item['container-title']) citation.publication = item['container-title'];
  if (item.volume) citation.volume = String(item.volume);
  if (item.issue) citation.issue = String(item.issue);
  if (item.page) citation.pages = item.page;
  if (item.DOI) citation.doi = item.DOI;
  if (item.URL) citation.url = item.URL;
  if (item.publisher) citation.publisher = item.publisher;
  if (item['publisher-place']) citation.location = item['publisher-place'];
  
  return citation;
}

/**
 * Export CitationData to CSL-JSON format
 */
export function exportToCSLJSON(citations: CitationData[]): string {
  const cslItems = citations.map(citation => {
    const authors = citation.authors.map(author => {
      const parts = author.split(',').map(s => s.trim());
      return {
        family: parts[0],
        given: parts[1]?.replace('.', '') || '',
      };
    });
    
    const item: CSLItem = {
      id: citation.id,
      type: citation.publication ? 'article-journal' : 'book',
      author: authors,
      issued: {
        'date-parts': [[citation.year]],
      },
      title: citation.title,
    };
    
    if (citation.publication) item['container-title'] = citation.publication;
    if (citation.volume) item.volume = citation.volume;
    if (citation.issue) item.issue = citation.issue;
    if (citation.pages) item.page = citation.pages;
    if (citation.doi) item.DOI = citation.doi;
    if (citation.url) item.URL = citation.url;
    if (citation.publisher) item.publisher = citation.publisher;
    if (citation.location) item['publisher-place'] = citation.location;
    
    return item;
  });
  
  return JSON.stringify(cslItems, null, 2);
}
