import { useState } from 'react';
import { Link } from 'react-router-dom';

const Testimonial = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            profession: 'Business Owner',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
            text: 'Dolores sed duo clita tempor justo dolor et stet lorem kasd labore dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore et tempor diam tempor erat.',
        },
        {
            name: 'Michael Brown',
            profession: 'Software Engineer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            text: 'Their insurance plans are comprehensive and affordable. The claims process was smooth and hassle-free. I highly recommend their services to anyone looking for reliable coverage.',
        },
        {
            name: 'Emily Davis',
            profession: 'Marketing Manager',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
            text: 'Exceptional customer service and great coverage options. They made the entire process effortless and were always available to answer my questions promptly.',
        },
        {
            name: 'David Wilson',
            profession: 'Financial Analyst',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
            text: 'I switched to this insurance company last year and it was the best decision. Their premiums are competitive and the benefits far exceed what I was getting before.',
        },
        {
            name: 'Lisa Anderson',
            profession: 'Teacher',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            text: 'The team went above and beyond to help me find the right policy. Their expertise and dedication to customer satisfaction is truly commendable.',
        },
        {
            name: 'Robert Martinez',
            profession: 'Entrepreneur',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
            text: 'Professional, reliable, and trustworthy. These are the words that come to mind when I think about this insurance company. Outstanding service all around.',
        },
    ];

    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

    // Positions for floating avatars around the center
    const floatingPositions = [
        { top: '15%', left: '18%' },
        { top: '5%', left: '50%', transform: 'translateX(-50%)' },
        { top: '15%', right: '18%' },
        { top: '55%', left: '5%' },
        { top: '70%', left: '20%' },
        { top: '55%', right: '5%' },
        { top: '70%', right: '20%' },
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
                    <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>Testimonial</h1>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                        <Link to="/home" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pages</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                        <span style={{ color: '#015fc9' }}>Testimonial</span>
                    </nav>
                </div>
            </section>

            {/* Testimonial Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#0a1628', lineHeight: 1.3 }}>
                            What They Say About<br />Our Insurance
                        </h2>
                    </div>

                    {/* Testimonial Carousel */}
                    <div style={{ position: 'relative', minHeight: '420px' }}>
                        {/* Floating avatars */}
                        {testimonials.map((t, i) => {
                            if (i === current) return null;
                            const posIndex = i > current ? i - 1 : i;
                            const pos = floatingPositions[posIndex % floatingPositions.length];
                            return (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        ...pos,
                                        transition: 'all 0.5s ease',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                    }}
                                    onClick={() => setCurrent(i)}
                                >
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid #e8edf2',
                                            opacity: 0.7,
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = '#015fc9'; }}
                                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = '#e8edf2'; }}
                                    />
                                </div>
                            );
                        })}

                        {/* Center testimonial */}
                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, paddingTop: '20px' }}>
                            <img
                                src={testimonials[current].image}
                                alt={testimonials[current].name}
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid #015fc9',
                                    margin: '0 auto 25px',
                                    display: 'block',
                                    boxShadow: '0 5px 20px rgba(1, 95, 201, 0.3)',
                                }}
                            />
                            <p
                                style={{
                                    color: '#666',
                                    lineHeight: 1.8,
                                    fontSize: '16px',
                                    maxWidth: '600px',
                                    margin: '0 auto 25px',
                                    fontStyle: 'italic',
                                }}
                            >
                                {testimonials[current].text}
                            </p>
                            <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '5px' }}>
                                {testimonials[current].name}
                            </h4>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
                                {testimonials[current].profession}
                            </p>

                            {/* Navigation Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={prev}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        fontSize: '18px',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={next}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        fontSize: '18px',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Testimonial;
