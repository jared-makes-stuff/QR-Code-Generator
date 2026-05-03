import { Label } from '../ui/Label'
import { cn } from '../../lib/utils'

export const OptionSelector = ({ label, value, onChange, options, columns = 'grid-cols-4' }) => {
    return (
        <div className="space-y-3">
            <Label>{label}</Label>
            <div className={cn('grid gap-2', columns)}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        className={cn(
                            'rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0E4CC]',
                            value === option.id
                                ? 'border-[#B0E4CC] bg-[#B0E4CC] text-[#091413]'
                                : 'border-[#408A71]/35 bg-[#408A71]/14 text-[#B0E4CC] hover:border-[#B0E4CC]/45 hover:bg-[#408A71]/24'
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
