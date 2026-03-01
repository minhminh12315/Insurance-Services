import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fakePolicies, insuranceSchemes } from '../../data/fakeData';

const MyPolicies = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const myPolicies = fakePolicies.filter(p => p.user_id === user?.user_id);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    📋 My Policies
                </h1>
                <button
                    onClick={() => navigate('/services')}
                    className="bg-[#015fc9] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0051ab] transition-colors shadow-sm"
                >
                    + Buy New Policy
                </button>
            </div>

            {myPolicies.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm">
                    <p className="text-5xl mb-4">📭</p>
                    <p className="text-slate-500 text-lg">You don't have any policies yet.</p>
                    <button
                        onClick={() => navigate('/services')}
                        className="mt-6 text-[#015fc9] font-semibold hover:underline"
                    >
                        Browse insurance plans
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {myPolicies.map(policy => {
                        const scheme = insuranceSchemes.find(s => s.scheme_id === policy.scheme_id);

                        // Calculate Protection Year
                        const startDate = new Date(policy.start_date);
                        const today = new Date();
                        const yearsDiff = today.getFullYear() - startDate.getFullYear();
                        const currentYear = Math.max(1, Math.min(yearsDiff + 1, policy.term_years));
                        const progress = (currentYear / policy.term_years) * 100;

                        // Mock Overdue Logic (For demo purposes as requested)
                        const isOverdue = policy.policy_id === 1; // Let's make the first one overdue
                        const overdueDays = 5;
                        const overdueAmount = policy.premium_amount;

                        return (
                            <div
                                key={policy.policy_id}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 group"
                            >
                                {/* Header Section */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#015fc9] transition-colors">
                                                {policy.policy_number} / {scheme?.scheme_name || 'Unknown Scheme'}
                                            </h3>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${policy.policy_status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {policy.policy_status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            Insured: <span className="text-slate-700">{policy.insured_name || user?.full_name}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Benefit Amount</div>
                                        <div className="text-xl font-bold text-slate-900">${policy.sum_assured.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-sm font-semibold text-slate-700">
                                            Protection Year: <span className="text-[#015fc9]">Year {currentYear}</span> / {policy.term_years}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium">
                                            {Math.round(progress)}% of term completed
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#015fc9] to-[#3b82f6] rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Details & Actions Footer */}
                                <div className="flex flex-wrap justify-between items-center gap-4 pt-5 border-t border-slate-50">
                                    <div className="flex gap-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Premium</span>
                                            <span className="text-sm font-bold text-slate-700">
                                                ${policy.premium_amount} <span className="text-[10px] text-slate-400 font-normal">/{policy.payment_frequency}</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Maturity Date</span>
                                            <span className="text-sm font-bold text-slate-700">{policy.maturity_date}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Payment Status</span>
                                            {isOverdue ? (
                                                <span className="text-sm font-bold text-red-500 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                    Overdue: ${overdueAmount} (Late {overdueDays} days)
                                                </span>
                                            ) : (
                                                <span className="text-sm font-bold text-emerald-500">Up to date</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => navigate(`/user/policies/${policy.policy_id}`)}
                                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
                                        >
                                            View Details
                                        </button>
                                        {isOverdue && (
                                            <button
                                                className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-sm shadow-red-200"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
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
