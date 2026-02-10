import { useAuth } from '../../context/AuthContext';
import { fakePolicies, fakePayments, fakeClaims } from '../../data/fakeData';

const UserDashboard = () => {
    const { user } = useAuth();

    const myPolicies = fakePolicies.filter(p => p.user_id === user?.user_id);
    const myPayments = fakePayments.filter(p => p.user_id === user?.user_id);
    const myClaims = fakeClaims.filter(c => c.user_id === user?.user_id);

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
    };

    const statCardStyle = (gradient: string, shadowColor: string) => ({
        ...cardStyle,
        background: `linear-gradient(135deg, ${gradient})`,
        color: 'white',
        boxShadow: `0 4px 14px ${shadowColor}`,
    });

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    Welcome back, {user?.full_name}! 👋
                </h1>
                <p style={{ color: '#64748b', fontSize: '15px' }}>
                    Here's an overview of your insurance portfolio.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={statCardStyle('#3b82f6, #2563eb', 'rgba(59,130,246,0.3)')}>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Active Policies</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>{myPolicies.length}</div>
                </div>
                <div style={statCardStyle('#10b981, #059669', 'rgba(16,185,129,0.3)')}>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Payments</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>{myPayments.length}</div>
                </div>
                <div style={statCardStyle('#f59e0b, #d97706', 'rgba(245,158,11,0.3)')}>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Claims Filed</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>{myClaims.length}</div>
                </div>
                <div style={statCardStyle('#8b5cf6, #7c3aed', 'rgba(139,92,246,0.3)')}>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Coverage</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>
                        ${myPolicies.reduce((sum, p) => sum + p.sum_assured, 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>
                    Recent Policies
                </h2>
                {myPolicies.length === 0 ? (
                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
                        You don't have any policies yet. Browse our services to get started!
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                {['Policy #', 'Start Date', 'Premium', 'Sum Assured', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {myPolicies.map(policy => (
                                <tr key={policy.policy_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{policy.policy_number}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>{policy.start_date}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>${policy.premium_amount}/mo</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>${policy.sum_assured.toLocaleString()}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                            background: policy.policy_status === 'Active' ? '#dcfce7' : '#fef3c7',
                                            color: policy.policy_status === 'Active' ? '#16a34a' : '#d97706',
                                        }}>
                                            {policy.policy_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
