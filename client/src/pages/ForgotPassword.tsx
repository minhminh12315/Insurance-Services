import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/insuranceApi';
import loginBanner from '../assets/loginBanner.jpg';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [formData, setFormData] = useState({
        email: '',
        otpCode: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);

    // Countdown logic
    useEffect(() => {
        let timer: any;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (countdown > 0) return;

        setIsSubmitting(true);
        setError('');
        try {
            const res = await authApi.forgotPassword({ email: formData.email });
            setSuccess(res.message || 'Mã OTP đã được gửi đến email.');
            setStep(2);
            setCountdown(60); // Start 60s countdown
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await authApi.forgotPassword({
                email: formData.email,
                otpCode: formData.otpCode,
                newPassword: formData.newPassword,
            });
            setSuccess('Đổi mật khẩu thành công! Đang chuyển hướng...');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Mã OTP không đúng hoặc đã hết hạn.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="flex w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[750px]">
                <div className="hidden md:block w-1/2 relative overflow-hidden bg-slate-100">
                    <img src={loginBanner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative font-sans">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {step === 1 ? 'Khôi phục mật khẩu' : 'Xác thực OTP'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-3">
                            {step === 1 
                                ? 'Nhập email để nhận mã bảo mật 6 chữ số' 
                                : `Vui lòng nhập mã OTP đã gửi tới ${formData.email}`}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email tài khoản</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="your-email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium animate-shake">{error}</div>}

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-70"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang gửi mã...
                                    </span>
                                ) : 'Gửi mã xác thực'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 text-center">Mã xác thực (OTP)</label>
                                <input
                                    name="otpCode"
                                    type="text"
                                    maxLength={6}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center tracking-[0.75em] font-black placeholder:text-slate-200"
                                    placeholder="000000"
                                    value={formData.otpCode}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs text-slate-400">Hết hạn trong: <strong className="text-slate-600">1 phút</strong></span>
                                    {countdown > 0 ? (
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                            Gửi lại sau {countdown}s
                                        </span>
                                    ) : (
                                        <button 
                                            type="button" 
                                            onClick={() => handleSendOtp()}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Gửi lại mã OTP
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu mới</label>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="Min. 6 ký tự"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nhập lại mật khẩu</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium">{error}</div>}
                            {success && <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 text-sm font-medium">{success}</div>}

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-70 mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={() => { setStep(1); setCountdown(0); }}
                                className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800 transition py-2"
                            >
                                ← Quay lại nhập email
                            </button>
                        </form>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Đã nhớ mật khẩu? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 ml-1">Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
