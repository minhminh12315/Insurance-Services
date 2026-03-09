import { Outlet } from 'react-router-dom';
import Header from '../Header';

const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
                <Outlet />
            </main>

            <footer className="text-center py-5 px-8 text-slate-400 text-xs border-t border-slate-200">
                © 2024 Insurance Services. All rights reserved.
            </footer>
        </div>
    );
};

export default UserLayout;
