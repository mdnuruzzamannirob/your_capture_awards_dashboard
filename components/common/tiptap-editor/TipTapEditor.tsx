'use client';

import { cn } from '@/lib/utils';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useMemo, useState } from 'react';
import Toolbar from './Toolbar';

export const proseBaseStyles = cn(
  // General Typography
  'prose dark:prose-invert max-w-none',

  // spacing
  'whitespace-pre-wrap',

  // Headings
  '[&_h1]:text-3xl [&_h1]:font-bold',
  '[&_h2]:text-2xl [&_h2]:font-semibold',
  '[&_h3]:text-xl [&_h3]:font-medium',

  // Paragraph min hight
  '[&_p]:min-h-[1.5rem]',

  // Lists
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1',

  // Links: color + underline
  '[&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/90',

  // Images
  '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md',
);

export interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 'min-h-[120px]',
  maxHeight = 'max-h-[600px]',
  className,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: false,
      }),

      Heading.configure({
        levels: [1, 2, 3],
      }),

      Image.configure({
        inline: true,
        allowBase64: true,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),

      Underline,

      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-muted-foreground before:pointer-events-none before:float-left before:h-0',
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn('p-3 focus:outline-none overflow-y-auto', proseBaseStyles, minHeight, maxHeight),
      },
    },
  }) as Editor | null;

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!mounted || !editor) {
    return (
      <div
        className={cn(
          'bg-background animate-pulse overflow-hidden rounded-md border border-border',
          className,
        )}
      >
        {/* Skeleton Toolbar */}
        <div className="bg-surface/50 flex h-11 items-center gap-2 border-b border-border px-3">
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted mx-1 h-6 w-1" />
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted mx-1 h-6 w-1" />
          <div className="bg-muted h-6 w-6 rounded" />
          <div className="bg-muted h-6 w-6 rounded" />
        </div>
        {/* Skeleton Body */}
        <div className={cn('bg-background space-y-3 p-4', minHeight)}>
          <div className="bg-muted h-4 w-2/3 rounded" />
          <div className="bg-muted h-4 w-4/5 rounded" />
          <div className="bg-muted h-4 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border transition-all focus-within:ring-2 focus-within:ring-ring/20',
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
