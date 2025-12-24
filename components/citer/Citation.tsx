'use client';

import { useState, useRef, useEffect } from 'react';

interface CitationProps {
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
  style?: 'parenthetical' | 'endnote';
  index?: number;
  publisher?: string;
  location?: string;
}

export default function Citation({
  id,
  authors,
  year,
  title,
  publication,
  volume,
  issue,
  pages,
  doi,
  url,
  style = 'parenthetical',
  index,
  publisher,
  location,
}: CitationProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const citationRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format author names for display
  const formatAuthors = (authorList: string[]): string => {
    if (authorList.length === 1) return authorList[0];
    if (authorList.length === 2) return `${authorList[0]} & ${authorList[1]}`;
    if (authorList.length > 2) {
      return `${authorList[0]} et al.`;
    }
    return '';
  };

  // Format full citation for tooltip
  const formatFullCitation = (): string => {
    const authorStr = authors.join(', ');
    let citation = `${authorStr} (${year}). ${title}.`;
    
    if (publication) {
      citation += ` ${publication}`;
      if (volume) citation += `, ${volume}`;
      if (issue) citation += `(${issue})`;
      if (pages) citation += `, ${pages}`;
      citation += '.';
    } else if (publisher) {
      citation += ` ${publisher}`;
      if (location) citation += `, ${location}`;
      citation += '.';
    }
    
    if (doi) citation += ` https://doi.org/${doi}`;
    else if (url) citation += ` ${url}`;
    
    return citation;
  };

  // Get inline citation text
  const getInlineText = (): string => {
    if (style === 'endnote' && index !== undefined) {
      return `[${index}]`;
    }
    return `(${formatAuthors(authors)}, ${year})`;
  };

  // Check tooltip position on hover to avoid going off-screen
  useEffect(() => {
    if (showTooltip && citationRef.current && tooltipRef.current) {
      const rect = citationRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // If tooltip would go off top of screen, show below instead
      if (rect.top - tooltipRect.height < 20) {
        setTooltipPosition('bottom');
      } else {
        setTooltipPosition('top');
      }
    }
  }, [showTooltip]);

  // Handle hover state with delay to prevent flickering
  useEffect(() => {
    if (isHovering) {
      // Small delay before showing tooltip
      hoverTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 150);
    } else {
      // Cancel pending show if we stop hovering quickly
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowTooltip(false);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovering]);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        ref={citationRef}
        className="text-blue-600 hover:text-blue-800 cursor-help transition-colors duration-150 font-medium"
        id={id}
      >
        {getInlineText()}
      </span>
      
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-80 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl ${
            tooltipPosition === 'top' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          } left-1/2 -translate-x-1/2`}
          style={{
            animation: 'fadeIn 0.2s ease-out forwards',
          }}
        >
          <div className="text-xs leading-relaxed">
            {formatFullCitation()}
          </div>
          
          {/* Tooltip arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45 ${
              tooltipPosition === 'top'
                ? '-bottom-1.5'
                : '-top-1.5'
            }`}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}