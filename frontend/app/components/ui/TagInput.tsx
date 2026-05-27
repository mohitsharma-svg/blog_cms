"use client";

import { useEffect, useRef } from "react";
// @ts-ignore
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

export default function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tagifyRef = useRef<any | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    tagifyRef.current = new Tagify(inputRef.current, {
      whitelist: [],
      dropdown: {
        enabled: 0,
      },
    });

    tagifyRef.current.on("change", (e: any) => {
      const values = JSON.parse(e.detail.value || "[]").map(
        (item: any) => item.value
      );

      onChange(values);
    });

    return () => {
      tagifyRef.current?.destroy();
    };
  }, []);

  return (
    <input
      ref={inputRef}
      placeholder="Add tags..."
      className="w-full border p-2 rounded-lg"
    />
  );
}