"use client";

import type { ReactNode } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: ReactNode;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  autoComplete,
  error,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">
        {label}
      </label>
      <div className={`relative flex items-center bg-[#f5f5f7] border rounded-xl transition-all duration-150 focus-within:border-[#202123] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(32,33,35,0.08)] ${error ? "border-red-400 bg-[#fce4e4]/30" : "border-[#e5e5ea]"}`}>
        <span className="flex items-center pl-3.5 text-[#6e6e73] flex-shrink-0">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="flex-1 py-3 px-3 bg-transparent border-none outline-none text-[#202123] text-[15px] font-[inherit] caret-[#202123] placeholder:text-[#6e6e73]/60"
        />
      </div>
      {error && <p className="text-[12.5px] text-red-600 font-medium pl-0.5">{error}</p>}
    </div>
  );
}
