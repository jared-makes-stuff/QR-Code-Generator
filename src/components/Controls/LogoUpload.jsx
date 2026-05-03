import { useRef } from 'react'
import { Label } from '../ui/Label'
import { Upload, X } from 'lucide-react'

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
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#408A71]/45 bg-[#408A71]/12 p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#B0E4CC]/60 hover:bg-[#408A71]/24"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="h-8 w-8 text-[#B0E4CC]" />
                    <p className="text-xs font-medium text-[#B0E4CC]/75">Click or drag logo here</p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                </div>
            ) : (
                <div className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-[#408A71]/45 bg-[#B0E4CC] p-2">
                    <img src={value} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button
                        onClick={() => onChange('')}
                        className="absolute right-1 top-1 rounded-full bg-[#091413]/80 p-1 text-[#B0E4CC] opacity-0 transition-opacity duration-200 hover:bg-[#091413] group-hover:opacity-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
