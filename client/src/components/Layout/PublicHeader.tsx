import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: isScrolled ? '#ffffff' : 'transparent',
                boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s ease',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '80px',
                }}
            >
                {/* Logo */}
                <Link
                    to="/home"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        gap: '10px',
                    }}
                >
                    <div
                        style={{
                            width: '45px',
                            height: '45px',
                            background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <span
                        style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            color: isScrolled ? '#015fc9' : '#ffffff',
                        }}
                    >
                        INSLIFE
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '35px',
                    }}
                    className="desktop-nav"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive(link.path)
                                    ? '#015fc9'
                                    : isScrolled
                                        ? '#333333'
                                        : '#ffffff',
                                fontWeight: 500,
                                fontSize: '15px',
                                transition: 'color 0.3s ease',
                                position: 'relative',
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Pages Dropdown */}
                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setIsPagesDropdownOpen(true)}
                        onMouseLeave={() => setIsPagesDropdownOpen(false)}
                    >
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: isScrolled ? '#333333' : '#ffffff',
                                fontWeight: 500,
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}
                        >
                            Pages
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </button>
                        {isPagesDropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    background: '#ffffff',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    minWidth: '200px',
                                    padding: '10px 0',
                                    marginTop: '10px',
                                }}
                            >
                                {pagesDropdown.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        style={{
                                            display: 'block',
                                            padding: '10px 20px',
                                            color: '#333333',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            transition: 'background 0.3s ease',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = '#f5f5f5')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = 'transparent')
                                        }
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/contact"
                        style={{
                            textDecoration: 'none',
                            color: isScrolled ? '#333333' : '#ffffff',
                            fontWeight: 500,
                            fontSize: '15px',
                        }}
                    >
                        Contact Us
                    </Link>
                </nav>

                {/* Get A Quote Button */}
                <Link
                    to="/quote"
                    style={{
                        background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                        color: '#ffffff',
                        padding: '14px 30px',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 4px 15px rgba(1, 95, 201, 0.4)',
                    }}
                    className="quote-btn"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(1, 95, 201, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(1, 95, 201, 0.4)';
                    }}
                >
                    Get A Quote
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        color: isScrolled ? '#333333' : '#ffffff',
                        cursor: 'pointer',
                        padding: '10px',
                    }}
                    className="mobile-menu-btn"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '80px',
                        left: 0,
                        right: 0,
                        background: '#ffffff',
                        padding: '20px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                    className="mobile-menu"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                display: 'block',
                                padding: '15px 0',
                                color: '#333333',
                                textDecoration: 'none',
                                fontWeight: 500,
                                borderBottom: '1px solid #eee',
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {pagesDropdown.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'block',
                                padding: '15px 0',
                                color: '#333333',
                                textDecoration: 'none',
                                fontWeight: 500,
                                borderBottom: '1px solid #eee',
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        to="/contact"
                        style={{
                            display: 'block',
                            padding: '15px 0',
                            color: '#333333',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
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
