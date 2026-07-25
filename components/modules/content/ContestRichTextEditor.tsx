'use client';

import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  Link2Off,
  List,
  ListOrdered,
  Pencil,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ContestRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarButtonClass =
  'relative grid h-[27px] w-7 place-items-center rounded-md border-0 bg-transparent p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-pressed:bg-accent aria-pressed:text-foreground after:pointer-events-none after:invisible after:absolute after:bottom-[calc(100%+7px)] after:left-1/2 after:z-20 after:-translate-x-1/2 after:translate-y-[3px] after:whitespace-nowrap after:rounded-[5px] after:bg-foreground after:px-[7px] after:py-[5px] after:text-[9px] after:font-semibold after:text-background after:opacity-0 after:transition-all after:content-[attr(aria-label)] hover:after:visible hover:after:translate-y-0 hover:after:opacity-100 focus-visible:after:visible focus-visible:after:translate-y-0 focus-visible:after:opacity-100';

export default function ContestRichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
}: ContestRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [linkEditorOpen, setLinkEditorOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function saveSelection() {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (range && editorRef.current?.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  }

  function preserveToolbarSelection(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    saveSelection();
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    try {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    } catch {
      selectionRef.current = null;
    }
  }

  function emitValue() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function syncActiveFormats() {
    const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];
    setActiveFormats(
      Object.fromEntries(commands.map((command) => [command, document.queryCommandState(command)])),
    );
  }

  function format(
    command:
      | 'bold'
      | 'italic'
      | 'underline'
      | 'insertUnorderedList'
      | 'insertOrderedList'
      | 'formatBlock'
      | 'createLink'
      | 'unlink'
      | 'undo'
      | 'redo'
      | 'removeFormat',
    commandValue?: string,
  ) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    try {
      document.execCommand(command, false, commandValue);
    } catch {
      return;
    }
    saveSelection();
    syncActiveFormats();
    emitValue();
  }

  function openLinkEditor(editing = false) {
    saveSelection();
    const node = selectionRef.current?.startContainer;
    const selectedLink = (
      node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
    )?.closest('a') as HTMLAnchorElement | null;
    if (editing && !selectedLink) return;
    linkRef.current = selectedLink;
    setLinkUrl(selectedLink?.getAttribute('href') ?? '');
    setLinkEditorOpen(true);
  }

  function applyLink(url: string) {
    restoreSelection();
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || range.collapsed || !editorRef.current?.contains(range.commonAncestorContainer)) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer noopener';
    try {
      range.surroundContents(anchor);
      selection?.removeAllRanges();
      const nextRange = document.createRange();
      nextRange.selectNodeContents(anchor);
      selection?.addRange(nextRange);
      selectionRef.current = nextRange.cloneRange();
      emitValue();
    } catch {
      format('createLink', url);
    }
  }

  function saveLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = linkUrl.trim();
    if (!url) return;
    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.target = '_blank';
      linkRef.current.rel = 'noreferrer noopener';
      emitValue();
    } else {
      applyLink(url);
    }
    setLinkEditorOpen(false);
    linkRef.current = null;
  }

  function removeLink() {
    restoreSelection();
    document.execCommand('unlink');
    emitValue();
    setLinkEditorOpen(false);
  }

  const buttonProps = {
    type: 'button' as const,
    className: toolbarButtonClass,
    onMouseDown: preserveToolbarSelection,
  };

  return (
    <div className="border-input bg-surface-secondary focus-within:border-primary focus-within:bg-surface relative overflow-visible rounded-[9px] border transition-colors">
      <div
        className="border-border flex flex-wrap items-center gap-0 border-b px-[5px] py-[5px]"
        aria-label="Text formatting"
      >
        <button
          {...buttonProps}
          aria-label="Bold"
          aria-pressed={activeFormats.bold ?? false}
          onClick={() => format('bold')}
        >
          <Bold size={15} />
        </button>
        <button
          {...buttonProps}
          aria-label="Italic"
          aria-pressed={activeFormats.italic ?? false}
          onClick={() => format('italic')}
        >
          <Italic size={15} />
        </button>
        <button
          {...buttonProps}
          aria-label="Underline"
          aria-pressed={activeFormats.underline ?? false}
          onClick={() => format('underline')}
        >
          <Underline size={15} />
        </button>
        <button {...buttonProps} aria-label="Heading 1" onClick={() => format('formatBlock', 'h1')}>
          <Heading1 size={16} />
        </button>
        <button {...buttonProps} aria-label="Heading 2" onClick={() => format('formatBlock', 'h2')}>
          <Heading2 size={16} />
        </button>
        <button {...buttonProps} aria-label="Heading 3" onClick={() => format('formatBlock', 'h3')}>
          <Heading3 size={16} />
        </button>
        <button
          {...buttonProps}
          aria-label="Bullet list"
          aria-pressed={activeFormats.insertUnorderedList ?? false}
          onClick={() => format('insertUnorderedList')}
        >
          <List size={16} />
        </button>
        <button
          {...buttonProps}
          aria-label="Numbered list"
          aria-pressed={activeFormats.insertOrderedList ?? false}
          onClick={() => format('insertOrderedList')}
        >
          <ListOrdered size={16} />
        </button>
        <button
          {...buttonProps}
          aria-label="Quote"
          onClick={() => format('formatBlock', 'blockquote')}
        >
          <Quote size={16} />
        </button>
        <button {...buttonProps} aria-label="Add link" onClick={() => openLinkEditor()}>
          <Link size={16} />
        </button>
        <button {...buttonProps} aria-label="Edit link" onClick={() => openLinkEditor(true)}>
          <Pencil size={16} />
        </button>
        <button {...buttonProps} aria-label="Remove link" onClick={removeLink}>
          <Link2Off size={16} />
        </button>
        <button {...buttonProps} aria-label="Undo" onClick={() => format('undo')}>
          <Undo2 size={16} />
        </button>
        <button {...buttonProps} aria-label="Redo" onClick={() => format('redo')}>
          <Redo2 size={16} />
        </button>
        <button
          {...buttonProps}
          aria-label="Clear formatting"
          onClick={() => format('removeFormat')}
        >
          <RemoveFormatting size={16} />
        </button>
      </div>

      {linkEditorOpen && (
        <form
          className="border-border bg-surface-tertiary grid grid-cols-[minmax(0,1fr)_auto_auto] gap-1.5 border-b p-2"
          onSubmit={saveLink}
        >
          <input
            autoFocus
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            className="border-input bg-surface focus:border-primary h-[30px] min-w-0 rounded-md border px-2 text-[10px] outline-none"
          />
          <button
            type="submit"
            className="border-primary bg-primary text-primary-foreground h-[30px] rounded-md border px-2 text-[9px] font-bold"
          >
            Save link
          </button>
          <button
            type="button"
            className="border-input bg-surface text-muted-foreground h-[30px] rounded-md border px-2 text-[9px] font-bold"
            onClick={() => setLinkEditorOpen(false)}
          >
            Cancel
          </button>
        </form>
      )}

      <div
        ref={editorRef}
        className="text-body empty:before:text-placeholder-foreground [&_a]:text-primary [&_blockquote]:border-primary/40 [&_blockquote]:text-muted-foreground [&_h1]:text-heading [&_h2]:text-heading [&_h3]:text-heading min-h-28 p-[10px_11px] text-xs leading-[1.55] outline-none empty:before:pointer-events-none empty:before:content-[attr(data-placeholder)] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-[9px] [&_h1]:mb-2 [&_h1]:text-xl [&_h2]:mb-2 [&_h2]:text-[17px] [&_h3]:mb-2 [&_h3]:text-sm [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-[19px] [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-[19px]"
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onFocus={saveSelection}
        onKeyUp={() => {
          saveSelection();
          syncActiveFormats();
        }}
        onMouseUp={() => {
          saveSelection();
          syncActiveFormats();
        }}
        onInput={() => {
          saveSelection();
          emitValue();
        }}
      />
    </div>
  );
}
