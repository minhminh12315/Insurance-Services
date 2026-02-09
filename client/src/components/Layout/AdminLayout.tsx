import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../assets/styles/AdminLayout.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="admin-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="mobile-overlay"
                />
            )}

            <div className="main-content">
                <Header onMenuClick={toggleSidebar} />
                <main className="main-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
