import { useEffect, useRef, useState } from 'react'
import { RgbaColorPicker } from 'react-colorful'
import { ChevronDown } from 'lucide-react'
import { colord } from 'colord'
import { Label } from '../ui/Label'
import { cn } from '../../lib/utils'

const PRESETS = [
    '#000000',
    '#FFFFFF',
    '#6B7280',
    '#EF4444',
    '#F97316',
    '#FACC15',
    '#22C55E',
    '#06B6D4',
    '#2563EB',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
]

const toPickerColor = (value) => {
    const rgba = colord(value).toRgb()

    return {
        r: rgba.r,
        g: rgba.g,
        b: rgba.b,
        a: rgba.a ?? 1,
    }
}

const toColorString = (color) => colord(color).toRgbString()

export const ColorPicker = ({ label, value, onChange }) => {
    const containerRef = useRef(null)
    const rafRef = useRef(null)
    const lastSentValueRef = useRef(value)
    const [isOpen, setIsOpen] = useState(false)
    const [pickerColor, setPickerColor] = useState(toPickerColor(value))
    const [hexDraft, setHexDraft] = useState(colord(value).toHex().toUpperCase())
    const hexValue = colord(pickerColor).toHex().toUpperCase()
    const alpha = Math.round((pickerColor.a ?? 1) * 100)

    useEffect(() => {
        if (value === lastSentValueRef.current) return

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }

        lastSentValueRef.current = value
        setPickerColor(toPickerColor(value))
        setHexDraft(colord(value).toHex().toUpperCase())
    }, [value])

    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const setColor = (nextColor) => {
        const nextValue = toColorString(nextColor)

        setPickerColor(nextColor)
        setHexDraft(colord(nextColor).toHex().toUpperCase())
        lastSentValueRef.current = nextValue

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
        }

        rafRef.current = requestAnimationFrame(() => {
            onChange(nextValue)
            rafRef.current = null
        })
    }

    const handleHexChange = (event) => {
        const nextHex = event.target.value
        setHexDraft(nextHex)

        if (!colord(nextHex).isValid()) return

        setColor({
            ...toPickerColor(nextHex),
            a: pickerColor.a ?? 1,
        })
    }

    return (
        <div className="relative space-y-2" ref={containerRef}>
            <Label>{label}</Label>
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#408A71]/45 bg-[#091413]/55 px-3 text-left transition-colors hover:border-[#B0E4CC]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0E4CC]"
                aria-expanded={isOpen}
            >
                <span className="flex min-w-0 items-center gap-3">
                    <span
                        className="h-6 w-6 shrink-0 rounded-md border border-[#408A71]/55"
                        style={{ backgroundColor: toColorString(pickerColor) }}
                        aria-hidden="true"
                    />
                    <span className="truncate text-sm font-semibold text-[#B0E4CC]">{hexValue}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#B0E4CC]/75">
                    {alpha}%
                    <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                </span>
            </button>

            {isOpen && (
                <div
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 space-y-3 rounded-lg border border-[#408A71]/45 bg-[#285A48] p-3"
                    onMouseDown={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                >
                    <RgbaColorPicker color={pickerColor} onChange={setColor} />

                    <div className="grid grid-cols-[1fr_4rem] gap-2">
                        <input
                            value={hexDraft}
                            onChange={handleHexChange}
                            onBlur={() => setHexDraft(hexValue)}
                            className="h-10 rounded-lg border border-[#408A71]/45 bg-[#091413]/65 px-3 text-sm font-semibold uppercase text-[#B0E4CC] outline-none transition-all placeholder:text-[#408A71]/85 focus:border-[#B0E4CC]"
                            aria-label={`${label} hex value`}
                        />
                        <div
                            className="rounded-lg border border-[#408A71]/45"
                            style={{ backgroundColor: toColorString(pickerColor) }}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
                        {PRESETS.map((preset) => {
                            const isSelected = colord(preset).toHex() === colord(pickerColor).toHex()

                            return (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setColor({ ...toPickerColor(preset), a: 1 })}
                                    className={cn(
                                        'h-7 rounded-md border transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0E4CC]',
                                        isSelected
                                            ? 'border-[#B0E4CC]'
                                            : 'border-[#408A71]/45'
                                    )}
                                    style={{ backgroundColor: preset }}
                                    aria-label={`Select color ${preset}`}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
