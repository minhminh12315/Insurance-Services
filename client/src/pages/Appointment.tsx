import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const Appointment = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        serviceType: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Appointment request submitted successfully!');
        setFormData({ name: '', email: '', mobile: '', serviceType: '', message: '' });
    };



    return (
        <div>
            {/* Page Header */}
            <PageHeader title="Appointment" currentPage="Appointment" />

            {/* Appointment Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[60px] items-start">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-[25px] leading-[1.3]">
                            We're Award Winning Insurance Company
                        </h2>
                        <p className="text-[#666] leading-[1.8] mb-10 text-base">
                            Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo
                            justo magna dolore erat amet. Tempor erat elitr rebum at clita. Diam dolor diam ipsum
                            sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita
                            duo justo magna.
                        </p>

                        {/* Call Us Box */}
                        <div className="flex items-center gap-5 p-[20px_25px] bg-[#f8f9fa] rounded-[15px] border border-[#e8edf2]">
                            <div className="w-[55px] h-[55px] bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] rounded-full flex items-center justify-center shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-[#0a1628]">
                                    Call Us: +012 345 6789
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="bg-[#f8f9fa] rounded-[20px] p-10 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-[15px] mb-[15px]">
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-[14px_18px] border border-[#dee2e6] rounded-lg text-[15px] text-[#333] outline-none transition-colors duration-300 bg-white focus:border-[#015fc9]"
                                    required
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-[14px_18px] border border-[#dee2e6] rounded-lg text-[15px] text-[#333] outline-none transition-colors duration-300 bg-white focus:border-[#015fc9]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-[15px] mb-[15px]">
                                <input
                                    name="mobile"
                                    type="tel"
                                    placeholder="Your Mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full p-[14px_18px] border border-[#dee2e6] rounded-lg text-[15px] text-[#333] outline-none transition-colors duration-300 bg-white focus:border-[#015fc9]"
                                    required
                                />
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className={`w-full p-[14px_18px] border border-[#dee2e6] rounded-lg text-[15px] outline-none transition-colors duration-300 bg-white cursor-pointer focus:border-[#015fc9] ${formData.serviceType ? 'text-[#333]' : 'text-[#999]'}`}
                                    required
                                >
                                    <option value="" disabled>Service Type</option>
                                    <option value="life">Life Insurance</option>
                                    <option value="health">Health Insurance</option>
                                    <option value="motor">Motor Insurance</option>
                                    <option value="home">Home Insurance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="mb-5">
                                <textarea
                                    name="message"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-[14px_18px] border border-[#dee2e6] rounded-lg text-[15px] text-[#333] outline-none transition-colors duration-300 bg-white resize-y font-inherit focus:border-[#015fc9]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white px-10 py-4 rounded-[50px] border-none text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(1,95,201,0.4)] hover:shadow-[0_6px_20px_rgba(1,95,201,0.5)] hover:-translate-y-0.5"
                            >
                                Get Appointment
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Appointment;
