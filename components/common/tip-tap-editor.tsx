'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

import { Toggle } from '@/components/ui/toggle';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Link2Off,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// --- Image Link Component ---
const AddImagePopover = ({ editor }: { editor: any }) => {
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const addImage = useCallback(() => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
      setUrl('');
      setOpen(false);
    }
  }, [editor, url]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Toggle
          size="sm"
          pressed={false}
          className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 gap-2 border-gray-700 bg-gray-800 p-3" align="start">
        <Input
          type="url"
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-500"
          onKeyDown={(e) => e.key === 'Enter' && addImage()}
        />
        <Button size="sm" onClick={addImage} className="bg-green-600 text-white hover:bg-green-700">
          Add
        </Button>
      </PopoverContent>
    </Popover>
  );
};

// --- Link Component ---
const AddLinkPopover = ({ editor }: { editor: any }) => {
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && editor) {
      // Get existing URL if link is active
      const existingUrl = editor.getAttributes('link').href;
      setUrl(existingUrl || '');
    }
  }, [open, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    // If URL is empty, unset the link
    if (!url) {
      editor.chain().focus().unsetLink().run();
      setOpen(false);
      return;
    }

    // Set the link
    editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
    setOpen(false);
  }, [editor, url]);

  // Handle removing the link
  const unsetLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
  }, [editor]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Toggle
          size="sm"
          pressed={editor?.isActive('link')}
          className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
          title="Add/Edit Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="flex w-96 gap-2 border-gray-700 bg-gray-800 p-3" align="start">
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-500"
          onKeyDown={(e) => e.key === 'Enter' && setLink()}
        />
        <Button size="sm" onClick={setLink} className="bg-green-600 text-white hover:bg-green-700">
          {editor?.isActive('link') ? 'Update' : 'Add'}
        </Button>
        {editor?.isActive('link') && (
          <Button
            size="sm"
            variant="destructive"
            onClick={unsetLink}
            className="bg-red-600 p-2 text-white hover:bg-red-700"
          >
            <Link2Off className="h-4 w-4" />
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

const TipTapToolbar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 border-b bg-gray-900 p-2">
      {/* Basic Formatting */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-4 w-px self-center bg-gray-600" />

      {/* Heading 1 (H1) */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="font-bold text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      {/* Heading 2 (H2) */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="font-bold text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      {/* Heading 3 (H3) */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="font-bold text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-4 w-px self-center bg-gray-600" />

      {/* Lists */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-4 w-px self-center bg-gray-600" />

      {/* Image Link */}
      <AddImagePopover editor={editor} />

      {/* Add/Remove Link */}
      <AddLinkPopover editor={editor} />
    </div>
  );
};

export const TipTapEditor = ({
  value,
  onChange,
  placeholder,
  minHeight = 'h-32',
}: TipTapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: false }),
        Heading.configure({ levels: [1, 2, 3] }),
        Image.configure({ inline: true, allowBase64: true }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        }),
      ],
      content: value,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: cn(
            'prose dark:prose-invert max-w-none text-gray-200 p-3 min-h-[120px] focus:outline-none overflow-y-auto [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md',
            minHeight,
          ),
        },
      },
    },
    [placeholder],
  );

  // Render placeholder during SSR or while editor is initializing
  if (!isMounted || !editor) {
    return (
      <div
        className={cn(
          'flex min-h-[250px] w-full items-center justify-center rounded-md border bg-gray-900 p-3',
          minHeight,
        )}
      >
        <p className="text-muted-foreground flex items-center gap-2">
          <Spinner /> Loading text editor...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border transition-all focus-within:ring-2 focus-within:ring-white/20">
      <TipTapToolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-[120px]" />
    </div>
  );
};
