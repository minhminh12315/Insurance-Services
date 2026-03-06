import { useState } from 'react';
import { fakeClaims, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { Claim, ClaimStatus, Policy, User } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';

const ClaimList = () => {
    const [claims, setClaims] = useState<Claim[]>(fakeClaims);
    const [policies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading] = useState(false);

    // Deletion and Status States
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'status', id: number, status?: ClaimStatus } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [claimsRes, policiesRes, usersRes] = await Promise.all([
    //                 api.get('/claims'),
    //                 api.get('/policies'),
    //                 api.get('/users')
    //             ]);
    //             setClaims(claimsRes.data);
    //             setPolicies(policiesRes.data);
    //             setUsers(usersRes.data);
    //         } catch (error) {
    //             console.error('Failed to fetch data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const filteredClaims = claims.filter(c => !statusFilter || c.status === statusFilter);

    const handleDeleteClick = (id: number) => {
        setConfirmAction({ type: 'delete', id });
        setShowConfirmModal(true);
    };

    const handleStatusClick = (id: number, newStatus: ClaimStatus) => {
        setConfirmAction({ type: 'status', id, status: newStatus });
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction.type === 'delete') {
            setClaims(claims.filter(c => c.claim_id !== confirmAction.id));
            setSuccessMessage('Claim removed successfully');
        } else if (confirmAction.type === 'status' && confirmAction.status) {
            setClaims(claims.map(c => c.claim_id === confirmAction.id ? { ...c, status: confirmAction.status! } : c));
            setSuccessMessage(`Claim marked as ${confirmAction.status}`);
        }

        setTimeout(() => setSuccessMessage(''), 3000);
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    const getStatusBadge = (status: ClaimStatus) => {
        const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
        switch (status) {
            case 'Approved': return <span className={`${baseClass} bg-emerald-100 text-emerald-600`}>Approved</span>;
            case 'Under Review': return <span className={`${baseClass} bg-amber-100 text-amber-600`}>Reviewing</span>;
            case 'Rejected': return <span className={`${baseClass} bg-red-100 text-red-600`}>Rejected</span>;
            case 'Submitted': return <span className={`${baseClass} bg-blue-100 text-blue-600`}>Submitted</span>;
            default: return <span className={`${baseClass} bg-slate-100 text-slate-600`}>{status}</span>;
        }
    };

    const getUserName = (id: number) => users.find(u => u.user_id === id)?.full_name || 'Unknown';
    const getPolicyNum = (id: number) => policies.find(p => p.policy_id === id)?.policy_number || 'Unknown';

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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Claims Management</h1>
                    <p className="text-slate-500 text-[15px]">Process and review insurance claims submitted by customers</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">
                <select className="w-[200px] px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
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
                        {filteredClaims.map((c) => (
                            <tr key={c.claim_id}>
                                <td className="p-4 border-b border-slate-50"><span className="font-semibold text-slate-600">#CLM-{c.claim_id.toString().padStart(4, '0')}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="font-bold text-blue-600">{getPolicyNum(c.policy_id)}</span></td>
                                <td className="p-4 border-b border-slate-50">{getUserName(c.user_id)}</td>
                                <td className="p-4 border-b border-slate-50 font-bold text-slate-800">${c.claim_amount.toLocaleString()}</td>
                                <td className="p-4 border-b border-slate-50 text-[13px] max-w-[200px] truncate">{c.reason}</td>
                                <td className="p-4 border-b border-slate-50">{new Date(c.claim_date).toLocaleDateString()}</td>
                                <td className="p-4 border-b border-slate-50">{getStatusBadge(c.status)}</td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        {c.status === 'Submitted' && (
                                            <button className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium" onClick={() => handleStatusClick(c.claim_id, 'Under Review')}>Review</button>
                                        )}
                                        {(c.status === 'Submitted' || c.status === 'Under Review') && (
                                            <>
                                                <button className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium" onClick={() => handleStatusClick(c.claim_id, 'Approved')}>Approve</button>
                                                <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium" onClick={() => handleStatusClick(c.claim_id, 'Rejected')}>Reject</button>
                                            </>
                                        )}
                                        <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleDeleteClick(c.claim_id)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={showConfirmModal}
                title={confirmAction?.type === 'delete' ? "Remove Claim" : "Update Status"}
                message={confirmAction?.type === 'delete'
                    ? "Are you sure you want to remove this claim? This will permanentely hide it from the dashboard."
                    : `Are you sure you want to mark this claim as ${confirmAction?.status}?`}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
                confirmLabel={confirmAction?.type === 'delete' ? "Remove" : "Yes, Update"}
                isDanger={confirmAction?.type === 'delete' || confirmAction?.status === 'Rejected'}
            />
        </div>
    );
};

export default ClaimList;
