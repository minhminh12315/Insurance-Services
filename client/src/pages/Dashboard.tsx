import { useState, useEffect } from 'react';
import { fakePolicies, fakeClaims, fakeUsers, fakePayments } from '../data/fakeData';
// import api from '../services/api';
// import type { Policy, Claim, User, PremiumPayment } from '../types';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPolicies: 0,
        totalRevenue: 0,
        activeClaims: 0,
        activeUsers: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Chart data (mocked for now as we need more historical data for a real chart)
    const chartData = [65, 45, 80, 55, 90, 70, 85];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            // Calculate Stats from Fake Data
            const totalRevenue = fakePayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
            const activeClaims = fakeClaims.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;

            setStats({
                totalPolicies: fakePolicies.length,
                totalRevenue,
                activeClaims,
                activeUsers: fakeUsers.length
            });

            // Generate Recent Activity
            const activity: any[] = [];

            // Add recent policies
            fakePolicies.slice(0, 3).forEach(p => {
                activity.push({
                    id: `pol-${p.policy_id}`,
                    type: 'policy',
                    msg: `New policy #${p.policy_number} issued`,
                    time: p.start_date || 'Recently',
                    icon: '📄',
                    date: new Date(p.start_date || Date.now())
                });
            });

            // Add recent claims
            fakeClaims.slice(0, 3).forEach(c => {
                activity.push({
                    id: `clm-${c.claim_id}`,
                    type: 'claim',
                    msg: `Claim #CLM-${c.claim_id} ${c.status}`,
                    time: c.claim_date || 'Recently',
                    icon: '✅',
                    date: new Date(c.claim_date || Date.now())
                });
            });

            // Sort and take top 5
            activity.sort((a, b) => b.date.getTime() - a.date.getTime());
            setRecentActivity(activity.slice(0, 5));
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const cards = [
        {
            label: 'Total Policies',
            value: stats.totalPolicies.toLocaleString(),
            change: 12.5, // Mock change
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            color: 'var(--accent-primary)',
        },
        {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: 8.2, // Mock change
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            color: '#10b981',
        },
        {
            label: 'Active Claims',
            value: stats.activeClaims.toString(),
            change: -5.4, // Mock change
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" />
                </svg>
            ),
            color: '#3b82f6',
        },
        {
            label: 'Active Users',
            value: stats.activeUsers.toLocaleString(),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            color: '#f59e0b',
        },
    ];

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: '#1e293b' }}>
                    Dashboard Overview
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    Welcome back, Thanh! Here's what's happening with your insurance portfolio today.
                </p>
            </div>

            {/* Stats Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px',
                }}
            >
                {cards.map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card stat-card"
                        style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                                    {stat.label}
                                </p>
                                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>{stat.value}</h2>
                                {stat.change !== undefined && (
                                    <p style={{ color: stat.change > 0 ? 'var(--success)' : 'var(--danger)', fontSize: '13px', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% <span style={{ fontWeight: 400, color: '#94a3b8' }}>vs last month</span>
                                    </p>
                                )}
                            </div>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: `${stat.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: stat.color,
                                }}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts and Activity Row */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr',
                    gap: '24px',
                    alignItems: 'start',
                }}
            >
                {/* Chart */}
                <div className="glass-card" style={{ padding: '24px', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                            New Policies Issued
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['Week', 'Month', 'Year'].map(t => (
                                <button key={t} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', background: t === 'Week' ? '#eff6ff' : 'transparent', color: t === 'Week' ? 'var(--accent-primary)' : '#64748b', cursor: 'pointer' }}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            height: '240px',
                            padding: '0 8px',
                        }}
                    >
                        {chartData.map((value, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <div
                                    className="chart-bar"
                                    style={{
                                        width: '60%',
                                        maxWidth: '40px',
                                        height: `${value * 2.5}px`,
                                        background: index === 4 ? 'var(--accent-gradient)' : '#e2e8f0',
                                        borderRadius: '6px 6px 0 0',
                                        transition: 'all 0.3s ease',
                                    }}
                                />
                                <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>{days[index]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card" style={{ padding: '24px', background: '#ffffff' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
                        System Notifications
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    borderBottom: '1px solid #f1f5f9',
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                    }}
                                >
                                    {activity.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '13.5px', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>{activity.msg}</p>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px', fontSize: '13px' }}>View All Notifications</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
