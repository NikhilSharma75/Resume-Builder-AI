"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    Heading1, 
    Heading2, 
    List, 
    ListOrdered, 
    AlignLeft, 
    AlignCenter, 
    AlignRight,
    Eraser,
    Highlighter,
    Minus,
    Type
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-muted/40 dark:bg-slate-900/60 backdrop-blur-sm sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-1 bg-background/50 dark:bg-slate-800/40 p-1 rounded-xl shadow-sm border border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("bold") ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Bold"
                >
                    <Bold size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("italic") ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Italic"
                >
                    <Italic size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("underline") ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Underline"
                >
                    <UnderlineIcon size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("highlight") ? "bg-yellow-500/20 text-yellow-500 shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Highlight"
                >
                    <Highlighter size={18} />
                </Button>
            </div>
            
            <div className="w-[1px] h-8 bg-border/60 mx-1" />

            <div className="flex items-center gap-1 bg-background/50 dark:bg-slate-800/40 p-1 rounded-xl shadow-sm border border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("heading", { level: 1 }) ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("heading", { level: 2 }) ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("paragraph") ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Normal Text"
                >
                    <Type size={18} />
                </Button>
            </div>

            <div className="w-[1px] h-8 bg-border/60 mx-1" />

            <div className="flex items-center gap-1 bg-background/50 dark:bg-slate-800/40 p-1 rounded-xl shadow-sm border border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("bulletList") ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Bullet List"
                >
                    <List size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive("orderedList") ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Ordered List"
                >
                    <ListOrdered size={18} />
                </Button>
            </div>

            <div className="w-[1px] h-8 bg-border/60 mx-1" />

            <div className="flex items-center gap-1 bg-background/50 dark:bg-slate-800/40 p-1 rounded-xl shadow-sm border border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive({ textAlign: "left" }) ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Align Left"
                >
                    <AlignLeft size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive({ textAlign: "center" }) ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Align Center"
                >
                    <AlignCenter size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${editor.isActive({ textAlign: "right" }) ? "bg-primary/20 text-primary shadow-inner" : "hover:bg-accent hover:scale-105"}`}
                    title="Align Right"
                >
                    <AlignRight size={18} />
                </Button>
            </div>

            <div className="w-[1px] h-8 bg-border/60 mx-1" />

            <div className="flex items-center gap-1 bg-background/50 dark:bg-slate-800/40 p-1 rounded-xl shadow-sm border border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="h-9 w-9 p-0 rounded-lg hover:bg-accent hover:scale-105 transition-all duration-200"
                    title="Separator"
                >
                    <Minus size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    className="h-9 w-9 p-0 rounded-lg hover:bg-accent hover:scale-105 transition-all duration-200"
                    title="Clear Formatting"
                >
                    <Eraser size={18} />
                </Button>
            </div>
        </div>
    );
};

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: placeholder || "Write your cover letter...",
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "flex-1 p-8 text-base leading-[1.8] font-medium bg-transparent outline-none prose dark:prose-invert prose-slate dark:prose-slate max-w-none focus:outline-none min-h-[400px] selection:bg-primary/20",
            },
        },
    });

    // Update content if it changes from outside (e.g. after generation)
    useEffect(() => {
        if (editor && content !== editor.getHTML() && !editor.isFocused) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="flex flex-col h-full bg-card dark:bg-[#0c0c0e] rounded-3xl overflow-hidden border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
            <Toolbar editor={editor} />
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-[#0b0c0e]/50">
                <EditorContent editor={editor} />
            </div>
            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .tiptap {
                    height: 100%;
                }
                .tiptap hr {
                    border-top: 2px solid hsl(var(--border));
                    margin: 2rem 0;
                    border-radius: 999px;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--border));
                    border-radius: 999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary) / 0.5);
                }
                .tiptap h1 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: hsl(var(--foreground));
                }
                .tiptap h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: hsl(var(--foreground));
                }
            `}</style>
        </div>
    );
};
