import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CircuitBoard, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import PromptForm from './components/PromptForm';
import PromptList from './components/PromptList';
import SearchBar from './components/SearchBar';
import AuthModal from './components/AuthModal';
import { promptApi } from './api/client';
import { useAuth } from './context/AuthContext';

function App() {
    const { token, isGuest, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(!token && !isGuest);
    const [activeTab, setActiveTab] = useState('generate'); // generate, library, profile

    const [prompts, setPrompts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPrompts = useCallback(async (query = '') => {
        setLoading(true);
        try {
            const response = await promptApi.getPrompts(query);
            if (response.status === 'success') {
                setPrompts(response.data);
            }
        } catch (error) {
            console.error('Error fetching prompts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Show Auth modal automatically if they have no token and haven't explicitly chosen guest mode
    useEffect(() => {
        if (!token && !isGuest) {
            setShowAuthModal(true);
        } else {
            setShowAuthModal(false);
            // Whenever auth state finalizes (login, signup, guest), fetch prompts
            fetchPrompts(searchQuery);
        }
    }, [token, isGuest, fetchPrompts, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPrompts(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchPrompts]);

    const handlePromptGenerated = (newPrompt) => {
        setPrompts((prev) => [newPrompt, ...prev]);
    };

    const handleDelete = async (id) => {
        // Optimistic delete
        const previous = [...prompts];
        setPrompts((prev) => prev.filter(p => p.id !== id));

        try {
            await promptApi.deletePrompt(id);
        } catch (error) {
            // Revert if failed
            setPrompts(previous);
            alert('Failed to delete prompt');
        }
    };

    return (
        <div className="relative min-h-screen text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none mix-blend-screen" />

            <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-12 mt-4"
                >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        {/* Logo on the Left */}
                        <div className="md:w-1/4 flex justify-start">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center p-0.5 rounded-[32px] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl cursor-pointer overflow-hidden group"
                            >
                                <div className="bg-zinc-950 p-1 rounded-[30px] overflow-hidden">
                                    <img src="/logo.png" alt="PromptAI Logo" className="w-32 h-32 object-cover rounded-[28px] transition-transform duration-300 group-hover:scale-110" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Centered Title and Tagline */}
                        <div className="md:w-2/4 text-center pt-4">
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400 drop-shadow-sm mb-4">
                                PromptAI
                            </h1>
                            <p className="text-lg text-gray-400 font-medium opacity-90">
                                {isGuest
                                    ? "Offline Mode • Your ultimate prompt engineering hub"
                                    : "Master your AI workflows with intelligent prompt management."}
                            </p>
                        </div>

                        {/* Auth Button on the Right */}
                        <div className="md:w-1/4 flex justify-end pt-4">
                            {token ? (
                                <button
                                    onClick={logout}
                                    className="flex items-center text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Log Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="flex items-center text-sm font-medium text-white hover:text-white bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/30 px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Sign In / Save Progress
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-32 lg:pb-0">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`lg:col-span-4 ${activeTab === 'generate' ? 'block' : 'hidden lg:block'}`}
                    >
                        <div className="sticky top-8">
                            <PromptForm onPromptGenerated={handlePromptGenerated} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={`lg:col-span-8 ${activeTab === 'library' ? 'block' : 'hidden lg:block'}`}
                    >
                        <div className="glass-panel p-8 rounded-3xl min-h-[500px]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center tracking-tight">
                                    <BookOpen className="w-6 h-6 mr-3 text-purple-400" />
                                    Library
                                </h2>
                                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300 border border-white/5">
                                    {prompts.length} entries
                                </div>
                            </div>

                            <SearchBar value={searchQuery} onChange={setSearchQuery} />

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loader"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center items-center py-20"
                                    >
                                        <div className="flex space-x-2">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                    className="w-3 h-3 bg-indigo-500 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <PromptList prompts={prompts} onDelete={handleDelete} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Mobile Profile Tab */}
                    <motion.div
                        className={`lg:hidden ${activeTab === 'profile' ? 'block' : 'hidden'} lg:col-span-8`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="glass-panel p-8 rounded-3xl text-center">
                            {token ? (
                                <div className="space-y-4">
                                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
                                        <UserIcon className="w-10 h-10 text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-bold">Account</h2>
                                    <p className="text-zinc-400 text-sm">You are logged in and your prompts are syncing to the database.</p>
                                    <button onClick={logout} className="mt-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-4 rounded-xl w-full flex items-center justify-center transition-colors">
                                        <LogOut className="w-5 h-5 mr-2" /> Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                        <UserIcon className="w-10 h-10 text-zinc-400" />
                                    </div>
                                    <h2 className="text-xl font-bold">Guest Mode</h2>
                                    <p className="text-zinc-400 text-sm">Your generated prompts are only saved to this browser.</p>
                                    <button onClick={() => setShowAuthModal(true)} className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 px-6 py-4 rounded-xl w-full flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/25">
                                        <UserIcon className="w-5 h-5 mr-2" /> Sign In / Create Account
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 px-8 pt-4 pb-6 flex justify-between items-center">
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'generate' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Sparkles className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Generate</span>
                </button>
                <button
                    onClick={() => setActiveTab('library')}
                    className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'library' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Library</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <UserIcon className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Profile</span>
                </button>
            </div>
        </div>
    );
}

export default App;
