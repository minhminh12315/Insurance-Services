import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();



    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsPagesDropdownOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setIsPagesDropdownOpen(false);
        setIsProfileDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '';

    const navLinks = [
        { name: 'Home', path: '/home' },
        { name: 'About Us', path: '/about' },
        { name: 'Our Services', path: '/services' },
    ];

    const pagesDropdown = [
        { name: 'Features', path: '/features' },
        { name: 'Appointment', path: '/appointment' },
        { name: 'Team Members', path: '/team' },
        { name: 'Testimonial', path: '/testimonial' },
    ];

    const isActive = (path: string) => location.pathname === path;
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <header
            className="sticky top-0 left-0 right-0 z-[1000] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out"
        >
            <div className={`${isAdminPage ? 'max-w-[1600px]' : 'max-w-[1200px]'} mx-auto px-5 flex items-center justify-between h-20`}>
                {/* Logo */}
                <Link
                    to="/home"
                    className="flex items-center no-underline gap-2.5"
                >
                    <div className="w-[45px] h-[45px] bg-gradient-to-br from-[#015fc9] to-[#007bff] rounded-lg flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <span
                        className="text-[28px] font-bold text-[#015fc9]"
                    >
                        INSLIFE
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="flex items-center gap-9 desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`no-underline font-medium text-[15px] transition-colors duration-300 ease relative ${isActive(link.path)
                                ? 'text-[#015fc9]'
                                : 'text-[#333333] hover:text-[#015fc9]'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Pages Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                            className="bg-none border-none font-medium text-[15px] cursor-pointer flex items-center gap-1.5 text-[#333333] hover:text-[#015fc9]"
                        >
                            Pages
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        {isPagesDropdownOpen && (
                            <div className="absolute top-full left-0 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] min-w-[200px] py-2.5 mt-2.5">
                                {pagesDropdown.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="block px-5 py-2.5 text-[#333333] no-underline text-sm transition-colors duration-300 ease hover:bg-[#f5f5f5]"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/contact"
                        className="no-underline font-medium text-[15px] text-[#333333] hover:text-[#015fc9]"
                    >
                        Contact Us
                    </Link>
                </nav>

                {/* Profile / Login */}
                {user ? (
                    <div ref={profileDropdownRef} className="relative">
                        <div
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all duration-300 ease cursor-pointer ${isProfileDropdownOpen ? 'bg-slate-100' : 'bg-transparent'
                                }`}
                        >
                            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#015fc9] to-[#007bff] flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                                {initials || (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                            </div>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className={`transition-transform duration-300 text-slate-600 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                        {isProfileDropdownOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] min-w-[240px] p-1.5 z-[200]">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                                    <p className="text-sm font-semibold text-slate-900 leading-none">{user.full_name}</p>
                                    <p className="text-xs text-slate-500 mt-1.5">{user.email}</p>
                                </div>
                                {[
                                    // Admin Menu Items
                                    ...(user.role === 'Admin' || user.role === 'Employee' ? [
                                        {
                                            label: 'My Profile',
                                            icon: (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            ),
                                            onClick: () => navigate('/admin/profile'),
                                        },
                                        {
                                            label: 'My Policies',
                                            icon: (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <line x1="16" y1="13" x2="8" y2="13" />
                                                    <line x1="16" y1="17" x2="8" y2="17" />
                                                    <polyline points="10 9 9 9 8 9" />
                                                </svg>
                                            ),
                                            onClick: () => navigate('/user/policies'),
                                        },
                                        {
                                            label: 'Admin Dashboard',
                                            icon: (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="7" height="7" />
                                                    <rect x="14" y="3" width="7" height="7" />
                                                    <rect x="14" y="14" width="7" height="7" />
                                                    <rect x="3" y="14" width="7" height="7" />
                                                </svg>
                                            ),
                                            onClick: () => navigate('/admin'),
                                        }
                                    ] :
                                        // User/Customer Menu Items
                                        [
                                            {
                                                label: 'Profile Details',
                                                icon: (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                ),
                                                onClick: () => navigate('/user/profile'),
                                            },
                                            {
                                                label: 'My Policies',
                                                icon: (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                        <line x1="16" y1="13" x2="8" y2="13" />
                                                        <line x1="16" y1="17" x2="8" y2="17" />
                                                        <polyline points="10 9 9 9 8 9" />
                                                    </svg>
                                                ),
                                                onClick: () => navigate('/user/policies'),
                                            },
                                            {
                                                label: 'Calculator',
                                                icon: (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="4" y="2" width="16" height="20" rx="2" />
                                                        <line x1="8" y1="6" x2="16" y2="6" />
                                                        <line x1="8" y1="12" x2="10" y2="12" />
                                                        <line x1="14" y1="12" x2="16" y2="12" />
                                                        <line x1="8" y1="16" x2="10" y2="16" />
                                                        <line x1="14" y1="16" x2="16" y2="16" />
                                                    </svg>
                                                ),
                                                onClick: () => navigate('/calculator'),
                                            }
                                        ]),
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={item.onClick}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 border-none bg-transparent rounded-lg cursor-pointer text-slate-700 text-sm font-medium transition-colors duration-200 text-left hover:bg-slate-50"
                                    >
                                        <span className="text-slate-400">{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                                <div className="h-px bg-slate-100 my-1 mx-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 border-none bg-transparent rounded-lg cursor-pointer text-red-500 text-sm font-medium transition-colors duration-200 text-left hover:bg-red-50"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-gradient-to-br from-[#015fc9] to-[#007bff] text-white px-7 py-3 rounded-[50px] no-underline font-semibold text-sm transition-all duration-300 ease shadow-[0_4px_15px_rgba(1,95,201,0.4)] flex items-center gap-2 hover:-translate-y-0.5"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Login
                    </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="hidden mobile-menu-btn bg-none border-none cursor-pointer p-2.5 text-[#333333]"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-[80px] left-0 right-0 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] mobile-menu">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block py-4 text-[#333333] no-underline font-medium border-b border-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {pagesDropdown.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="block py-4 text-[#333333] no-underline font-medium border-b border-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        to="/contact"
                        className="block py-4 text-[#333333] no-underline font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Contact Us
                    </Link>
                </div>
            )}
        </header>
    );
};

export default PublicHeader;
