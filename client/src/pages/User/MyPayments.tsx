import { useAuth } from '../../context/AuthContext';
import { fakePayments, fakePolicies } from '../../data/fakeData';

const MyPayments = () => {
    const { user } = useAuth();
    const myPayments = fakePayments.filter(p => p.user_id === user?.user_id);

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0',
    };

    const statusColors: Record<string, { bg: string; text: string }> = {
        'Success': { bg: '#dcfce7', text: '#16a34a' },
        'Failed': { bg: '#fee2e2', text: '#dc2626' },
        'Pending': { bg: '#fef3c7', text: '#d97706' },
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
                💳 My Payments
            </h1>

            {myPayments.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>💸</p>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>No payment history found.</p>
                </div>
            ) : (
                <div style={cardStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                {['Policy', 'Date', 'Amount', 'Method', 'Reference', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {myPayments.map(payment => {
                                const policy = fakePolicies.find(p => p.policy_id === payment.policy_id);
                                const colors = statusColors[payment.status] || { bg: '#f1f5f9', text: '#475569' };
                                return (
                                    <tr key={payment.payment_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{policy?.policy_number || 'N/A'}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>{payment.payment_date}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>${payment.amount_paid}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>{payment.payment_method || 'N/A'}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace' }}>{payment.transaction_reference || '—'}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                                background: colors.bg, color: colors.text,
                                            }}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyPayments;
