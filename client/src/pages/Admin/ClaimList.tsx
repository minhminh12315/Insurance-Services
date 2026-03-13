import { useEffect, useMemo, useState } from 'react';
import { claimApi, type ClaimModel, type UpdateClaimStatusPayload } from '../../services/insuranceApi';
import DeleteConfirm from '../../components/DeleteConfirm';

const ClaimList = () => {
    const [claims, setClaims] = useState<ClaimModel[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState<string>('');

    const normalizeFilterStatus = (status: string): string => {
        if (status === 'Under Review') return 'UnderReview';
        return status;
    };

    const formatStatusLabel = (status: string): string => {
        if (status === 'UnderReview') return 'Under Review';
        return status;
    };

    const fetchClaims = async (status?: string) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const result = await claimApi.getAllClaims(status);
            setClaims(result);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to load claims.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchClaims(statusFilter ? normalizeFilterStatus(statusFilter) : undefined);
    }, [statusFilter]);

    const sortedClaims = useMemo(
        () => [...claims].sort((first, second) => second.claimId - first.claimId),
        [claims]
    );

    const confirmStatus = async (id: number, status: UpdateClaimStatusPayload['status']) => {
        try {
            await claimApi.updateClaimStatus(id, { status });
            setSuccessMessage(`Claim marked as ${formatStatusLabel(status)}`);
            setTimeout(() => setSuccessMessage(''), 3000);
            await fetchClaims(statusFilter ? normalizeFilterStatus(statusFilter) : undefined);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to update claim status.');
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
        switch (status) {
            case 'Approved': return <span className={`${baseClass} bg-emerald-100 text-emerald-600`}>Approved</span>;
            case 'UnderReview': return <span className={`${baseClass} bg-amber-100 text-amber-600`}>Reviewing</span>;
            case 'Rejected': return <span className={`${baseClass} bg-red-100 text-red-600`}>Rejected</span>;
            case 'Submitted': return <span className={`${baseClass} bg-blue-100 text-blue-600`}>Submitted</span>;
            case 'Paid': return <span className={`${baseClass} bg-violet-100 text-violet-600`}>Paid</span>;
            default: return <span className={`${baseClass} bg-slate-100 text-slate-600`}>{status}</span>;
        }
    };

    if (loading) {
        return <div className="p-5 text-center">Loading claims...</div>;
    }

    return (
        <div className="relative">
            {/* Global Notification Banner */}
            <div className="fixed top-24 right-6 z-[110] flex flex-col gap-3 min-w-[320px] max-w-md pointer-events-none">
                {successMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-xl shadow-emerald-500/10 flex items-center gap-3 text-emerald-600 animate-in slide-in-from-right duration-500 pointer-events-auto">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold">{successMessage}</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] md:text-[28px] font-extrabold text-slate-800 mb-2">Claims Management</h1>
                    <p className="text-slate-500 text-[14px] md:text-[15px]">Process and review insurance claims submitted by customers</p>
                </div>
            </div>

            {errorMessage ? (
                <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{errorMessage}</div>
            ) : null}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-5 mb-6">
                <select className="w-full sm:w-[200px] px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Paid">Paid</option>
                </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Claim ID</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Policy</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Customer</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Amount</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Reason</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Date</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Status</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedClaims.map((c) => (
                            <tr key={c.claimId}>
                                <td className="p-4 border-b border-slate-50"><span className="font-semibold text-slate-600">#CLM-{c.claimId.toString().padStart(4, '0')}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="font-bold text-blue-600">{c.policyNumber}</span></td>
                                <td className="p-4 border-b border-slate-50">{c.userName}</td>
                                <td className="p-4 border-b border-slate-50 font-bold text-slate-800">${c.claimAmount.toLocaleString()}</td>
                                <td className="p-4 border-b border-slate-50 text-[13px] max-w-[200px] truncate">{c.reason}</td>
                                <td className="p-4 border-b border-slate-50">{new Date(c.claimDate).toLocaleDateString()}</td>
                                <td className="p-4 border-b border-slate-50">{getStatusBadge(c.status)}</td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        {c.status === 'Submitted' && (
                                            <DeleteConfirm onConfirm={() => void confirmStatus(c.claimId, 'UnderReview')} title="Review Claim?" message="Mark this claim as under review?" confirmLabel="Sure">
                                                <button className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">Review</button>
                                            </DeleteConfirm>
                                        )}
                                        {(c.status === 'Submitted' || c.status === 'UnderReview') && (
                                            <>
                                                <DeleteConfirm onConfirm={() => void confirmStatus(c.claimId, 'Approved')} title="Approve Claim?" message="Are you sure you want to approve this claim?" confirmLabel="Approve">
                                                    <button className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium">Approve</button>
                                                </DeleteConfirm>
                                                <DeleteConfirm onConfirm={() => void confirmStatus(c.claimId, 'Rejected')} title="Reject Claim?" message="Are you sure you want to reject this claim?" confirmLabel="Reject">
                                                    <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">Reject</button>
                                                </DeleteConfirm>
                                            </>
                                        )}
                                        {c.status === 'Approved' ? (
                                            <DeleteConfirm onConfirm={() => void confirmStatus(c.claimId, 'Paid')} title="Mark as Paid?" message="Confirm this approved claim has been paid?" confirmLabel="Mark Paid">
                                                <button className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium">Mark Paid</button>
                                            </DeleteConfirm>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && sortedClaims.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">No claims found for this filter.</div>
                ) : null}
            </div>
        </div>
    );
};

export default ClaimList;
