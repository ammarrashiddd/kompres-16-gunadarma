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
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      <div className={`relative flex items-center bg-white/[0.05] border rounded-xl transition-all duration-150 focus-within:border-indigo-500/80 focus-within:bg-indigo-500/[0.06] focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15),inset_0_0_0_1px_rgba(99,102,241,0.2)] ${error ? "border-red-400/60 bg-red-400/[0.04]" : "border-white/10"}`}>
        <span className="flex items-center pl-3.5 text-slate-400 flex-shrink-0 focus-within:text-indigo-400">
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
          className="flex-1 py-3 px-3.5 bg-transparent border-none outline-none text-slate-100 text-[15px] font-[inherit] caret-indigo-400 placeholder:text-slate-100/30"
        />
      </div>
      {error && <p className="text-[12.5px] text-red-400 font-medium pl-0.5">{error}</p>}
    </div>
  );
}
