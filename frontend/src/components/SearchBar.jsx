import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ value, onChange }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative mb-6">
            <motion.div
                animate={{
                    boxShadow: isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.4)' : '0 0 0 0px rgba(99, 102, 241, 0)',
                }}
                className="relative rounded-xl overflow-hidden glass-panel border border-white/10 transition-colors duration-300"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`h-4 w-4 md:h-5 md:w-5 transition-colors duration-300 ${isFocused ? 'text-indigo-400' : 'text-gray-500'}`} />
                </div>
                <input
                    type="text"
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-transparent border-none text-white focus:ring-0 outline-none placeholder-gray-500 text-sm md:text-base"
                    placeholder="Search prompts by keyword or category..."
                />
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => onChange('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                        >
                            ✕
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
