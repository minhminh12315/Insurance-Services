import { useAuth } from '../../context/AuthContext';
import { fakeClaims, fakePolicies } from '../../data/fakeData';

const MyClaims = () => {
    const { user } = useAuth();
    const myClaims = fakeClaims.filter(c => c.user_id === user?.user_id);

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
    };

    const statusColors: Record<string, { bg: string; text: string }> = {
        'Submitted': { bg: '#e0f2fe', text: '#0284c7' },
        'Under Review': { bg: '#fef3c7', text: '#d97706' },
        'Approved': { bg: '#dcfce7', text: '#16a34a' },
        'Rejected': { bg: '#fee2e2', text: '#dc2626' },
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
                📝 My Claims
            </h1>

            {myClaims.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>✅</p>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>No claims filed yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myClaims.map(claim => {
                        const policy = fakePolicies.find(p => p.policy_id === claim.policy_id);
                        const colors = statusColors[claim.status] || { bg: '#f1f5f9', text: '#475569' };
                        return (
                            <div key={claim.claim_id} style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                                            Claim #{claim.claim_id}
                                        </h3>
                                        <p style={{ color: '#64748b', fontSize: '14px' }}>Policy: {policy?.policy_number || 'N/A'}</p>
                                    </div>
                                    <span style={{
                                        padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                                        background: colors.bg, color: colors.text,
                                    }}>
                                        {claim.status}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Claim Date</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{claim.claim_date}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>${claim.claim_amount.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{claim.reason}</div>
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
