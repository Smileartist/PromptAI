import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Calendar, Tag, MessageSquare, Terminal } from 'lucide-react';

export default function PromptDetailModal({ prompt, isOpen, onClose }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.generated_prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!prompt) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-xl">
                                    <Terminal className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Prompt Details</h2>
                                        {prompt.created_at && (
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(prompt.created_at).toLocaleString()}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body (Scrollable) */}
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                            {/* Category & Status */}
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                                    {prompt.category}
                                </span>
                            </div>

                            {/* User Input */}
                            <div className="space-y-3">
                                <h3 className="flex items-center text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Original Intent
                                </h3>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-zinc-300 italic text-sm leading-relaxed">
                                    "{prompt.user_input}"
                                </div>
                            </div>

                            {/* Generated Prompt */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Engineered Output</h3>
                                    <button 
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        {copied ? (
                                            <><Check className="w-3.5 h-3.5" /> COPIED</>
                                        ) : (
                                            <><Copy className="w-3.5 h-3.5" /> COPY PROMPT</>
                                        )}
                                    </button>
                                </div>
                                <div className="p-6 bg-black rounded-2xl border border-indigo-500/20 shadow-inner font-mono text-sm text-zinc-200 leading-loose whitespace-pre-wrap select-all">
                                    {prompt.generated_prompt}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-zinc-900/50 border-t border-white/5 flex justify-end">
                            <button 
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs uppercase tracking-widest rounded-xl border border-white/10 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
