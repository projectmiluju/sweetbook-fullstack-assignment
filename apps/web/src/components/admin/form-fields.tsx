"use client";

import type { ChangeEvent } from "react";

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-[color:var(--border-mid)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]";

const LABEL_CLASS =
  "block text-[10px] font-semibold tracking-[0.18em] text-[color:var(--accent)] uppercase";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "date";
  placeholder?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required && <span className="ml-1 text-[color:var(--error)]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  required,
  rows = 3,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required && <span className="ml-1 text-[color:var(--error)]">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        required={required}
        rows={rows}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className={`${INPUT_CLASS} resize-none`}
      />
    </div>
  );
}

interface CommaListFieldProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

/** 콤마(,)로 구분된 문자열 배열 입력 필드 */
export function CommaListField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: CommaListFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        <span className="ml-2 text-[10px] font-normal tracking-normal text-[color:var(--text-dim)]">
          (콤마로 구분)
        </span>
      </label>
      <input
        id={id}
        type="text"
        value={value.join(", ")}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const items = e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          onChange(items);
        }}
        className={INPUT_CLASS}
      />
    </div>
  );
}
