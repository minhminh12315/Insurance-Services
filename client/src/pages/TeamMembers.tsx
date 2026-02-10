import { Link } from 'react-router-dom';

const TeamMembers = () => {
    const team = [
        { name: 'John Smith', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
        { name: 'Sarah Johnson', role: 'Insurance Advisor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
        { name: 'Michael Brown', role: 'Claims Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
        { name: 'Emily Davis', role: 'Customer Support', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
        { name: 'David Wilson', role: 'Financial Analyst', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
        { name: 'Lisa Anderson', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
        { name: 'Jessica Taylor', role: 'Policy Specialist', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
        { name: 'Robert Martinez', role: 'Risk Assessor', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
    ];

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Hero Banner */}
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
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>Team Members</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>Team Members</span>
                    </nav>
                </div>
            </section>

            {/* Team Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#0a1628', marginBottom: '20px', lineHeight: 1.3 }}>
                            Meet Our Professional<br />Team Members
                        </h2>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '30px',
                        }}
                    >
                        {team.map((member, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
                                    const overlay = e.currentTarget.querySelector('.social-overlay') as HTMLElement;
                                    if (overlay) overlay.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                                    const overlay = e.currentTarget.querySelector('.social-overlay') as HTMLElement;
                                    if (overlay) overlay.style.opacity = '0';
                                }}
                            >
                                <div style={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '280px',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                    {/* Social overlay */}
                                    <div
                                        className="social-overlay"
                                        style={{
                                            position: 'absolute',
                                            bottom: '0',
                                            left: '0',
                                            right: '0',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                            padding: '30px 15px 15px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        }}
                                    >
                                        {['twitter', 'facebook', 'youtube', 'linkedin'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    background: '#015fc9',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#007bff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#015fc9'; }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                    {social === 'twitter' && (
                                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                                    )}
                                                    {social === 'facebook' && (
                                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                    )}
                                                    {social === 'youtube' && (
                                                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
                                                    )}
                                                    {social === 'linkedin' && (
                                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                                    )}
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#0a1628', marginBottom: '5px' }}>
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

export default TeamMembers;
