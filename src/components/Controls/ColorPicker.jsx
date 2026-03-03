import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
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
        // Preserve current alpha when picking preset? Or reset?
        // Let's reset to full opacity for presets usually, or keep current alpha.
        // Let's keep alpha 1 for presets for simplicity unless user wants otherwise.
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
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={`w-6 h-6 rounded-md border transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${hex === colord(preset).toHex() ? 'border-white ring-2 ring-white/20 scale-110' : 'border-white/10'}`}
                            style={{ backgroundColor: preset }}
                            aria-label={`Select color ${preset}`}
                        />
                    ))}
                </div>

                {/* Custom Color Area */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Custom Color</span>
                    <div className="flex gap-4 items-center">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/20 shadow-lg cursor-pointer group hover:border-white/40 transition-colors">
                            <input
                                type="color"
                                value={hex}
                                onChange={handleColorChange}
                                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] p-0 m-0 cursor-pointer border-none outline-none"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            {/* Opacity Slider */}
                            <div className="relative flex items-center w-full h-6">
                                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={alpha}
                                    onChange={handleAlphaChange}
                                    className="relative w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-transform"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
