import { Link } from 'react-router-dom';

const Contact = () => {
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
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>Contact Us</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                            Home
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>Contact Us</span>
                    </nav>
                </div>
            </section>

            {/* Contact Form & Map Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                        gap: '50px',
                        alignItems: 'start',
                    }}
                >
                    {/* Contact Form */}
                    <div>
                        <h2
                            style={{
                                fontSize: '36px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '20px',
                                lineHeight: 1.3,
                            }}
                        >
                            If You Have Any Query, Please Contact Us
                        </h2>
                        <p
                            style={{
                                color: '#666',
                                lineHeight: 1.8,
                                marginBottom: '35px',
                                fontSize: '15px',
                            }}
                        >
                            We're here to help! Fill out the form below and our team will get back to you as soon as possible.
                        </p>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    style={{
                                        padding: '18px 20px',
                                        borderRadius: '10px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s ease',
                                        background: '#f8f9fa',
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = '#015fc9')}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    style={{
                                        padding: '18px 20px',
                                        borderRadius: '10px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.3s ease',
                                        background: '#f8f9fa',
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = '#015fc9')}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Subject"
                                style={{
                                    padding: '18px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    background: '#f8f9fa',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#015fc9')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
                            />
                            <textarea
                                placeholder="Message"
                                rows={6}
                                style={{
                                    padding: '18px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '15px',
                                    outline: 'none',
                                    resize: 'vertical',
                                    transition: 'border-color 0.3s ease',
                                    background: '#f8f9fa',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = '#015fc9')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
                            />
                            <button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    color: '#ffffff',
                                    padding: '18px 40px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    alignSelf: 'flex-start',
                                    boxShadow: '0 4px 15px rgba(1, 95, 201, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(1, 95, 201, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(1, 95, 201, 0.3)';
                                }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Map */}
                    <div
                        style={{
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            height: '100%',
                            minHeight: '500px',
                        }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4694550044886!2d106.69811331533417!3d10.776889092322571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5b4e0d9!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '500px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Map"
                        />
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section style={{ padding: '0 0 100px', background: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {/* Address Card */}
                        <div
                            style={{
                                background: '#f8f9fa',
                                padding: '35px 30px',
                                borderRadius: '20px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" fill="#015fc9" />
                                </svg>
                            </div>
                            <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '10px' }}>
                                Address
                            </h4>
                            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6 }}>
                                123 Street, District 1<br />
                                Ho Chi Minh City, Vietnam
                            </p>
                        </div>

                        {/* Phone Card */}
                        <div
                            style={{
                                background: '#f8f9fa',
                                padding: '35px 30px',
                                borderRadius: '20px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '10px' }}>
                                Call Us
                            </h4>
                            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6 }}>
                                +84 123 456 789<br />
                                +84 987 654 321
                            </p>
                        </div>

                        {/* Email Card */}
                        <div
                            style={{
                                background: '#f8f9fa',
                                padding: '35px 30px',
                                borderRadius: '20px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" stroke="#015fc9" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '10px' }}>
                                Email Us
                            </h4>
                            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6 }}>
                                info@inslife.com<br />
                                support@inslife.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
