import React, { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { promptApi } from '../api/client';

export default function PromptForm({ onPromptGenerated }) {
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idea.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await promptApi.generatePrompt(idea.trim());
            if (response.status === 'success') {
                onPromptGenerated(response.data);
                setIdea('');
            } else {
                setError(response.message || 'Generation failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during generation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2 flex items-center text-white">
                    <Sparkles className="w-5 h-5 mr-3 text-indigo-400" />
                    Generate Prompt
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6 font-medium">
                    Transform your raw ideas into masterfully engineered AI instructions.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <motion.div
                            initial={false}
                            animate={{
                                boxShadow: isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.5)' : '0 0 0 0px rgba(99, 102, 241, 0)',
                                borderColor: isFocused ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)'
                            }}
                            className="rounded-xl overflow-hidden glass-panel transition-colors duration-300"
                        >
                            <textarea
                                value={idea}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="e.g. create a prompt for a marketing email..."
                                className="w-full p-4 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 resize-none h-32 text-base transition-all outline-none"
                                disabled={loading}
                            />
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg flex items-center"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || !idea.trim()}
                        className={cn(
                            "w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 px-4 rounded-xl transition-all flex justify-center items-center shadow-lg shadow-indigo-500/25",
                            (loading || !idea.trim()) && "opacity-50 cursor-not-allowed hover:bg-indigo-600 hover:scale-100"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                Engineering...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5 mr-2" />
                                Generate Magic
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
