import PageHeader from '../components/PageHeader';

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
        <div>
            {/* Page Header */}
            <PageHeader title="Our Team" currentPage="Our Team" />

            {/* Team Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-[60px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5 leading-[1.3]">
                            Meet Our Professional<br />Team Members
                        </h2>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[30px]">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[15px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Social overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.6))] p-[30px_15px_15px] flex justify-center gap-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        {['twitter', 'facebook', 'youtube', 'linkedin'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                className="w-9 h-9 bg-[#015fc9] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#007bff]"
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
                                <div className="p-5 text-center">
                                    <h4 className="text-lg font-semibold text-[#0a1628] mb-[5px]">
                                        {member.name}
                                    </h4>
                                    <p className="text-[#666] text-sm">{member.role}</p>
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
