import { ArrowUp, Paperclip } from "lucide-react"
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Issue } from "./IssueListItem";

const IconSize = 16;
const Composer = ({ issue }: { issue: Issue | null }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const user = useSelector((state: any) => state.loggedInUser);
  const [attachment, setAttachment] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleSend = async () => {
    if (text.trim()) {
      const payload: any = {
        issueId: issue?._id || '',
        commentText: text.trim(),
        author: user._id
      };

      if (attachment) {
        payload.attachment = [attachment]; // Wrap in array
      }

      const response = await fetch('http://localhost:8080/api/comments/update', {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).then((res) => res.json());

      console.log(response);
      setText('');
      setAttachment(null);
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAttachment(base64);
        console.log('Base64 attachment ready:', base64);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = text.trim().length > 0;

  return (
    <div className="w-full bg-white border mt-5 border-gray-300 shadow-lg rounded-xl p-4 transition-all duration-300">
      <div className="img-wrapper flex">

      </div>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          className="flex-grow text-gray-800 placeholder-gray-500 py-1 focus:outline-none"
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="Leave a comment..."
        />

        <button
          onClick={handleAttachmentClick}
          className="p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-gray-100 focus:outline-none"
          title="Attach file"
        >
          <Paperclip size={IconSize} />
        </button>

        {attachment && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Attached
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 ease-in-out
                    ${canSend
              ? 'bg-blue-500 hover:bg-blue-600 shadow-md'
              : 'bg-gray-200 cursor-not-allowed'}`}
          title="Send comment"
        >
          <ArrowUp size={IconSize - 4} color={canSend ? 'white' : 'gray'} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default Composer;
