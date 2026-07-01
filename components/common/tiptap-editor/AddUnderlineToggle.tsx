'use client';

import React from 'react';
import type { Editor } from '@tiptap/react';
import { Toggle } from '@/components/ui/toggle';
import { Underline } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  editor?: Editor | null;
  className?: string;
}

export const AddUnderlineToggle: React.FC<Props> = ({ editor, className }) => {
  if (!editor) return null;

  return (
    <Toggle
      size="sm"
      pressed={editor.isActive('underline')}
      onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      className={cn(
        'text-muted-foreground hover:bg-surface-tertiary data-[state=on]:bg-surface-tertiary',
        className ?? '',
      )}
      title="Underline"
    >
      <Underline className="size-4" />
    </Toggle>
  );
};

export default AddUnderlineToggle;
