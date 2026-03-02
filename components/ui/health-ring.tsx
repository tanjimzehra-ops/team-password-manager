"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HealthRingProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
    size?: number
    strokeWidth?: number
    showValue?: boolean
}

export function HealthRing({
    value,
    size = 40,
    strokeWidth = 4,
    showValue = false,
    className,
    ...props
}: HealthRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference

    const getStatusColor = (val: number) => {
        if (val >= 100) return "text-emerald-500 stroke-emerald-500"
        if (val >= 95) return "text-amber-500 stroke-amber-500"
        return "text-rose-500 stroke-rose-500"
    }

    const statusColor = getStatusColor(value)

    return (
        <div
            className={cn("relative inline-flex items-center justify-center", className)}
            style={{ width: size, height: size }}
            {...props}
        >
            <svg
                className="transform -rotate-90"
                width={size}
                height={size}
            >
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/20"
                />
                {/* Progress ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{
                        strokeDashoffset: offset,
                        transition: "stroke-dashoffset 0.5s ease-in-out"
                    }}
                    strokeLinecap="round"
                    className={cn("transition-all duration-500", statusColor.split(' ')[1])}
                />
            </svg>
            {showValue && (
                <span className={cn("absolute text-xs font-bold", statusColor.split(' ')[0])}>
                    {Math.round(value)}
                </span>
            )}
        </div>
    )
}
