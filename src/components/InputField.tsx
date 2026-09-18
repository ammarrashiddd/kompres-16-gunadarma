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
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className={`input-wrapper${error ? " input-wrapper--error" : ""}`}>
        <span className="input-icon">{icon}</span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="input-field"
        />
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
