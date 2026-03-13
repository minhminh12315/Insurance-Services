import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { claimApi, policyApi, type ClaimModel, type PolicyOverviewModel } from '../../services/insuranceApi';

const statusColors: Record<string, string> = {
    Submitted: 'bg-blue-100 text-blue-700',
    UnderReview: 'bg-amber-100 text-amber-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Paid: 'bg-violet-100 text-violet-700',
};

const formatStatusLabel = (status: string): string => {
    if (status === 'UnderReview') return 'Under Review';
    return status;
};

const MyClaims = () => {
    const [claims, setClaims] = useState<ClaimModel[]>([]);
    const [policies, setPolicies] = useState<PolicyOverviewModel[]>([]);
    const [selectedPolicyId, setSelectedPolicyId] = useState<number>(0);
    const [claimAmount, setClaimAmount] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const loadData = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const [myClaims, myPolicies] = await Promise.all([
                claimApi.getMyClaims(),
                policyApi.getMyPolicies(true),
            ]);

            setClaims(myClaims);
            setPolicies(myPolicies);
            if (myPolicies.length > 0) {
                setSelectedPolicyId((previous) => (previous > 0 ? previous : myPolicies[0].policyId));
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to load claims data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const sortedClaims = useMemo(
        () => [...claims].sort((first, second) => second.claimId - first.claimId),
        [claims]
    );

    const handleSubmitClaim = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const parsedAmount = Number(claimAmount);
        if (!selectedPolicyId || Number.isNaN(parsedAmount) || parsedAmount <= 0 || !reason.trim()) {
            setErrorMessage('Please select a policy, enter a valid amount, and provide a reason.');
            return;
        }

        setSubmitting(true);
        try {
            const claim = await claimApi.createClaim({
                policyId: selectedPolicyId,
                claimAmount: parsedAmount,
                reason: reason.trim(),
            });

            if (documentFile) {
                await claimApi.uploadClaimDocument(claim.claimId, documentFile);
            }

            setClaimAmount('');
            setReason('');
            setDocumentFile(null);
            setSuccessMessage('Claim submitted successfully.');

            await loadData();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit claim.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-slate-500">Loading claims...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">📝 My Claims</h1>
                <Link to="/user/policies" className="text-sm font-semibold text-[#015fc9] hover:underline">
                    Back to My Policies
                </Link>
            </div>

            {errorMessage ? (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{errorMessage}</div>
            ) : null}

            {successMessage ? (
                <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>
            ) : null}

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Submit a New Claim</h2>

                {policies.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        You do not have any active policy to submit a claim. Please buy a policy first.
                    </p>
                ) : (
                    <form onSubmit={handleSubmitClaim} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="claim-policy">
                                Policy
                            </label>
                            <select
                                id="claim-policy"
                                value={selectedPolicyId}
                                onChange={(event) => setSelectedPolicyId(Number(event.target.value))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                            >
                                {policies.map((policy) => (
                                    <option key={policy.policyId} value={policy.policyId}>
                                        {policy.policyNumber} / {policy.schemeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="claim-amount">
                                Claim Amount (USD)
                            </label>
                            <input
                                id="claim-amount"
                                type="number"
                                min="1"
                                step="0.01"
                                value={claimAmount}
                                onChange={(event) => setClaimAmount(event.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                                placeholder="e.g. 1500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="claim-reason">
                                Reason
                            </label>
                            <textarea
                                id="claim-reason"
                                rows={3}
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none"
                                placeholder="Describe your incident and claim reason"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="claim-document">
                                Supporting Document (Optional)
                            </label>
                            <input
                                id="claim-document"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                            />
                            <p className="mt-1 text-xs text-slate-400">Accepted: PDF, JPG, PNG, DOC, DOCX (max 10MB)</p>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#015fc9] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0051ab] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Claim'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {sortedClaims.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                    <p className="text-5xl mb-4">✅</p>
                    <p className="text-slate-500 text-lg font-medium">No claims filed yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {sortedClaims.map((claim) => {
                        const statusClass = statusColors[claim.status] || 'bg-slate-100 text-slate-600';
                        return (
                            <div key={claim.claimId} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Claim #{claim.claimId}</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                            Policy: <span className="text-slate-700 font-mono">{claim.policyNumber}</span>
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${statusClass}`}>
                                        {formatStatusLabel(claim.status)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 sm:gap-6 pt-6 border-t border-slate-100">
                                    <div>
                                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Claim Date</div>
                                        <div className="text-sm sm:text-base font-bold text-slate-900">{new Date(claim.claimDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</div>
                                        <div className="text-base sm:text-lg font-bold text-slate-900">${claim.claimAmount.toLocaleString()}</div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Reason</div>
                                        <div className="text-sm sm:text-base font-semibold text-slate-900">{claim.reason}</div>
                                        {claim.adminComment ? (
                                            <p className="text-xs text-slate-500 mt-2">Admin note: {claim.adminComment}</p>
                                        ) : null}
                                        {claim.documentUrl ? (
                                            <a
                                                href={claim.documentUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block text-xs text-[#015fc9] font-semibold mt-2 hover:underline"
                                            >
                                                View document
                                            </a>
                                        ) : null}
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
