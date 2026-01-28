import { Label } from '../ui/Label'
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import { cn } from '../../lib/utils';
extend([namesPlugin]);

const PRESETS = [
    "#000000", "#FFFFFF", "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B", "#10B981"
]

export const ColorPicker = ({ label, value, onChange }) => {
    // Ensure standard format
    const color = colord(value);
    const hex = color.toHex();
    const alpha = color.alpha(); // 0 to 1

    const handleColorChange = (e) => {
        const newHex = e.target.value;
        const newColor = colord(newHex).alpha(alpha);
        onChange(newColor.toRgbString());
    };

    const handleAlphaChange = (e) => {
        const newAlpha = parseFloat(e.target.value);
        const newColor = color.alpha(newAlpha);
        onChange(newColor.toRgbString());
    };

    const handlePresetClick = (preset) => {
        onChange(colord(preset).toRgbString());
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <div className="text-xs text-slate-500 font-mono uppercase">{hex} {Math.round(alpha * 100)}%</div>
            </div>

            <div className="space-y-4">
                {/* Presets Grid */}
                <div className="flex flex-wrap gap-3">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                "w-8 h-8 rounded-full border transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm",
                                hex === colord(preset).toHex()
                                    ? 'border-white ring-2 ring-white/20 scale-110 shadow-md'
                                    : 'border-white/10'
                            )}
                            style={{ backgroundColor: preset }}
                            aria-label={`Select color ${preset}`}
                        />
                    ))}

                    {/* Color Input Trigger */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white/40 transition-colors shadow-sm cursor-pointer group hover:scale-110">
                        <div
                            className="absolute inset-0"
                            style={{ backgroundColor: hex }}
                        />
                        {/* Rainbow gradient border effect or just icon? Let's stick to simple input overlay */}
                        <input
                            type="color"
                            value={hex}
                            onChange={handleColorChange}
                            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] p-0 m-0 cursor-pointer opacity-0"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/50 group-hover:text-white">
                            <span className="text-[10px]">+</span>
                        </div>
                    </div>
                </div>

                {/* Opacity Slider */}
                <div className="pt-1">
                    <div className="relative flex items-center w-full h-4 group">
                        <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={alpha}
                            onChange={handleAlphaChange}
                            className="relative w-full h-1.5 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
