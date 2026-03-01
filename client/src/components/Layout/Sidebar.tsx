import { NavLink, useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../context/AuthContext';


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside
            className="w-[260px] h-screen fixed left-0 top-0 bg-white border-r border-[#e2e8f0] py-6 flex flex-col z-[1000]"
        >
            {/* Logo */}
            <div className="mb-8 px-6">
                <h1 className="text-[22px] font-extrabold text-[#015fc9] flex items-center gap-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    InsureAdmin
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3">
                <div className="mb-6">
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase px-3 pb-3 tracking-wider">Overview</p>
                    <ul className="list-none flex flex-col gap-1">
                        <li>
                            <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                Dashboard
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase px-3 pb-3 tracking-wider">Management</p>
                    <ul className="list-none flex flex-col gap-1">
                        <li>
                            <NavLink to="/admin/users" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/categories" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                Categories
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/schemes" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                Schemes
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/policies" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                Policies
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase px-3 pb-3 tracking-wider">Financials</p>
                    <ul className="list-none flex flex-col gap-1">
                        <li>
                            <NavLink to="/admin/payments" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                Payments
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/claims" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" /></svg>
                                Claims
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/loans" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                Policy Loans
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase px-3 pb-3 tracking-wider">Communications</p>
                    <ul className="list-none flex flex-col gap-1">
                        <li>
                            <NavLink to="/admin/news" className={({ isActive }) => `flex items-center gap-3 px-3 py-[10px] no-underline text-[#475569] text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg ${isActive ? '!text-[#015fc9] bg-blue-50' : ''}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                Announcements
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-5 px-4 border-t border-[#e2e8f0]">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#015fc9] to-[#007bff] flex items-center justify-center text-white font-semibold text-[13px]">
                        {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[13px] text-[#1e293b] truncate">{user?.full_name || 'Admin User'}</p>
                        <p className="text-[#64748b] text-[11px] truncate">{user?.email || ''}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full p-2 mt-3 rounded-lg border border-[#e2e8f0] bg-transparent text-[#64748b] cursor-pointer text-[13px] font-medium transition-all hover:bg-slate-50 hover:text-[#015fc9]"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
