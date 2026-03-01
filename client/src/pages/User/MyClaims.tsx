import { useAuth } from '../../context/AuthContext';
import { fakeClaims, fakePolicies } from '../../data/fakeData';

const MyClaims = () => {
    const { user } = useAuth();
    const myClaims = fakeClaims.filter(c => c.user_id === user?.user_id);

    const statusColors: Record<string, string> = {
        'Submitted': 'bg-blue-100 text-blue-700',
        'Under Review': 'bg-amber-100 text-amber-700',
        'Approved': 'bg-emerald-100 text-emerald-700',
        'Rejected': 'bg-red-100 text-red-700',
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                📝 My Claims
            </h1>

            {myClaims.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-slate-200 shadow-sm">
                    <p className="text-5xl mb-4">✅</p>
                    <p className="text-slate-500 text-lg font-medium">No claims filed yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {myClaims.map(claim => {
                        const policy = fakePolicies.find(p => p.policy_id === claim.policy_id);
                        const statusClass = statusColors[claim.status] || 'bg-slate-100 text-slate-600';
                        return (
                            <div key={claim.claim_id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                                            Claim #{claim.claim_id}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium">Policy: <span className="text-slate-700 font-mono">{policy?.policy_number || 'N/A'}</span></p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusClass}`}>
                                        {claim.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                                    <div>
                                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Claim Date</div>
                                        <div className="font-bold text-slate-900">{claim.claim_date}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</div>
                                        <div className="font-bold text-slate-900 text-lg">${claim.claim_amount.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Reason</div>
                                        <div className="font-bold text-slate-900">{claim.reason}</div>
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

export default MyClaims;
