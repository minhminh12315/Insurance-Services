import PageHeader from '../components/PageHeader';

const Contact = () => {
    return (
        <div>
            {/* Page Header */}
            <PageHeader title="Contact Us" currentPage="Contact Us" />

            {/* Contact Form & Map Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-[50px] items-start">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-[36px] font-bold text-[#0a1628] mb-5 leading-[1.3]">
                            If You Have Any Query, Please Contact Us
                        </h2>
                        <p className="text-[#666] leading-[1.8] mb-[35px] text-[15px]">
                            We're here to help! Fill out the form below and our team will get back to you as soon as possible.
                        </p>

                        <form className="flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-5">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="p-[18px_20px] rounded-[10px] border border-[#e0e0e0] text-[15px] outline-none transition-colors duration-300 bg-[#f8f9fa] focus:border-[#015fc9]"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="p-[18px_20px] rounded-[10px] border border-[#e0e0e0] text-[15px] outline-none transition-colors duration-300 bg-[#f8f9fa] focus:border-[#015fc9]"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Subject"
                                className="p-[18px_20px] rounded-[10px] border border-[#e0e0e0] text-[15px] outline-none transition-colors duration-300 bg-[#f8f9fa] focus:border-[#015fc9]"
                            />
                            <textarea
                                placeholder="Message"
                                rows={6}
                                className="p-[18px_20px] rounded-[10px] border border-[#e0e0e0] text-[15px] outline-none transition-colors duration-300 bg-[#f8f9fa] resize-y focus:border-[#015fc9]"
                            />
                            <button
                                type="submit"
                                className="bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white px-10 py-[18px] rounded-[50px] border-none font-semibold text-base cursor-pointer transition-all duration-300 self-start shadow-[0_4px_15px_rgba(1,95,201,0.3)] hover:shadow-[0_8px_25px_rgba(1,95,201,0.4)] hover:-translate-y-[3px]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Map */}
                    <div className="rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] h-full min-h-[500px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4694550044886!2d106.69811331533417!3d10.776889092322571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5b4e0d9!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            className="border-0 min-h-[500px]"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Map"
                        />
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="pb-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[30px]">
                        {/* Address Card */}
                        <div className="bg-[#f8f9fa] p-[35px_30px] rounded-[20px] text-center transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                            <div className="w-[70px] h-[70px] bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" fill="#015fc9" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-[#0a1628] mb-2.5">
                                Address
                            </h4>
                            <p className="text-[#666] text-[15px] leading-[1.6]">
                                123 Street, District 1<br />
                                Ho Chi Minh City, Vietnam
                            </p>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-[#f8f9fa] p-[35px_30px] rounded-[20px] text-center transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                            <div className="w-[70px] h-[70px] bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-[#0a1628] mb-2.5">
                                Call Us
                            </h4>
                            <p className="text-[#666] text-[15px] leading-[1.6]">
                                +84 123 456 789<br />
                                +84 987 654 321
                            </p>
                        </div>

                        {/* Email Card */}
                        <div className="bg-[#f8f9fa] p-[35px_30px] rounded-[20px] text-center transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                            <div className="w-[70px] h-[70px] bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" stroke="#015fc9" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-[#0a1628] mb-2.5">
                                Email Us
                            </h4>
                            <p className="text-[#666] text-[15px] leading-[1.6]">
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
