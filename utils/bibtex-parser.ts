// utils/bibtex-parser.ts

import type { CitationData } from '@/components/citer/CitationManager';

interface BibTeXEntry {
  type: string;
  key: string;
  fields: Record<string, string>;
}

/**
 * Parse BibTeX string into CitationData array
 */
export function parseBibTeX(bibtexString: string): CitationData[] {
  const entries: CitationData[] = [];
  
  // Regular expression to match BibTeX entries
  const entryRegex = /@(\w+)\s*{\s*([^,]+),\s*([\s\S]*?)(?=\n@|\n*$)/g;
  
  let match;
  while ((match = entryRegex.exec(bibtexString)) !== null) {
    const [, type, key, fieldsString] = match;
    
    const fields = parseFields(fieldsString);
    const citation = convertBibTeXToCitation(key, type, fields);
    
    if (citation) {
      entries.push(citation);
    }
  }
  
  return entries;
}

/**
 * Parse field key-value pairs from BibTeX entry
 */
function parseFields(fieldsString: string): Record<string, string> {
  const fields: Record<string, string> = {};
  
  // Match field = {value}, field = "value", or field = value
  // Handles braced, quoted, and bare values
  const fieldRegex = /(\w+)\s*=\s*(?:[{"]([^}"]*)[}"]|(\w+))/g;
  
  let match;
  while ((match = fieldRegex.exec(fieldsString)) !== null) {
    const [, key, bracedValue, bareValue] = match;
    const value = bracedValue || bareValue || '';
    fields[key.toLowerCase()] = cleanBibTeXValue(value);
  }
  
  return fields;
}

/**
 * Clean BibTeX special characters and formatting
 */
function cleanBibTeXValue(value: string): string {
  return value
    .replace(/\\&/g, '&')
    .replace(/\\_/g, '_')
    .replace(/\\%/g, '%')
    .replace(/\\$/g, '$')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    .replace(/~/g, ' ')
    .replace(/``/g, '"')
    .replace(/''/g, '"')
    .trim();
}

/**
 * Parse author names from BibTeX format
 */
function parseAuthors(authorString: string): string[] {
  if (!authorString) return [];
  
  // Split by 'and'
  const authors = authorString.split(/\s+and\s+/i);
  
  return authors.map(author => {
    author = author.trim();
    
    // Handle "Last, First" format
    if (author.includes(',')) {
      const [last, first] = author.split(',').map(s => s.trim());
      return `${last}, ${first.charAt(0)}.`;
    }
    
    // Handle "First Last" format (multiple words)
    const parts = author.split(/\s+/);
    if (parts.length >= 2) {
      const last = parts[parts.length - 1];
      const first = parts[0];
      return `${last}, ${first.charAt(0)}.`;
    }
    
    // Single word author (corporate/institutional authors like UNESCO, NASA, etc.)
    return author;
  });
}

/**
 * Convert BibTeX entry to CitationData
 */
function convertBibTeXToCitation(
  key: string,
  type: string,
  fields: Record<string, string>
): CitationData | null {
  const authors = parseAuthors(fields.author || fields.editor || '');
  const year = parseInt(fields.year || '0', 10);
  const title = fields.title || '';
  
  if (!authors.length || !year || !title) {
    console.warn(`Incomplete BibTeX entry: ${key}`);
    return null;
  }
  
  const citation: CitationData = {
    id: key,
    authors,
    year,
    title,
  };
  
  // Add fields based on entry type
  switch (type.toLowerCase()) {
    case 'article':
      if (fields.journal) citation.publication = fields.journal;
      if (fields.volume) citation.volume = fields.volume;
      if (fields.number) citation.issue = fields.number;
      if (fields.pages) citation.pages = fields.pages;
      if (fields.doi) citation.doi = fields.doi;
      break;
      
    case 'book':
    case 'inbook':
      if (fields.publisher) citation.publisher = fields.publisher;
      if (fields.address) citation.location = fields.address;
      break;
      
    case 'inproceedings':
    case 'conference':
      if (fields.booktitle) citation.publication = fields.booktitle;
      if (fields.pages) citation.pages = fields.pages;
      break;
      
    case 'misc':
    case 'online':
      if (fields.url) citation.url = fields.url;
      if (fields.howpublished) citation.publisher = fields.howpublished;
      break;
  }
  
  // Add DOI or URL if available
  if (fields.doi && !citation.doi) citation.doi = fields.doi;
  if (fields.url && !citation.url) citation.url = fields.url;
  
  return citation;
}

/**
 * Export CitationData to BibTeX format
 */
export function exportToBibTeX(citations: CitationData[]): string {
  return citations.map(citation => {
    const type = citation.publication ? 'article' : 'book';
    const fields: string[] = [];
    
    // Authors
    const authorString = citation.authors.join(' and ');
    fields.push(`  author = {${authorString}}`);
    
    // Year
    fields.push(`  year = {${citation.year}}`);
    
    // Title
    fields.push(`  title = {${citation.title}}`);
    
    // Publication-specific fields
    if (citation.publication) {
      fields.push(`  journal = {${citation.publication}}`);
    }
    if (citation.volume) {
      fields.push(`  volume = {${citation.volume}}`);
    }
    if (citation.issue) {
      fields.push(`  number = {${citation.issue}}`);
    }
    if (citation.pages) {
      fields.push(`  pages = {${citation.pages}}`);
    }
    if (citation.publisher) {
      fields.push(`  publisher = {${citation.publisher}}`);
    }
    if (citation.location) {
      fields.push(`  address = {${citation.location}}`);
    }
    if (citation.doi) {
      fields.push(`  doi = {${citation.doi}}`);
    }
    if (citation.url) {
      fields.push(`  url = {${citation.url}}`);
    }
    
    return `@${type}{${citation.id},\n${fields.join(',\n')}\n}`;
  }).join('\n\n');
}