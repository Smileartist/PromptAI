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

    const [latestGeneratedPrompt, setLatestGeneratedPrompt] = useState(null);

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
        setLatestGeneratedPrompt(newPrompt);
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

    const handleDeleteAllData = async () => {
        if (!confirm('Are you sure you want to delete all your saved prompts? This action cannot be undone.')) return;
        try {
            await promptApi.deleteAllData();
            setPrompts([]);
            alert('All data deleted successfully');
        } catch (error) {
            alert(error.message || 'Failed to delete data');
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('CRITICAL: Are you sure you want to delete your account? This will permanently remove your profile and all saved prompts. This action cannot be undone.')) return;
        try {
            await promptApi.deleteAccount();
            logout();
            alert('Your account has been permanently deleted.');
        } catch (error) {
            alert(error.message || 'Failed to delete account');
        }
    };

    return (
        <div className="relative min-h-screen text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none mix-blend-screen" />

            <div className="relative z-10 px-4 pt-2 pb-24 md:py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`relative ${activeTab === 'generate' ? 'mb-6 mt-0 md:mb-12 md:mt-4' : 'mb-4 mt-0 md:mb-12 md:mt-4 hidden md:block'}`}
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-8">
                        {/* Logo on the Left */}
                        <div className="md:w-1/4 flex justify-center md:justify-start">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center p-0.5 rounded-2xl md:rounded-[32px] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl cursor-pointer overflow-hidden group"
                            >
                                <div className="bg-zinc-950 p-1 rounded-2xl md:rounded-[30px] overflow-hidden">
                                    <img src="/logo.png" alt="PromptAI Logo" className="w-14 h-14 md:w-28 md:h-28 object-cover rounded-[14px] md:rounded-[28px] transition-transform duration-300 group-hover:scale-110" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Centered Title and Tagline */}
                        <div className="md:w-2/4 text-center pt-1 md:pt-4">
                            <h1 className="text-2xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400 drop-shadow-sm mb-1 md:mb-4">
                                PromptAI
                            </h1>
                            <p className="text-xs md:text-lg text-gray-400 font-medium opacity-90 px-4 md:px-0">
                                {isGuest
                                    ? "Offline Mode • Your ultimate prompt engineering hub"
                                    : "Master your AI workflows with intelligent prompt management."}
                            </p>
                        </div>

                        {/* Auth Button on the Right */}
                        <div className="md:w-1/4 flex justify-center md:justify-end pt-1 md:pt-4">
                            {token ? (
                                <button
                                    onClick={logout}
                                    className="flex items-center text-[10px] md:text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all"
                                >
                                    <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                                    Log Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="flex items-center text-[10px] md:text-sm font-medium text-white hover:text-white bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/30 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <UserIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                                    Sign In / Save Progress
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Tab Header (Condensed) */}
                <div className="flex md:hidden items-center justify-between mb-4 mt-2">
                    {activeTab !== 'generate' && (
                        <h1 className="text-xl font-bold text-white capitalize">
                            {activeTab}
                        </h1>
                    )}
                    {activeTab !== 'generate' && (
                        <div className="flex items-center gap-2">
                             {token ? (
                                <button onClick={logout} className="p-2 bg-white/5 rounded-lg border border-white/5">
                                    <LogOut className="w-4 h-4 text-zinc-400" />
                                </button>
                            ) : (
                                <button onClick={() => setShowAuthModal(true)} className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
                                    <UserIcon className="w-4 h-4 text-indigo-400" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`lg:col-span-4 ${activeTab === 'generate' ? 'block' : 'hidden lg:block'}`}
                    >
                        <div className="sticky top-8 space-y-6">
                            <PromptForm onPromptGenerated={handlePromptGenerated} />
                            
                            <AnimatePresence>
                                {latestGeneratedPrompt && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className="glass-panel p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
                                    >
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500/20 rounded-bl-xl text-[10px] font-black uppercase text-indigo-300 tracking-wider">
                                            Latest Result
                                        </div>
                                        
                                        <div className="mb-3">
                                            <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                                                {latestGeneratedPrompt.category}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-sm font-bold text-white mb-2">Engineered Prompt:</h3>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-[300px] overflow-y-auto mb-4">
                                            <p className="text-xs md:text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                                {latestGeneratedPrompt.generated_prompt}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(latestGeneratedPrompt.generated_prompt);
                                                alert('Prompt copied to clipboard!');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl border border-indigo-500/30 transition-all shadow-lg shadow-indigo-500/20"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                                            Copy to Clipboard
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={`lg:col-span-8 ${activeTab === 'library' ? 'block' : 'hidden lg:block'}`}
                    >
                        <div className="glass-panel p-5 md:p-8 rounded-2xl md:rounded-3xl min-h-[400px]">
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center tracking-tight">
                                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-3 text-purple-400" />
                                    Library
                                </h2>
                                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] md:text-xs font-medium text-gray-300 border border-white/5">
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
                        <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl text-center">
                            {token ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
                                        <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold">Account</h2>
                                    <p className="text-zinc-400 text-xs md:text-sm">You are logged in and your prompts are syncing to the database.</p>
                                    
                                    <div className="pt-4 space-y-3">
                                        <button onClick={logout} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3.5 rounded-xl w-full flex items-center justify-center transition-colors text-sm">
                                            <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Log Out
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={handleDeleteAllData} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 py-3 rounded-xl flex items-center justify-center transition-colors text-xs font-semibold">
                                                Delete Data
                                            </button>
                                            <button onClick={handleDeleteAccount} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-xl flex items-center justify-center transition-colors text-xs font-semibold">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                        <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-zinc-400" />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold">Guest Mode</h2>
                                    <p className="text-zinc-400 text-xs md:text-sm">Your generated prompts are only saved to this browser.</p>
                                    
                                    <div className="pt-4 space-y-3">
                                        <button onClick={() => setShowAuthModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 px-6 py-3.5 rounded-xl w-full flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/25 text-sm">
                                            <UserIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Sign In / Create Account
                                        </button>
                                        
                                        <button onClick={handleDeleteAllData} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 py-3 rounded-xl w-full flex items-center justify-center transition-colors text-xs font-semibold">
                                            Clear All Local Data
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 flex justify-between items-center gap-8 rounded-full shadow-2xl">
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'generate' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Generate</span>
                </button>
                <button
                    onClick={() => setActiveTab('library')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'library' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Library</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Profile</span>
                </button>
            </div>
        </div>
    );
}

export default App;
