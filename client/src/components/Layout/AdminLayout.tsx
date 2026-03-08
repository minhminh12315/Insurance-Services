import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../Header';
import { useState } from 'react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-secondary)] relative">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-[260px]`}>
                <Header onToggleSidebar={toggleSidebar} />
                <main className="p-4 md:p-8 min-h-[calc(100vh-70px)] max-w-[1600px] w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

