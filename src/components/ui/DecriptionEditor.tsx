import { useState, useRef, useEffect, useCallback } from "react";

const DescriptionEditor = ({
  initialValue = "",
  onSave,
  placeholder = "Add description...",
}: {
  initialValue?: string;
  onSave?: (content: string) => Promise<void>;
  placeholder?: string;
}) => {
  const [content, setContent] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!initialValue);
  const divRef = useRef<HTMLDivElement>(null);

  const resizeDiv = useCallback(() => {
    const div = divRef.current;
    if (!div) return;

    div.style.height = "auto";
    const maxHeight = 300;
    const newHeight = Math.min(div.scrollHeight, maxHeight);
    div.style.height = `${newHeight}px`;
    div.style.overflowY = div.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    resizeDiv();
  }, [content, resizeDiv]);

  useEffect(() => {
    resizeDiv();
  }, [resizeDiv]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setContent(html);
    setIsEmpty(html.trim() === "");
    setIsEditing(true);
    resizeDiv();
  };

  const handleSave = async () => {
    if (!isEditing || isLoading) return;
    setIsLoading(true);
    try {
      await onSave?.(content);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="w-[100%] relative">
      {isEmpty && !isLoading && (
        <div className="absolute left-[0] top-[10px] pointer-events-none text-[13px] text-[#9ca3af] italic">
          {placeholder}
        </div>
      )}

      <div
        ref={divRef}
        contentEditable={!isLoading}
        suppressContentEditableWarning={true}
        className={`
          w-[100%]
          min-h-[40px]
          py-[8px]
          bg-[#ffffff]
          border-[0]
          rounded-[6px]
          text-[14px]
          leading-relaxed
          outline-none
          ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-text"}
        `}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: content || "" }}
        style={{ lineHeight: "1.6" }}
      />

      {isEditing && (
        <div className="flex gap-[8px] mt-[8px] pt-[8px] border-t border-[#e5e7eb]">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="
              px-[10px] py-[4px]
              text-[13px]
              bg-[#2563eb] text-[#ffffff]
              rounded-[6px]
              border-[0]
              hover:bg-[#1d4ed8]
              disabled:opacity-50
              transition-colors
            "
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setContent(initialValue || "");
              setIsEditing(false);
              setIsEmpty(!(initialValue && initialValue.trim().length));
            }}
            className="
              px-[10px] py-[4px]
              text-[13px]
              text-[#4b5563]
              rounded-[6px]
              hover:text-[#111827]
              bg-[#f3f4f6]
              border-[0]
              hover:bg-[#e5e7eb]
              transition-colors
            "
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mt-[4px] text-[11px] text-[#6b7280]">
        {isEditing && "Cmd/Ctrl + Enter to save"}
      </div>
    </div>
  );
};

export default DescriptionEditor;
