import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/insuranceApi';
import loginImage from '../assets/image.png';

type AuthMode = 'login' | 'register';

interface AuthForm {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
}

const defaultForm: AuthForm = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '1995-01-01',
    phoneNumber: '',
};

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    const [mode, setMode] = useState<AuthMode>('login');
    const [formData, setFormData] = useState<AuthForm>(defaultForm);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);


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
        setErrorMessage('');
        setSuccessMessage('');
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

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            const session = await authApi.login(formData.email, formData.password);
            persistRememberedEmail();
            login(session);
            redirectAfterLogin(session.user.role);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Login failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const session = await authApi.register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phoneNumber: formData.phoneNumber || undefined,
                dateOfBirth: formData.dateOfBirth,
                gender: 'Other',
            });

            persistRememberedEmail();
            login(session);
            setSuccessMessage('Account created successfully.');
            redirectAfterLogin(session.user.role);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
            <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                <div className="hidden md:block w-1/2 relative bg-slate-900">
                    <img src={loginImage} alt="Login Visual" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Insurance Services</h2>
                        <p className="text-slate-300 text-lg">
                            Secure, reliable, and comprehensive insurance management for everyone.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                        <p className="text-slate-500 text-sm mt-3">
                            {mode === 'login'
                                ? 'Sign in to continue with your insurance portal'
                                : 'Create your customer account and start calculating premiums'}
                        </p>
                    </div>

                    {errorMessage ? (
                        <div className="mb-5 p-3.5 rounded-lg border border-red-100 bg-red-50 text-red-600 text-sm">{errorMessage}</div>
                    ) : null}
                    {successMessage ? (
                        <div className="mb-5 p-3.5 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 text-sm">
                            {successMessage}
                        </div>
                    ) : null}

                    {mode === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(event) => setRememberMe(event.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                />
                                Remember me
                            </label>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>

                            <p className="text-center text-sm text-slate-500 mt-6">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('register');
                                        setErrorMessage('');
                                        setSuccessMessage('');
                                        setShowPassword(false);
                                        setShowConfirmPassword(false);
                                    }}
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                                    <input
                                        name="dateOfBirth"
                                        type="date"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
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
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <p className="text-center text-sm text-slate-500 mt-4">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('login');
                                        setErrorMessage('');
                                        setSuccessMessage('');
                                        setShowPassword(false);
                                        setShowConfirmPassword(false);
                                    }}
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign In
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
