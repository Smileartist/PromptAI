import React, { useState } from 'react';
import { Trash2, Tag, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import PromptDetailModal from './PromptDetailModal';

export default function PromptList({ prompts, onDelete }) {
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    if (!prompts || prompts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 px-6 rounded-2xl border border-dashed border-white/20 text-gray-400 bg-white/5 backdrop-blur-md"
            >
                <p className="text-lg mb-2 text-white font-bold">The vault is empty.</p>
                <p className="text-sm opacity-70">Spark an idea to generate your first prompt.</p>
            </motion.div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
    };

    return (
        <Tooltip.Provider delayDuration={300}>
            <div className="space-y-4">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-3"
                >
                    <AnimatePresence mode="popLayout">
                        {prompts.map((prompt) => (
                            <motion.div
                                key={prompt.id}
                                layout
                                variants={item}
                                exit="exit"
                                className="group relative"
                            >
                                <div 
                                    onClick={() => setSelectedPrompt(prompt)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-white/10 transition-all cursor-pointer group/item"
                                >
                                    {/* Category Icon/Pill */}
                                    <div className="flex-shrink-0">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl group-hover/item:bg-indigo-500/20 transition-colors border border-indigo-500/10">
                                            <Tag className="w-5 h-5 text-indigo-400" />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">
                                                {prompt.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                                                <Clock className="w-2.5 h-2.5" />
                                                {new Date(prompt.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <h3 className="text-sm text-zinc-300 font-medium truncate pr-4">
                                            {prompt.user_input}
                                        </h3>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(prompt.id);
                                                    }}
                                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content className="px-3 py-1.5 bg-gray-900 text-xs text-white rounded-md shadow-xl" sideOffset={5}>
                                                    Delete history
                                                    <Tooltip.Arrow className="fill-gray-900" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                        
                                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <PromptDetailModal 
                    prompt={selectedPrompt} 
                    isOpen={!!selectedPrompt} 
                    onClose={() => setSelectedPrompt(null)} 
                />
            </div>
        </Tooltip.Provider>
    );
}
