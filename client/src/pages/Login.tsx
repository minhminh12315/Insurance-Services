import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fakeUsers } from '../data/fakeData';
import loginImage from '../assets/image.png';

type AuthMode = 'login' | 'register' | 'forgot' | 'otp';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [mode, setMode] = useState<AuthMode>('login');

    // Form States
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        otp: ''
    });
    const [rememberMe, setRememberMe] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Check for saved email on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const user = fakeUsers.find(u => u.email === formData.email);
            let isValid = false;

            if (user) {
                if (formData.email === 'admin' && formData.password === '123123') {
                    isValid = true;
                } else if (formData.email !== 'admin') {
                    isValid = true;
                }
            }

            if (isValid && user) {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                login(user);
                if (user.role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                setError('Invalid username or password');
            }
            setLoading(false);
        }, 1000);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setSuccess('Account created successfully! Please sign in.');
            setMode('login');
            setLoading(false);
        }, 1000);
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setSuccess(`OTP sent to ${formData.email}`);
            setMode('otp');
            setLoading(false);
        }, 1000);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            if (formData.otp === '1234') { // Mock OTP
                setSuccess('Password reset successfully. Please login with your new password.');
                setMode('login');
            } else {
                setError('Invalid OTP');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
            <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">

                {/* Left Side - Image (Book Cover) */}
                <div className="hidden md:block w-1/2 relative bg-slate-900">
                    <img
                        src={loginImage}
                        alt="Login Visual"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Insurance Services</h2>
                        <p className="text-slate-300 text-lg">Secure, reliable, and comprehensive insurance management for everyone.</p>
                    </div>
                </div>

                {/* Right Side - Forms */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            {mode === 'login' && 'Welcome Back'}
                            {mode === 'register' && 'Create Account'}
                            {mode === 'forgot' && 'Reset Password'}
                            {mode === 'otp' && 'Verify OTP'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-3">
                            {mode === 'login' && 'Sign in to manage your portal'}
                            {mode === 'register' && 'Get started with your free account'}
                            {mode === 'forgot' && 'Enter your email to receive an OTP'}
                            {mode === 'otp' && 'Enter the 4-digit code sent to your email'}
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-3 border border-red-100">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-3 border border-green-100">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* LOGIN FORM */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Username or Email</label>
                                <input
                                    name="email"
                                    type="text"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                                    placeholder="admin or email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                                    />
                                    <span className="text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                                    className="font-medium text-blue-600 hover:text-blue-700 transition"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-base mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                            <p className="text-center text-sm text-slate-500 mt-6">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </form>
                    )}

                    {/* REGISTER FORM */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-base mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                            <p className="text-center text-sm text-slate-500 mt-4">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign In
                                </button>
                            </p>
                        </form>
                    )}

                    {/* FORGOT PASSWORD FORM */}
                    {mode === 'forgot' && (
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-base"
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700 transition"
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    {/* OTP FORM */}
                    {mode === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">OTP Code</label>
                                <input
                                    name="otp"
                                    type="text"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center tracking-widest text-lg font-mono"
                                    placeholder="0000"
                                    maxLength={4}
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-2 text-center">
                                    Use code <span className="font-mono font-bold text-slate-700">1234</span> for testing
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-base"
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify & Reset Password'}
                            </button>
                            <div className="text-center space-y-3">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                                >
                                    Resend OTP
                                </button>
                                <div className="block">
                                    <button
                                        type="button"
                                        onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                        className="text-sm font-medium text-slate-500 hover:text-slate-700 transition"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Login;
