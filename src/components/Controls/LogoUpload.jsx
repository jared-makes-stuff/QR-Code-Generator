import React, { useRef, useState } from 'react'
import { Label } from '../ui/Label'
import { Upload, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

export const LogoUpload = ({ label, value, onChange }) => {
    const inputRef = useRef(null)

    const handleFile = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onChange(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const onDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }

    return (
        <div className="space-y-3">
            <Label>{label}</Label>

            {!value ? (
                <div
                    className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="text-xs text-slate-400 font-medium">Click or drag logo here</p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                </div>
            ) : (
                <div className="relative group w-24 h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/20">
                    <img src={value} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button
                        onClick={() => onChange('')}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
