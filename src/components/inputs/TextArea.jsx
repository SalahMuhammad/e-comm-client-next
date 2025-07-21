"use client";
import { useState, useRef, useEffect } from "react";

export default function TextArea({
  className = "",
  id = "",
  placeholder = "",
  required = false,
  onChange = () => {},
  onBlur = () => {},
  error = "",
  icon = null,
  textColor = "text-gray-900 dark:text-white",
  borderColor = "border-gray-300 dark:border-gray-600",
  focusColor = "focus:border-blue-600 dark:focus:border-blue-500",
  labelColor = "text-gray-500 dark:text-gray-400",
  focusLabelColor = "peer-focus:text-blue-600 peer-focus:dark:text-blue-500",
  errorColor = "text-red-500 dark:text-red-400",
  minRows = 1,
  maxRows = 6,
  ...props
}) {
  const hasError = Boolean(error);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize functionality
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate line height
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
    
    // Calculate min and max heights
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
    
    // Set new height within bounds
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  const handleChange = (e) => {
    adjustHeight();
    onChange(e);
  };

  let iconColorClass = "text-gray-400 dark:text-gray-300";
  if (hasError) iconColorClass = errorColor;
  else if (isFocused) iconColorClass = focusColor;

  return (
    <div className={`relative w-full mb-1 ${className}`}>
      {icon && (
        <div className={`absolute top-2.5 right-3 flex items-center pointer-events-none ${iconColorClass}`}>
          {icon}
        </div>
      )}

      <textarea
        ref={textareaRef}
        id={id}
        placeholder=" "
        rows={minRows}
        onBlur={e => {
          setIsFocused(false);
          onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        onChange={handleChange}
        className={`
          block w-full py-2.5 pr-12 pl-2 text-sm bg-transparent border-0 border-b-2 resize-none
          ${textColor}
          ${hasError 
            ? `border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400`
            : `${borderColor} ${focusColor}`
          }
          appearance-none focus:outline-none focus:ring-0 peer overflow-y-hidden
        `}
        {...props}
      />

      <label
        htmlFor={id}
        className={`
          absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6
          ${hasError ? `peer-focus:${errorColor} ${errorColor}` : `${labelColor} ${focusLabelColor}`}
          peer-focus:bg-gray-100 peer-focus:dark:bg-gray-900 px-1
        `}
      >
        {placeholder}
      </label>

      {/* Textarea resize indicator lines */}
      <div className="absolute bottom-1 right-3 pointer-events-none">
        <div className={`flex flex-col gap-0.5 ${isFocused ? focusColor.replace('focus:', '').replace('border', 'text') : 'text-gray-300 dark:text-gray-600'}`}>
          <div className="w-3 h-0.5 bg-current opacity-60"></div>
          <div className="w-3 h-0.5 bg-current opacity-40"></div>
          <div className="w-3 h-0.5 bg-current opacity-20"></div>
        </div>
      </div>

      <div className="min-h-[1.25rem] mt-1">
        {hasError && (
          <p className={`text-sm ${errorColor}`}>{error}</p>
        )}
      </div>
    </div>
  );
}