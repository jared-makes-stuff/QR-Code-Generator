import React from 'react'
import { Label } from '../ui/Label'
import { cn } from '../../lib/utils'

const SHAPES = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'dots', label: 'Dots' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy R' },
    { id: 'extra-rounded', label: 'Extra R' },
]

export const ShapeSelector = ({ label, value, onChange, options = SHAPES }) => {
    return (
        <div className="space-y-3">
            <Label>{label}</Label>
            <div className="grid grid-cols-3 gap-2">
                {options.map((shape) => (
                    <button
                        key={shape.id}
                        onClick={() => onChange(shape.id)}
                        className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                            value === shape.id
                                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        )}
                    >
                        {shape.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
