import { Link } from 'react-router-dom';

const PublicFooter = () => {
    const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Our Services', path: '/services' },
        { name: 'Terms & Condition', path: '/terms' },
        { name: 'Support', path: '/support' },
    ];

    const services = [
        { name: 'Life Insurance', path: '/services/life' },
        { name: 'Health Insurance', path: '/services/health' },
        { name: 'Home Insurance', path: '/services/home' },
        { name: 'Vehicle Insurance', path: '/services/vehicle' },
        { name: 'Business Insurance', path: '/services/business' },
    ];

    return (
        <footer
            style={{
                background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)',
                color: '#ffffff',
                paddingTop: '80px',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                }}
            >
                {/* Main Footer Content */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px',
                        paddingBottom: '60px',
                    }}
                >
                    {/* Company Info */}
                    <div>
                        <Link
                            to="/home"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                gap: '10px',
                                marginBottom: '25px',
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
                            <span style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>
                                INSLIFE
                            </span>
                        </Link>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.8',
                                marginBottom: '25px',
                                fontSize: '14px',
                            }}
                        >
                            Protecting your future with comprehensive insurance solutions. We provide reliable coverage for all your insurance needs.
                        </p>
                        {/* Social Icons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href={`https://${social}.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#015fc9';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        {social === 'facebook' && (
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        )}
                                        {social === 'twitter' && (
                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                        )}
                                        {social === 'instagram' && (
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
                                        )}
                                        {social === 'linkedin' && (
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                        )}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h4
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                marginBottom: '25px',
                                position: 'relative',
                                paddingBottom: '15px',
                            }}
                        >
                            Address
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '50px',
                                    height: '3px',
                                    background: '#015fc9',
                                    borderRadius: '2px',
                                }}
                            />
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(1, 95, 201, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#015fc9">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" fill="white" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                                        123 Street, District 1<br />
                                        Ho Chi Minh City, Vietnam
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(1, 95, 201, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#015fc9">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                                    +84 123 456 789
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(1, 95, 201, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#015fc9">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" fill="none" />
                                    </svg>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                                    info@inslife.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                marginBottom: '25px',
                                position: 'relative',
                                paddingBottom: '15px',
                            }}
                        >
                            Quick Links
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '50px',
                                    height: '3px',
                                    background: '#015fc9',
                                    borderRadius: '2px',
                                }}
                            />
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {quickLinks.map((link) => (
                                <li key={link.path} style={{ marginBottom: '12px' }}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#015fc9';
                                            e.currentTarget.style.paddingLeft = '10px';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.paddingLeft = '0';
                                        }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                marginBottom: '25px',
                                position: 'relative',
                                paddingBottom: '15px',
                            }}
                        >
                            Our Services
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '50px',
                                    height: '3px',
                                    background: '#015fc9',
                                    borderRadius: '2px',
                                }}
                            />
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {services.map((service) => (
                                <li key={service.path} style={{ marginBottom: '12px' }}>
                                    <Link
                                        to={service.path}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#015fc9';
                                            e.currentTarget.style.paddingLeft = '10px';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.paddingLeft = '0';
                                        }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        padding: '40px 0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <div>
                        <h4 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                            Subscribe to Our Newsletter
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                            Get the latest updates and offers directly in your inbox
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            style={{
                                padding: '15px 20px',
                                borderRadius: '50px',
                                border: 'none',
                                background: 'rgba(255,255,255,0.1)',
                                color: '#ffffff',
                                fontSize: '14px',
                                minWidth: '280px',
                                outline: 'none',
                            }}
                        />
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                color: '#ffffff',
                                padding: '15px 30px',
                                borderRadius: '50px',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(1, 95, 201, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    style={{
                        padding: '25px 0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                        © 2024 <span style={{ color: '#015fc9' }}>INSLIFE</span>. All Rights Reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link
                            to="/privacy"
                            style={{
                                color: 'rgba(255,255,255,0.6)',
                                textDecoration: 'none',
                                fontSize: '14px',
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            style={{
                                color: 'rgba(255,255,255,0.6)',
                                textDecoration: 'none',
                                fontSize: '14px',
                            }}
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
