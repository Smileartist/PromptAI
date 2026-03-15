import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, LogIn, UserPlus, Ghost } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, signup, continueAsGuest } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const action = isLogin ? login : signup;
        const result = await action(email, password);

        if (result.success) {
            onClose();
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleGuest = () => {
        continueAsGuest();
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Subtle accent gradient */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {isLogin
                                ? 'Sign in to sync your prompt library across devices.'
                                : 'Sign up to build your persistent prompt empire.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        <div className="space-y-1">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-colors flex justify-center items-center mt-6 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isLogin ? (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Sign In
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 relative z-10">
                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-wider">or</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <button
                            onClick={handleGuest}
                            className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 font-medium py-3 px-4 rounded-xl transition-colors flex justify-center items-center border border-white/5"
                        >
                            <Ghost className="w-4 h-4 mr-2" />
                            Continue as Guest (Offline Mode)
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-zinc-400 relative z-10">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors focus:outline-none"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
