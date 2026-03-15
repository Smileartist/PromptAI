import React, { useState } from 'react';
import { Trash2, Copy, Check, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function PromptList({ prompts, onDelete }) {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!prompts || prompts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 px-6 rounded-2xl border border-dashed border-white/20 text-gray-400 bg-white/5 backdrop-blur-md"
            >
                <p className="text-lg mb-2">The vault is empty.</p>
                <p className="text-sm opacity-70">Spark an idea to generate your first prompt.</p>
            </motion.div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <Tooltip.Provider delayDuration={300}>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                <AnimatePresence mode="popLayout">
                    {prompts.map((prompt) => (
                        <motion.div
                            key={prompt.id}
                            layout
                            variants={item}
                            exit="exit"
                            className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-inner">
                                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                                    {prompt.category}
                                </span>

                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <button
                                            onClick={() => onDelete(prompt.id)}
                                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className="px-3 py-1.5 bg-gray-900 text-xs text-white rounded-md shadow-xl animate-in fade-in zoom-in-95" sideOffset={5}>
                                            Delete prompt
                                            <Tooltip.Arrow className="fill-gray-900" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </div>

                            <div className="mb-6 relative z-10">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Engineered Prompt</h3>
                                <div className="relative group/code">
                                    <div className="bg-black/40 backdrop-blur-md p-5 rounded-xl font-mono text-sm text-gray-200 leading-relaxed border border-white/5 shadow-inner">
                                        {prompt.generated_prompt}
                                    </div>

                                    <Tooltip.Root>
                                        <Tooltip.Trigger asChild>
                                            <button
                                                onClick={() => handleCopy(prompt.generated_prompt, prompt.id)}
                                                className="absolute top-3 right-3 p-2 bg-gray-800/80 hover:bg-indigo-600 border border-white/10 rounded-lg text-gray-300 hover:text-white backdrop-blur-sm transition-all shadow-lg opacity-0 group-hover/code:opacity-100"
                                            >
                                                {copiedId === prompt.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </Tooltip.Trigger>
                                        <Tooltip.Portal>
                                            <Tooltip.Content className="px-3 py-1.5 bg-gray-900 text-xs text-white rounded-md shadow-xl animate-in fade-in zoom-in-95" sideOffset={5}>
                                                {copiedId === prompt.id ? 'Copied!' : 'Copy to clipboard'}
                                                <Tooltip.Arrow className="fill-gray-900" />
                                            </Tooltip.Content>
                                        </Tooltip.Portal>
                                    </Tooltip.Root>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Original Logic</h3>
                                <p className="text-sm text-gray-400 italic">"{prompt.user_input}"</p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-white/5 text-xs text-gray-600 text-right relative z-10">
                                {new Date(prompt.created_at).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </Tooltip.Provider>
    );
}
