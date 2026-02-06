import { useState, useEffect } from 'react';
import { fakePolicies, fakeClaims, fakeUsers, fakePayments } from '../data/fakeData';
import '../assets/styles/layout.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPolicies: 0,
        totalRevenue: 0,
        activeClaims: 0,
        activeUsers: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const chartData = [65, 45, 80, 55, 90, 70, 85];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        const timer = setTimeout(() => {
            const totalRevenue = fakePayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
            const activeClaims = fakeClaims.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;

            setStats({
                totalPolicies: fakePolicies.length,
                totalRevenue,
                activeClaims,
                activeUsers: fakeUsers.length
            });

            const activity: any[] = [];

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
            change: 12.5,
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
            change: 8.2,
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
            change: -5.4,
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

    if (loading) return <div className="loading-container">Loading dashboard...</div>;

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, Thanh! Here's what's happening with your insurance portfolio today.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {cards.map((stat, index) => (
                    <div key={index} className="glass-card stat-card stat-card-content">
                        <div className="stat-card-header">
                            <div className="stat-card-info">
                                <p>{stat.label}</p>
                                <h2>{stat.value}</h2>
                                {stat.change !== undefined && (
                                    <p className={`stat-card-change ${stat.change > 0 ? 'positive' : 'negative'}`}>
                                        {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% <span>vs last month</span>
                                    </p>
                                )}
                            </div>
                            <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts and Activity Row */}
            <div className="two-column-grid">
                {/* Chart */}
                <div className="glass-card chart-container">
                    <div className="chart-header">
                        <h3>New Policies Issued</h3>
                        <div className="chart-tabs">
                            {['Week', 'Month', 'Year'].map(t => (
                                <button key={t} className={`chart-tab ${t === 'Week' ? 'active' : ''}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="chart-bars">
                        {chartData.map((value, index) => (
                            <div key={index} className="chart-bar-wrapper">
                                <div
                                    className={`chart-bar-fill ${index === 4 ? 'active' : 'inactive'}`}
                                    style={{ height: `${value * 2.5}px` }}
                                />
                                <span className="chart-bar-label">{days[index]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card activity-container">
                    <h3>System Notifications</h3>
                    <div className="activity-list">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-content">
                                    <p className="activity-message">{activity.msg}</p>
                                    <p className="activity-time">{new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString()}</p>
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
