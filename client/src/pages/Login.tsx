import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/insuranceApi';
import loginBanner from '../assets/loginBanner.jpg';

interface LoginForm {
    email: string;
    password: string;
}

const defaultForm: LoginForm = {
    email: '',
    password: '',
};

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    const [formData, setFormData] = useState<LoginForm>(defaultForm);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [inputErrors, setInputErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});

    useEffect(() => {
        if (isAuthenticated && user) {
            redirectAfterLogin(user.role);
        }

        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData((previous) => ({ ...previous, email: savedEmail }));
            setRememberMe(true);
        }
    }, [isAuthenticated, user]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSubmitError('');
        setSuccessMessage('');
        setInputErrors((previous) => ({ ...previous, [name]: '' }));
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const persistRememberedEmail = () => {
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
            return;
        }
        localStorage.removeItem('rememberedEmail');
    };

    const redirectAfterLogin = (role?: string) => {
        if (role === 'Admin') {
            navigate('/admin');
            return;
        }
        if (role === 'Customer') {
            navigate('/home');
            return;
        }
    };

    const validate = () => {
        const errors: Partial<Record<keyof LoginForm, string>> = {};
        if (!formData.email) {
            errors.email = 'Please enter your email.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email address.';
        }
        if (!formData.password) {
            errors.password = 'Please enter your password.';
        }
        setInputErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isSubmitting) return;

        setSuccessMessage('');

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const session = await authApi.login(formData.email, formData.password);
            persistRememberedEmail();
            login(session);
            redirectAfterLogin(session.user.role);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Login failed.';
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="flex w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[750px]">
                    <div className="hidden md:block w-1/2 relative overflow-hidden bg-slate-100">
                        <img src={loginBanner} alt="Login Visual" className="absolute inset-0 w-full h-full object-cover" />

                    </div>

                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
                            <p className="text-slate-500 text-sm mt-3">
                                Sign in to continue with your insurance portal
                            </p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {inputErrors.email && <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">{inputErrors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {inputErrors.password && <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">{inputErrors.password}</p>}
                            </div>
                            {submitError && !Object.values(inputErrors).some(Boolean) ? (
                                <div className="mb-5 p-3.5 rounded-lg border border-red-100 bg-red-50 text-red-600 text-sm">{submitError}</div>
                            ) : null}
                            {successMessage ? (
                                <div className="mb-5 p-3.5 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 text-sm">
                                    {successMessage}
                                </div>
                            ) : null}

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) => setRememberMe(event.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                    />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>

                            <p className="text-center text-sm text-slate-500 mt-6">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #e2e8f0;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #cbd5e1;
            }
        `}</style>
        </>
    );
};

export default Login;
