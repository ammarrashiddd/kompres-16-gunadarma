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
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#777572]"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-[10px] border bg-white transition-all duration-150 focus-within:border-[#df6f4c] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(223,111,76,0.16)] ${error ? "border-[#df6f4c] bg-[#df6f4c]/10" : "border-[#dedbd6]"}`}
      >
        <span className="flex shrink-0 items-center pl-3.5 text-[#aaa6a1]">
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
          className="flex-1 border-none bg-transparent px-3.5 py-3 text-[15px] text-[#202123] outline-none caret-[#c85b31] placeholder:text-[#aaa6a1]"
        />
      </div>
      {error && (
        <p className="pl-0.5 text-[12.5px] font-medium text-[#a14d32]">
          {error}
        </p>
      )}
    </div>
  );
}
