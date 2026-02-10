import { useAuth } from '../../context/AuthContext';
import { fakePolicies, insuranceSchemes } from '../../data/fakeData';

const MyPolicies = () => {
    const { user } = useAuth();
    const myPolicies = fakePolicies.filter(p => p.user_id === user?.user_id);

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
                📋 My Policies
            </h1>

            {myPolicies.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>You don't have any policies yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myPolicies.map(policy => {
                        const scheme = insuranceSchemes.find(s => s.scheme_id === policy.scheme_id);
                        return (
                            <div key={policy.policy_id} style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                                            {policy.policy_number}
                                        </h3>
                                        <p style={{ color: '#64748b', fontSize: '14px' }}>{scheme?.scheme_name || 'Unknown Scheme'}</p>
                                    </div>
                                    <span style={{
                                        padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                                        background: policy.policy_status === 'Active' ? '#dcfce7' : '#fef3c7',
                                        color: policy.policy_status === 'Active' ? '#16a34a' : '#d97706',
                                    }}>
                                        {policy.policy_status}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start Date</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{policy.start_date}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Maturity Date</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{policy.maturity_date}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Premium</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>${policy.premium_amount}/{policy.payment_frequency.toLowerCase()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sum Assured</div>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>${policy.sum_assured.toLocaleString()}</div>
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
