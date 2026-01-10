"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import DatePicker from "./DatePicker";

export default function DateInput({
  className = "",
  id = "",
  label = "Select date",
  required = false,
  onChange = () => { },
  onBlur = () => { },
  error = "",
  value = undefined, // controlled ISO string (yyyy-mm-dd)
  defaultValue = "", // uncontrolled initial ISO
  ...props
}) {
  const t = useTranslations();
  const locale = useLocale();
  // Ensure locale is just the language code (e.g. 'en', 'ar') to avoid issues
  const currentLocale = locale === 'ar' ? 'ar-EG' : 'en-US';

  const defaultLabel = t('datePicker.controls.selectDate');
  const actualLabel = label === "Select date" ? defaultLabel : label;

  // Helper to parse ISO date string in local timezone (prevents off-by-one errors)
  const parseISOLocal = (isoString) => {
    if (!isoString) return null;
    const [year, month, day] = isoString.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const isControlled = value !== undefined;
  const [internalISO, setInternalISO] = useState(isControlled ? (value || "") : (defaultValue || ""));
  const [text, setText] = useState(""); // visible text in input
  const [isFocused, setIsFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (isControlled) setInternalISO(value || "");
  }, [value, isControlled]);

  // update visible text when internalISO changes
  useEffect(() => {
    if (internalISO) {
      const d = parseISOLocal(internalISO);
      if (d && !isNaN(d.getTime())) {
        setText(d.toLocaleDateString(currentLocale, { year: "numeric", month: "long", day: "numeric" }));
        return;
      }
    }
    setText("");
  }, [internalISO]);

  const parseToISO = (input) => {
    if (!input) return null;
    const s = input.trim();
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return s;

    const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mdy) {
      const mm = String(mdy[1]).padStart(2, "0");
      const dd = String(mdy[2]).padStart(2, "0");
      const yyyy = mdy[3];
      return `${yyyy}-${mm}-${dd}`;
    }

    // Try parsing as a date string and convert to local date
    const parsed = Date.parse(s);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  };

  const emitChange = (val) => {
    // always emit event-like object for compatibility
    onChange({ target: { value: val } });
  };

  const formatISOToInput = (iso) => {
    if (!iso) return "";
    const d = parseISOLocal(iso);
    if (!d || isNaN(d.getTime())) return "";
    const mm = d.getMonth() + 1; // no leading zero to allow '5/12/2020'
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const commitText = (input) => {
    const cleaned = input.replace(/,/g, '/'); // replace accidental commas with slashes
    const iso = parseToISO(cleaned);
    if (iso) {
      if (!isControlled) setInternalISO(iso);
      emitChange(iso);
      const d = parseISOLocal(iso);
      if (d) {
        setText(d.toLocaleDateString(currentLocale, { year: "numeric", month: "long", day: "numeric" }));
      }
    } else if (cleaned === "") {
      if (!isControlled) setInternalISO("");
      emitChange("");
      setText("");
    } else {
      // invalid: revert text to internal value
      if (internalISO) {
        const d = parseISOLocal(internalISO);
        if (d) {
          setText(d.toLocaleDateString(currentLocale, { year: "numeric", month: "long", day: "numeric" }));
        }
      } else {
        setText("");
      }
    }
  };

  const handleInputChange = (e) => {
    // Just update the text while typing - validation happens on blur
    const val = e.target.value.replace(/,/g, '/'); // enforce forward slashes while typing
    setText(val);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    commitText(text);
    onBlur(e);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // when focusing, if we have an ISO value, show editable MM/DD/YYYY so user can type like "5/12/2020"
    if (internalISO) {
      setText(formatISOToInput(internalISO));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      commitText(text);
      setShowPicker(false);
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      if (internalISO) {
        const d = parseISOLocal(internalISO);
        if (d) {
          setText(d.toLocaleDateString(currentLocale, { year: "numeric", month: "long", day: "numeric" }));
        }
      } else {
        setText("");
      }
      setShowPicker(false);
      e.currentTarget.blur();
    }
  };

  const handlePickerChange = (iso) => {
    // accept empty string ('') as clear as well as valid ISO strings
    if (iso !== undefined && iso !== null) {
      if (!isControlled) setInternalISO(iso);
      emitChange(iso);
    }
    setShowPicker(false);
    setIsFocused(false);
  };

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setShowPicker(false);
        setIsFocused(false);
        commitText(text);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [text, internalISO]);

  return (
    <div className={`relative w-full ${className}`} ref={rootRef}>
      <div className="relative">
        {/* Hidden input to submit the actual ISO value */}
        <input type="hidden" name={props.name} value={internalISO} />

        <div className={`relative rounded-lg border bg-white dark:bg-gray-900 ${error ? 'border-red-500/50 dark:border-red-400/50' : isFocused ? 'border-blue-500/50 dark:border-blue-400/50' : 'border-gray-200 dark:border-gray-700'} transition-all duration-200 hover:border-blue-500/30 dark:hover:border-blue-400/30`}>
          <input
            id={id}
            type="text"
            value={text}
            placeholder={actualLabel}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onClick={() => setShowPicker((s) => !s)}
            className={`w-full px-4 pt-6 pb-2 text-base bg-transparent border-0 appearance-none ${text ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} cursor-text`}
            aria-invalid={error ? true : false}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
            name={undefined} // Maintain other props but ensure name is not on this input
          />

          <label htmlFor={id} className={`absolute left-4 top-2 text-xs font-medium transition-all duration-200 ${error ? 'text-red-500 dark:text-red-400' : isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {actualLabel}{required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <button type="button" onClick={() => setShowPicker((s) => !s)} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${error ? 'text-red-500 dark:text-red-400' : isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} aria-label="Toggle calendar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v12.75A1.5 1.5 0 004.5 21z" /></svg>
          </button>
        </div>

        {showPicker && (
          <div className="absolute z-50 mt-2 right-0">
            <DatePicker value={internalISO} onChange={(iso) => handlePickerChange(iso)} onClose={() => setShowPicker(false)} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400" id={`${id}-error`}><span className="flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-current" />{error}</span></p>
      )}
    </div>
  );
}