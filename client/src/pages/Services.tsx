import { Link } from 'react-router-dom';

const Services = () => {
    const services = [
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            ),
            title: 'Life Insurance',
            description: 'Protect your loved ones with comprehensive life insurance coverage that ensures financial security for your family\'s future.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            ),
            title: 'Health Insurance',
            description: 'Access quality healthcare with our flexible health insurance plans tailored to meet your medical needs and budget.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            ),
            title: 'Home Insurance',
            description: 'Safeguard your home and belongings with our reliable home insurance solutions protecting against all risks.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <circle cx="8.5" cy="13.5" r="2.5" />
                    <circle cx="18.5" cy="13.5" r="2.5" />
                    <path d="M16 8h4l3 5v4h-7" />
                </svg>
            ),
            title: 'Vehicle Insurance',
            description: 'Drive with confidence knowing your vehicle is fully protected against accidents, theft, and all types of damages.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
            ),
            title: 'Business Insurance',
            description: 'Secure your business operations with comprehensive commercial insurance coverage for complete peace of mind.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <rect x="9" y="7" width="6" height="6" rx="1" />
                </svg>
            ),
            title: 'Property Insurance',
            description: 'Protect your valuable property investments with our comprehensive property insurance plans and coverage options.',
        },
    ];

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Page Header / Hero Banner */}
            <section
                style={{
                    background: 'linear-gradient(rgba(0, 31, 63, 0.85), rgba(0, 31, 63, 0.85)), url(https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1920&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '180px 0 100px',
                    color: '#ffffff',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>Services</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                            Home
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>Services</span>
                    </nav>
                </div>
            </section>

            {/* Services Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '20px',
                            }}
                        >
                            We Provide Professional Insurance Services
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            Explore our wide range of insurance products designed to protect you and your loved ones
                            with comprehensive coverage options.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {services.map((service, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    padding: '40px 35px',
                                    borderRadius: '20px',
                                    boxShadow: '0 5px 30px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid #eee',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(1, 95, 201, 0.15)';
                                    e.currentTarget.style.borderColor = '#015fc9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 5px 30px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = '#eee';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '25px' }}>
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, rgba(1, 95, 201, 0.1) 0%, rgba(0, 123, 255, 0.1) 100%)',
                                            borderRadius: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h4
                                            style={{
                                                fontSize: '22px',
                                                fontWeight: 600,
                                                color: '#0a1628',
                                                marginBottom: '15px',
                                            }}
                                        >
                                            {service.title}
                                        </h4>
                                        <p
                                            style={{
                                                color: '#666',
                                                fontSize: '15px',
                                                lineHeight: 1.7,
                                                marginBottom: '20px',
                                            }}
                                        >
                                            {service.description}
                                        </p>
                                        <Link
                                            to={`/services/${service.title.toLowerCase().replace(' ', '-')}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#015fc9',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                padding: '10px 25px',
                                                border: '2px solid #015fc9',
                                                borderRadius: '50px',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#015fc9';
                                                e.currentTarget.style.color = '#ffffff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#015fc9';
                                            }}
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
