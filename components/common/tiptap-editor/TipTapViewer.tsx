import React from 'react';
import { cn } from '@/lib/utils';
import { proseBaseStyles } from './TipTapEditor';

interface TipTapViewerProps {
  content: string;
  className?: string;
}

export const TipTapViewer: React.FC<TipTapViewerProps> = ({ content, className }) => {
  if (!content) return null;

  return (
    <div className={cn(proseBaseStyles, className)} dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default TipTapViewer;
