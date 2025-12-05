import { useState, useRef, useEffect, useCallback } from "react";

const DescriptionEditor = ({
  initialValue = "",
  onSave,
  handleSaveDirectly,
  placeholder = "Add description...",
  classNames = '',
}: {
  initialValue?: string;
  onSave?: (content: string) => void;
  handleSaveDirectly?: boolean;
  placeholder?: string;
  classNames?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!initialValue);
  const [savedContent, setSavedContent] = useState(initialValue);
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
    const div = divRef.current;
    if (!div) return;
    div.innerHTML = savedContent || "";
    setIsEmpty(!savedContent.trim());
    resizeDiv();
     if (handleSaveDirectly && onSave) {
      const html = div.innerHTML;
      if (html.trim() !== savedContent?.trim()) {
        onSave(html);
      }
    }
  }, [savedContent, resizeDiv, handleSaveDirectly, onSave]);

  useEffect(() => {
    if (initialValue !== savedContent) {
      setSavedContent(initialValue);
    }
  }, [initialValue]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setIsEmpty(html.trim() === "");
    setIsEditing(true);
    resizeDiv();
     if (handleSaveDirectly && onSave) {
      const trimmedHtml = html.trim();
      if (trimmedHtml !== savedContent?.trim()) {
        onSave(html); // Immediate save on every change
      }
    }
  };

  const handleSave = () => {
    if (isLoading || !divRef.current) return;
    
    const html = divRef.current.innerHTML;
    setIsLoading(true);
    
    try {
      onSave?.(html);
      setSavedContent(html);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const div = divRef.current;
    if (div) {
      div.innerHTML = savedContent || "";
    }
    setIsEmpty(!savedContent.trim());
    setIsEditing(false);
    resizeDiv();
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
        <div className="absolute left-[0] top-[10px] pointer-events-none text-[15px] text-[#9ca3af]">
          {placeholder}
        </div>
      )}

      <div
        ref={divRef}
        contentEditable={!isLoading}
        suppressContentEditableWarning={true}
        className= {`w-[100%]
          min-h-[40px]
          py-[8px]
          bg-[#ffffff]
          border-[0]
          rounded-[6px]
          text-[14px]
          leading-relaxed
          outline-none
          cursor-text
          ${classNames}
          `}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{ lineHeight: "1.6" }}
      />

      {isEditing && !handleSaveDirectly && (
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
            onClick={handleCancel}
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
    </div>
  );
};

export default DescriptionEditor;