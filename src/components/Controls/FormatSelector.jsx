import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FormatSelector = ({ value, onChange, options = ["png", "jpeg", "webp"] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-24 px-4 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium uppercase"
            >
                {value}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 overflow-hidden bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left text-slate-300 hover:text-white hover:bg-white/10 transition-colors uppercase"
                            >
                                {option}
                                {value === option && <Check className="w-3 h-3 text-blue-400" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
