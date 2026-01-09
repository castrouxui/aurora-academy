"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number[]
    onValueChange: (value: number[]) => void
    max?: number
    step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {

        // Calculate percentage for background gradient effect (track fill)
        const percentage = ((value[0] || 0) / max) * 100;

        return (
            <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
                <input
                    type="range"
                    className={cn(
                        "w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer focus:outline-none",
                        "slider-thumb", // Custom class for thumb styling if needed
                        className
                    )}
                    style={{
                        background: `linear-gradient(to right, #5D5CDE ${percentage}%, #374151 ${percentage}%)`
                    }}
                    ref={ref}
                    value={value[0]}
                    max={max}
                    step={step}
                    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
                    {...props}
                />
                <style jsx>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: white;
            margin-top: -0px; /* Adjust if needed */
            box-shadow: 0 0 2px rgba(0,0,0,0.5);
          }
          input[type=range]::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 0 2px rgba(0,0,0,0.5);
          }
        `}</style>
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
