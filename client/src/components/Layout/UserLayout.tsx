import { Outlet, NavLink } from 'react-router-dom';
import PublicHeader from './PublicHeader';

const UserLayout = () => {
    const navItems = [
        { to: '/user/policies', label: 'My Policies', icon: '📝', end: false },
        { to: '/user/profile', label: 'My Profile', icon: '👤', end: true },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 pt-20">
            {/* Shared Public Header */}
            <PublicHeader />

            {/* User Navigation Bar */}


            {/* Main Content */}
            <main className="flex-1 p-8 w-full max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* Simple Footer */}
            <footer className="text-center py-5 px-8 text-slate-400 text-xs border-t border-slate-200">
                © 2024 Insurance Services. All rights reserved.
            </footer>
        </div>
    );
};

export default UserLayout;

