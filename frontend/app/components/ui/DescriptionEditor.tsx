"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function DescriptionEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // sync external value (edit mode support)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl bg-white shadow-sm">
      <EditorContent editor={editor} className="p-4 min-h-[150px] text-black" />

      {/* styling */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 150px;
          color: black;
          background: white;
        }

        .ProseMirror p {
          color: black;
          font-size: 15px;
          line-height: 1.6;
        }

        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3 {
          color: black;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}