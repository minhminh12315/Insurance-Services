import { Link } from 'react-router-dom';

const Features = () => {
    const features = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M9 15l2 2 4-4" />
                </svg>
            ),
            title: 'Easy Process',
            description: 'Simple and streamlined insurance application process. Get covered in minutes, not days.',
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            ),
            title: 'Fast Delivery',
            description: 'Quick policy issuance and claims settlement. We value your time and ensure rapid service.',
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                </svg>
            ),
            title: 'Policy Controlling',
            description: 'Full control over your insurance policies. Manage, modify, and monitor all your plans in one place.',
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            title: 'Money Saving',
            description: 'Competitive premiums and maximum benefits. Save money while getting comprehensive coverage.',
        },
    ];

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Page Header / Hero Banner */}
            <section
                style={{
                    background: 'linear-gradient(rgba(0, 31, 63, 0.85), rgba(0, 31, 63, 0.85)), url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '180px 0 100px',
                    color: '#ffffff',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>Features</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                            Home
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>Features</span>
                    </nav>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '60px',
                        alignItems: 'center',
                    }}
                >
                    {/* Left Content */}
                    <div>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '25px',
                                lineHeight: 1.3,
                            }}
                        >
                            Few Reasons Why People Choosing Us!
                        </h2>
                        <p
                            style={{
                                color: '#666',
                                lineHeight: 1.8,
                                marginBottom: '40px',
                                fontSize: '16px',
                            }}
                        >
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et
                            eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore
                            erat amet
                        </p>

                        {/* Feature Cards Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: '#ffffff',
                                        border: '2px solid #e8edf2',
                                        borderRadius: '15px',
                                        padding: '30px 20px',
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#015fc9';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(1, 95, 201, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e8edf2';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            margin: '0 auto 15px',
                                            background: 'rgba(1, 95, 201, 0.08)',
                                            borderRadius: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#0a1628' }}>
                                        {feature.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=700&fit=crop"
                            alt="Insurance professional"
                            style={{
                                width: '100%',
                                height: '650px',
                                objectFit: 'cover',
                                borderRadius: '20px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us Detail Section */}
            <section style={{ padding: '100px 0', background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#0a1628', marginBottom: '20px' }}>
                            What Makes Us Different
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            We combine technology with personal touch to deliver an insurance experience that's truly exceptional.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '20px',
                                    padding: '40px 30px',
                                    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    borderTop: '4px solid transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderTopColor = '#015fc9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderTopColor = 'transparent';
                                }}
                            >
                                <div
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                        background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                        borderRadius: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '25px',
                                        boxShadow: '0 8px 25px rgba(1, 95, 201, 0.3)',
                                    }}
                                >
                                    <div style={{ color: 'white' }}>
                                        {/* Re-render icon in white */}
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                            {index === 0 && (
                                                <>
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <path d="M9 15l2 2 4-4" />
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <rect x="1" y="3" width="15" height="13" rx="2" />
                                                    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                    <path d="M9 12l2 2 4-4" />
                                                </>
                                            )}
                                            {index === 3 && (
                                                <>
                                                    <line x1="12" y1="1" x2="12" y2="23" />
                                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                                </>
                                            )}
                                        </svg>
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#0a1628', marginBottom: '15px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#666', lineHeight: 1.8, fontSize: '15px' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                style={{
                    background: 'linear-gradient(135deg, #015fc9 0%, #0047ab 100%)',
                    padding: '80px 0',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        textAlign: 'center',
                        color: '#ffffff',
                    }}
                >
                    <h2 style={{ fontSize: '38px', fontWeight: 700, marginBottom: '20px' }}>
                        Ready to Get Started?
                    </h2>
                    <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '35px', maxWidth: '600px', margin: '0 auto 35px' }}>
                        Experience the difference with our premium insurance services. Get a free quote today.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link
                            to="/contact"
                            style={{
                                display: 'inline-block',
                                background: '#ffffff',
                                color: '#015fc9',
                                padding: '16px 40px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Get A Quote
                        </Link>
                        <Link
                            to="/services"
                            style={{
                                display: 'inline-block',
                                background: 'transparent',
                                color: '#ffffff',
                                padding: '16px 40px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Our Services
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
