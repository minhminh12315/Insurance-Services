import { Link } from 'react-router-dom';

const About = () => {
    const stats = [
        { number: '1234', label: 'Happy Clients', color: '#015fc9' },
        { number: '1234', label: 'Projects Succeed', color: '#ff6b6b' },
        { number: '1234', label: 'Awards Achieved', color: '#015fc9' },
        { number: '1234', label: 'Team Members', color: '#ff6b6b' },
    ];

    const team = [
        { name: 'John Smith', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
        { name: 'Sarah Johnson', role: 'Insurance Advisor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
        { name: 'Michael Brown', role: 'Claims Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
        { name: 'Emily Davis', role: 'Customer Support', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
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
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>About Us</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                            Home
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>About</span>
                    </nav>
                </div>
            </section>

            {/* About Section with 25 Years Experience */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '60px',
                        alignItems: 'center',
                    }}
                >
                    {/* Left side with image and badge */}
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&h=500&fit=crop"
                            alt="Happy family"
                            style={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'cover',
                                borderRadius: '20px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            }}
                        />
                        {/* 25 Years Badge */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '30px',
                                left: '-30px',
                                background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                color: '#ffffff',
                                padding: '30px 25px',
                                borderRadius: '15px',
                                textAlign: 'center',
                                boxShadow: '0 10px 40px rgba(1, 95, 201, 0.4)',
                            }}
                        >
                            <div style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>25</div>
                            <div style={{ fontSize: '18px', fontWeight: 500, marginTop: '5px' }}>Years</div>
                            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '5px' }}>Experience</div>
                        </div>
                    </div>

                    {/* Right side content */}
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
                            We're Here To Assist You With Exploring Protection
                        </h2>
                        <p
                            style={{
                                color: '#666',
                                lineHeight: 1.8,
                                marginBottom: '35px',
                                fontSize: '16px',
                            }}
                        >
                            With over 25 years of experience in the insurance industry, we provide comprehensive coverage solutions
                            tailored to meet your unique needs. Our expert team is dedicated to protecting what matters most to you.
                        </p>

                        {/* Feature boxes */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#015fc9',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '24px',
                                    }}
                                >
                                    ✓
                                </div>
                                <span style={{ fontWeight: 600, color: '#0a1628' }}>Flexible Insurance Plans</span>
                            </div>
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#015fc9',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                    }}
                                >
                                    💰
                                </div>
                                <span style={{ fontWeight: 600, color: '#0a1628' }}>Money Back Guarantee</span>
                            </div>
                        </div>

                        <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '25px', fontSize: '15px' }}>
                            We understand the importance of securing your future. Our dedicated team works tirelessly to provide
                            you with the best insurance solutions that offer peace of mind and financial security.
                        </p>

                        {/* Call to action */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px 25px',
                                background: 'linear-gradient(135deg, rgba(1, 95, 201, 0.1) 0%, rgba(0, 123, 255, 0.1) 100%)',
                                borderRadius: '15px',
                                borderLeft: '4px solid #015fc9',
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#015fc9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Call Us Anytime</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#015fc9' }}>+84 123 456 789</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section with Blue Background */}
            <section
                style={{
                    background: 'linear-gradient(135deg, #015fc9 0%, #0047ab 100%)',
                    padding: '100px 0',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '40px',
                            alignItems: 'center',
                        }}
                    >
                        {/* Left content */}
                        <div style={{ color: '#ffffff' }}>
                            <h2
                                style={{
                                    fontSize: '42px',
                                    fontWeight: 700,
                                    marginBottom: '25px',
                                    lineHeight: 1.3,
                                }}
                            >
                                For Individuals And Organisations
                            </h2>
                            <p style={{ opacity: 0.9, lineHeight: 1.8, marginBottom: '30px' }}>
                                We provide tailored insurance solutions for both individuals and businesses.
                                Our comprehensive coverage options ensure complete protection for all your needs.
                            </p>
                            <Link
                                to="/services"
                                style={{
                                    display: 'inline-block',
                                    background: '#ffffff',
                                    color: '#015fc9',
                                    padding: '16px 35px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                More Details
                            </Link>
                        </div>

                        {/* Stats grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '20px',
                            }}
                        >
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: '#ffffff',
                                        padding: '35px 25px',
                                        borderRadius: '20px',
                                        textAlign: 'center',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    <div
                                        style={{
                                            fontSize: '48px',
                                            fontWeight: 700,
                                            color: stat.color,
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {stat.number}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
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
                            Meet Our Professional Team Members
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            Our dedicated team of professionals is here to guide you through every step of your insurance journey.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {team.map((member, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div style={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                    {/* Social overlay */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '15px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            gap: '10px',
                                        }}
                                    >
                                        {['facebook', 'twitter', 'linkedin'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: '#015fc9',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                                    {social === 'facebook' && (
                                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                    )}
                                                    {social === 'twitter' && (
                                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                                    )}
                                                    {social === 'linkedin' && (
                                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                                    )}
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ padding: '25px', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '8px' }}>
                                        {member.name}
                                    </h4>
                                    <p style={{ color: '#666', fontSize: '14px' }}>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
