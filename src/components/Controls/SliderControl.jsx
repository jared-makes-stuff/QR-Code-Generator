import { Label } from '../ui/Label'

export const SliderControl = ({ label, value, onChange, min, max, step = 1, suffix = '' }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
                <span className="rounded-full border border-[#408A71]/35 bg-[#408A71]/18 px-2.5 py-1 text-xs font-semibold text-[#B0E4CC]">
                    {value}{suffix}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#091413] accent-[#B0E4CC] transition-all [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#B0E4CC] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />
        </div>
    )
}
