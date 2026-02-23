import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            // Check admin role (case-insensitive)
            if (user.role?.toUpperCase() === 'ADMIN') {
                signIn(token, user);
                navigate('/admin/products');
            } else {
                throw new Error('관리자 권한이 없습니다.');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message;
            setError(message === 'Invalid credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#2a2a2a] p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/5"
            >
                <div className="text-center mb-8 font-serif">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-white/60">관리자 전용 로그인</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red transition-colors"
                            placeholder="admin@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red transition-colors"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dancheong-red hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
