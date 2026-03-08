import { useAuth } from '../../context/AuthContext';
import { fakePolicies, fakePayments, fakeClaims } from '../../data/fakeData';

const UserDashboard = () => {
    const { user } = useAuth();

    const myPolicies = fakePolicies.filter(p => p.user_id === user?.user_id);
    const myPayments = fakePayments.filter(p => p.user_id === user?.user_id);
    const myClaims = fakeClaims.filter(c => c.user_id === user?.user_id);

    return (
        <div className="p-0 sm:p-4 lg:p-8">
            <div className="mb-6 lg:mb-8 px-4 sm:px-0">
                <h1 className="text-2xl lg:text-[28px] font-bold text-slate-800 mb-1">
                    Welcome back, {user?.full_name}! 👋
                </h1>
                <p className="text-slate-500 text-sm lg:text-[15px]">
                    Here's an overview of your insurance portfolio.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8 px-4 sm:px-0">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 lg:p-7 rounded-2xl shadow-lg shadow-blue-500/10 text-white">
                    <div className="text-xs lg:text-sm opacity-90 mb-1 lg:mb-2">Active Policies</div>
                    <div className="text-2xl lg:text-[32px] font-bold">{myPolicies.length}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 lg:p-7 rounded-2xl shadow-lg shadow-emerald-500/10 text-white">
                    <div className="text-xs lg:text-sm opacity-90 mb-1 lg:mb-2">Total Payments</div>
                    <div className="text-2xl lg:text-[32px] font-bold">{myPayments.length}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 lg:p-7 rounded-2xl shadow-lg shadow-amber-500/10 text-white">
                    <div className="text-xs lg:text-sm opacity-90 mb-1 lg:mb-2">Claims Filed</div>
                    <div className="text-2xl lg:text-[32px] font-bold">{myClaims.length}</div>
                </div>
                <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-5 lg:p-7 rounded-2xl shadow-lg shadow-violet-500/10 text-white">
                    <div className="text-xs lg:text-sm opacity-90 mb-1 lg:mb-2">Total Coverage</div>
                    <div className="text-2xl lg:text-[32px] font-bold">
                        ${myPolicies.reduce((sum, p) => sum + p.sum_assured, 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-5 lg:p-7 shadow-sm border border-slate-200 mx-4 sm:mx-0">
                <h2 className="text-base lg:text-lg font-semibold text-slate-800 mb-5">
                    Recent Policies
                </h2>
                {myPolicies.length === 0 ? (
                    <p className="text-slate-400 text-center py-10">
                        You don't have any policies yet. Browse our services to get started!
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    {['Policy #', 'Start Date', 'Premium', 'Sum Assured', 'Status'].map(h => (
                                        <th key={h} className="p-4 text-left text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {myPolicies.map(policy => (
                                    <tr key={policy.policy_id} className="border-b border-slate-50 last:border-0">
                                        <td className="p-4 text-sm font-semibold text-slate-800">{policy.policy_number}</td>
                                        <td className="p-4 text-sm text-slate-500">{policy.start_date}</td>
                                        <td className="p-4 text-sm text-slate-800">${policy.premium_amount}/mo</td>
                                        <td className="p-4 text-sm text-slate-800">${policy.sum_assured.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${policy.policy_status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {policy.policy_status}
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

export default UserDashboard;
