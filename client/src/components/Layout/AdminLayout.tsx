import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PublicHeader from './PublicHeader';
import { useState } from 'react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);



    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-secondary)]">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 ml-[260px]">
                <PublicHeader />
                <main className="p-8 min-h-[calc(100vh-70px)] max-w-[1600px] mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

