"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function FloatingInput({ label, className, ...props }: FloatingInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setHasValue(!!e.target.value);
        if (props.onBlur) props.onBlur(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(!!e.target.value);
        if (props.onChange) props.onChange(e);
    };

    return (
        <div className="relative">
            <input
                {...props}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                className={cn(
                    "peer w-full bg-[#0F1219] border border-gray-700 rounded-xl p-3.5 pt-5 pb-2 text-white focus:border-[#5D5CDE] outline-none transition-all placeholder-transparent",
                    className
                )}
                placeholder={label} // Required for some CSS tricks, but we override visual with label
            />
            <label
                className={cn(
                    "absolute left-3.5 transition-all duration-200 pointer-events-none text-gray-500",
                    isFocused || hasValue || props.value
                        ? "top-1.5 text-[10px] text-[#5D5CDE] font-semibold"
                        : "top-3.5 text-sm"
                )}
            >
                {label}
            </label>
        </div>
    );
}

export function FloatingSelect({ label, options, className, ...props }: { label: string, options: { value: string, label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <label className="absolute top-1.5 left-3.5 text-[10px] text-[#5D5CDE] font-bold pointer-events-none z-10">
                {label}
            </label>
            <select
                {...props}
                className={cn(
                    "w-full bg-[#0F1219] border border-gray-700 rounded-xl p-3.5 pt-5 pb-2 text-white focus:border-[#5D5CDE] outline-none transition-all appearance-none",
                    className
                )}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3 top-4 pointer-events-none text-gray-500">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    )
}
