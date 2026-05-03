import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FormatSelector = ({ value, onChange, options = ["png", "jpeg", "webp"] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

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
                aria-expanded={isOpen}
                className="flex h-11 w-24 items-center justify-between rounded-lg border border-[#408A71]/45 bg-[#408A71]/14 px-4 py-2 text-sm font-semibold uppercase text-[#B0E4CC] transition-all duration-200 ease-out hover:border-[#B0E4CC]/50 hover:bg-[#408A71]/24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0E4CC]"
            >
                {value}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.6 }}
                        className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#408A71]/45 bg-[#285A48]"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm uppercase text-[#B0E4CC] transition-colors duration-200 hover:bg-[#408A71]/24"
                            >
                                {option}
                                {value === option && <Check className="h-3 w-3 text-[#B0E4CC]" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
