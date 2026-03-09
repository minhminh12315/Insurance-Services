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

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-10">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 text-sm md:text-base font-medium">
                    Welcome back, Thanh! Here's what's happening today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {cards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2">
                                    {stat.label}
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</h2>
                                {stat.change !== undefined && (
                                    <p className={`text-[10px] md:text-xs font-bold mt-2 md:mt-3 flex items-center gap-1.5 ${stat.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% <span className="font-medium text-slate-400">vs last month</span>
                                    </p>
                                )}
                            </div>
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ml-4 shadow-sm"
                                style={{
                                    background: `${stat.color}15`,
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Chart Box */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900">
                            New Policies Issued
                        </h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg self-stretch sm:self-auto">
                            {['Week', 'Month', 'Year'].map(t => (
                                <button
                                    key={t}
                                    className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${t === 'Week' ? 'bg-white text-[#015fc9] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end justify-between h-[180px] sm:h-48 md:h-60 px-1 md:px-4">
                        {chartData.map((value, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 md:gap-4 flex-1">
                                <div
                                    className={`w-full max-w-[18px] sm:max-w-[24px] md:max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer ${index === 4 ? 'bg-gradient-to-t from-[#015fc9] to-[#3b82f6] shadow-lg shadow-blue-200' : 'bg-slate-100'
                                        }`}
                                    style={{ height: `${value * (window.innerWidth < 640 ? 1.4 : window.innerWidth < 768 ? 1.8 : 2.5)}px` }}
                                />
                                <span className="text-slate-400 text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase tracking-wider">{days[index]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Box */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 font-display">
                        System Notifications
                    </h3>
                    <div className="flex flex-col gap-4 flex-1">
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 shadow-sm">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 font-bold leading-snug line-clamp-2">{activity.msg}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">
                                        {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl transition-all border border-slate-100">
                        View All Notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
