import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentApi, policyApi, type PaymentModel, type PolicyDetailModel } from '../../services/insuranceApi';

const formatValue = (value: unknown): string => {
    if (typeof value === 'number') {
        return value.toLocaleString('en-US');
    }
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    return String(value);
};

const UserPolicyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState<PolicyDetailModel | null>(null);
    const [payments, setPayments] = useState<PaymentModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const policyId = Number(id);
        if (!policyId) {
            setErrorMessage('Invalid policy id.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setErrorMessage('');
            try {
                const [policyResponse, paymentResponse] = await Promise.all([
                    policyApi.getPolicyById(policyId),
                    paymentApi.getMyPayments(),
                ]);

                setPolicy(policyResponse);
                setPayments(paymentResponse.filter((payment) => payment.policyId === policyId));
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Failed to load policy details.');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [id]);

    const policyDetailsEntries = useMemo(() => {
        if (!policy?.policyDetails) {
            return [];
        }

        return Object.entries(policy.policyDetails).flatMap(([key, value]) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                return Object.entries(value as Record<string, unknown>).map(([nestedKey, nestedValue]) => ({
                    label: `${key}.${nestedKey}`,
                    value: formatValue(nestedValue),
                }));
            }

            return [{ label: key, value: formatValue(value) }];
        });
    }, [policy?.policyDetails]);

    if (loading) {
        return <div className="p-6 text-slate-500">Loading policy details...</div>;
    }

    if (!policy) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-slate-700">Policy not found</h2>
                {errorMessage ? <p className="mt-3 text-sm text-rose-600">{errorMessage}</p> : null}
                <button onClick={() => navigate('/user/policies')} className="mt-4 text-[#015fc9] hover:underline">
                    Back to Policies
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-16 px-4 sm:px-0">
            <button
                onClick={() => navigate('/user/policies')}
                className="mb-6 py-2 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
                ← Back to Policies
            </button>

            {errorMessage ? (
                <div className="mb-6 p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm">{errorMessage}</div>
            ) : null}

            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${policy.policyStatus === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                                }`}
                        >
                            {policy.policyStatus || 'Unknown'}
                        </span>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3">{policy.schemeName}</h1>
                        <p className="text-slate-500 font-mono text-sm mt-1">{policy.policyNumber}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm text-slate-500 mb-1">Sum Assured</p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#015fc9]">${policy.sumAssured.toLocaleString('en-US')}</p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2">Premium: ${policy.premiumAmount.toLocaleString('en-US')} / {policy.paymentFrequency}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Category</p>
                        <p className="text-sm font-semibold text-slate-700">{policy.categoryName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Start Date</p>
                        <p className="text-sm font-semibold text-slate-700">{new Date(policy.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Maturity Date</p>
                        <p className="text-sm font-semibold text-slate-700">{new Date(policy.maturityDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Policy Details</h2>
                {policyDetailsEntries.length === 0 ? (
                    <p className="text-sm text-slate-500">No additional detail is attached to this policy.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {policyDetailsEntries.map((item) => (
                            <div key={item.label} className="border border-slate-100 rounded-xl p-3 bg-slate-50">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{item.label}</p>
                                <p className="text-sm font-medium text-slate-700 mt-1 break-words">{item.value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Payment History</h2>
                {payments.length === 0 ? (
                    <p className="text-sm text-slate-500">No payment record for this policy yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.map((payment) => (
                                    <tr key={payment.paymentId} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-700">
                                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900">${payment.amountPaid.toLocaleString('en-US')}</td>
                                        <td className="px-4 py-3 text-slate-600">{payment.paymentMethod || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">
                                                {payment.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPolicyDetail;
