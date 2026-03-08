import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi, type PaymentModel } from '../../services/insuranceApi';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const txnRef = searchParams.get('txnRef');
    const [payment, setPayment] = useState<PaymentModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!txnRef) {
            setError('No transaction reference found.');
            setLoading(false);
            return;
        }

        const fetchPaymentStatus = async () => {
            try {
                // Poll for status or just fetch once
                const data = await paymentApi.getPaymentByOrderCode(txnRef);
                setPayment(data);
            } catch (err) {
                setError('Failed to fetch payment details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [txnRef]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Verifying your payment...</p>
            </div>
        );
    }

    const isSuccess = payment?.status === 'Success' || payment?.status === 'Completed';

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
                {/* Header Decoration */}
                <div className={`h-3 ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                <div className="p-10 text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${isSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                        }`}>
                        {isSuccess ? (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                    </h1>
                    <p className="text-slate-500 mb-8">
                        {isSuccess
                            ? 'Your premium payment has been processed successfully.'
                            : 'There was an issue processing your payment. Please try again.'}
                    </p>

                    {/* Details Card */}
                    <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Amount Paid</span>
                                <span className="text-slate-900 font-bold">${payment?.amountPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Order Reference</span>
                                <span className="text-slate-700 font-mono text-xs">{txnRef}</span>
                            </div>
                            {payment?.transactionReference && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm">VNPay Reference</span>
                                    <span className="text-slate-700 font-mono text-xs">{payment.transactionReference}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Date</span>
                                <span className="text-slate-700 text-sm">
                                    {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        {isSuccess ? (
                            <button
                                onClick={() => navigate('/user/policies')}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                            >
                                View My Policies
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/calculator')}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                            >
                                Try Again
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full py-4 bg-transparent text-slate-600 font-semibold hover:bg-slate-50 rounded-2xl transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm text-center font-medium">
                    {error}
                </div>
            )}
        </div>
    );
};

export default PaymentResult;
