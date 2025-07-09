// ✅ components/shared/ReviewOptionsMenu.jsx
import React, { useRef, useEffect } from "react";

export default function ReviewOptionsMenu({ show, onClose, onCopyLink, onDelete, isOwner = false }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-sm shadow z-50"
    >
      <button className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.292 3H16.83l-4.462 5.716L8.14 3H3.708l6.61 9.27L3 21h3.462l4.987-6.387L16.47 21H21l-7.033-9.716L20.292 3z" />
        </svg>
        Share on X
      </button>

      <button className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
        <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12a10 10 0 10-11.6 9.87v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12z" />
        </svg>
        Share on Facebook
      </button>

      <button
        onClick={onCopyLink}
        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
      >
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.59 2.59a2 2 0 012.83 0l2 2a2 2 0 010 2.83L13.41 11l-2.83-2.83L12.59 2.59zM11 13l-2.83-2.83-5.3 5.3a2 2 0 102.83 2.83l5.3-5.3z" />
        </svg>
        Copy Link
      </button>

      <button className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 7H4v13a2 2 0 002 2h12a2 2 0 002-2V7zm-6 11h-4v-2h4v2zm0-4h-4v-4h4v4zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
        Report
      </button>

      {isOwner && (
        <button
          onClick={onDelete}
          className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
          Remove Comment
        </button>
      )}
    </div>
  );
}
