import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { policyApi, type PolicyOverviewModel } from '../../services/insuranceApi';

const statusBadgeClass = (status?: string | null): string => {
    switch (status) {
        case 'Active':
            return 'bg-emerald-50 text-emerald-600';
        case 'Pending':
            return 'bg-amber-50 text-amber-600';
        case 'Cancelled':
            return 'bg-rose-50 text-rose-600';
        default:
            return 'bg-slate-100 text-slate-600';
    }
};

const calculateProgress = (policy: PolicyOverviewModel): number => {
    const start = new Date(policy.startDate);
    const end = new Date(policy.maturityDate);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || now <= start) {
        return 0;
    }

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

const MyPolicies = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<PolicyOverviewModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchPolicies = async () => {
            setLoading(true);
            setErrorMessage('');
            try {
                const data = await policyApi.getMyPolicies(false);
                setPolicies(data);
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Failed to load policies.');
            } finally {
                setLoading(false);
            }
        };

        void fetchPolicies();
    }, []);

    const sortedPolicies = useMemo(
        () => [...policies].sort((first, second) => second.policyId - first.policyId),
        [policies]
    );

    if (loading) {
        return <div className="p-6 text-slate-500">Loading policies...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">My Policies</h1>
                <button
                    onClick={() => navigate('/calculator')}
                    className="bg-[#015fc9] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0051ab] transition-colors shadow-sm"
                >
                    + Buy New Policy
                </button>
            </div>

            {errorMessage ? (
                <div className="mb-6 p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm">{errorMessage}</div>
            ) : null}

            {sortedPolicies.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-lg">You do not have any policies yet.</p>
                    <button onClick={() => navigate('/calculator')} className="mt-6 text-[#015fc9] font-semibold hover:underline">
                        Calculate and buy a policy
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sortedPolicies.map((policy) => {
                        const progress = calculateProgress(policy);

                        return (
                            <div
                                key={policy.policyId}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#015fc9] transition-colors">
                                                {policy.policyNumber} / {policy.schemeName}
                                            </h3>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusBadgeClass(policy.policyStatus)}`}
                                            >
                                                {policy.policyStatus || 'Unknown'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            Category: <span className="text-slate-700">{policy.categoryName}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sum Assured</div>
                                        <div className="text-xl font-bold text-slate-900">
                                            ${policy.sumAssured.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-sm font-semibold text-slate-700">
                                            Term: <span className="text-[#015fc9]">{policy.termYears} years</span>
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium">{Math.round(progress)}% completed</div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#015fc9] to-[#3b82f6] rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between items-center gap-4 pt-5 border-t border-slate-50">
                                    <div className="flex gap-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Premium</span>
                                            <span className="text-sm font-bold text-slate-700">
                                                ${policy.premiumAmount.toLocaleString('en-US')} / {policy.paymentFrequency}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Maturity Date</span>
                                            <span className="text-sm font-bold text-slate-700">{new Date(policy.maturityDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/user/policies/${policy.policyId}`)}
                                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyPolicies;
