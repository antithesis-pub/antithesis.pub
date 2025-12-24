'use client';

import { createContext, useContext, ReactNode } from 'react';
import Citation from './Citation';

export interface CitationData {
  id: string;
  authors: string[];
  year: number;
  title: string;
  publication?: string;
  volume?: string | number;
  issue?: string | number;
  pages?: string;
  doi?: string;
  url?: string;
  publisher?: string;
  location?: string;
}

interface CitationContextType {
  citations: Map<string, CitationData>;
  style: 'parenthetical' | 'endnote';
}

const CitationContext = createContext<CitationContextType | undefined>(undefined);

interface CitationProviderProps {
  children: ReactNode;
  citations: CitationData[];
  style?: 'parenthetical' | 'endnote';
}

export function CitationProvider({ children, citations, style = 'parenthetical' }: CitationProviderProps) {
  const citationMap = new Map(citations.map(c => [c.id, c]));

  return (
    <CitationContext.Provider value={{ citations: citationMap, style }}>
      {children}
    </CitationContext.Provider>
  );
}

interface CiteProps {
  id: string;
}

export function Cite({ id }: CiteProps) {
  const context = useContext(CitationContext);
  
  if (!context) {
    throw new Error('Cite must be used within a CitationProvider');
  }

  const citation = context.citations.get(id);
  
  if (!citation) {
    console.warn(`Citation with id "${id}" not found`);
    return <span className="text-red-500">[Citation not found: {id}]</span>;
  }

  // Calculate index for endnote style
  const index = context.style === 'endnote' 
    ? Array.from(context.citations.keys()).indexOf(id) + 1 
    : undefined;

  return <Citation {...citation} style={context.style} index={index} />;
}

interface BibliographyProps {
  title?: string;
  className?: string;
}

export function Bibliography({ title = 'References', className = '' }: BibliographyProps) {
  const context = useContext(CitationContext);
  
  if (!context) {
    throw new Error('Bibliography must be used within a CitationProvider');
  }

  const formatFullCitation = (citation: CitationData): string => {
    const authorStr = citation.authors.join(', ');
    let formatted = `${authorStr} (${citation.year}). ${citation.title}.`;
    
    if (citation.publication) {
      formatted += ` <em>${citation.publication}</em>`;
      if (citation.volume) formatted += `, ${citation.volume}`;
      if (citation.issue) formatted += `(${citation.issue})`;
      if (citation.pages) formatted += `, ${citation.pages}`;
      formatted += '.';
    } else if (citation.publisher) {
      formatted += ` ${citation.publisher}`;
      if (citation.location) formatted += `, ${citation.location}`;
      formatted += '.';
    }
    
    if (citation.doi) {
      formatted += ` <a href="https://doi.org/${citation.doi}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">https://doi.org/${citation.doi}</a>`;
    } else if (citation.url) {
      formatted += ` <a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${citation.url}</a>`;
    }
    
    return formatted;
  };

  // Sort citations alphabetically by first author's last name
  const sortedCitations = Array.from(context.citations.values()).sort((a, b) => {
    const aAuthor = a.authors[0].split(' ').pop() || '';
    const bAuthor = b.authors[0].split(' ').pop() || '';
    return aAuthor.localeCompare(bAuthor);
  });

  return (
    <div className={`mt-12 pt-8 border-t border-gray-300 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="space-y-4">
        {sortedCitations.map((citation, index) => (
          <div 
            key={citation.id} 
            id={`ref-${citation.id}`}
            className="text-sm leading-relaxed"
          >
            {context.style === 'endnote' && (
              <span className="inline-block w-8 font-medium">[{index + 1}]</span>
            )}
            <span 
              dangerouslySetInnerHTML={{ __html: formatFullCitation(citation) }}
              className={context.style === 'endnote' ? 'inline' : 'block'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
