import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, type InsuranceCategoryModel } from '../services/insuranceApi';
import { PageHeader } from '../components/Header';
import lifeIcon from '../assets/life_insurance.png';
import healthIcon from '../assets/health_insurance.png';
import homeIcon from '../assets/home_insurance.png';
import vehicleIcon from '../assets/vehicle_insurance.png';

const Services = () => {
    // Fallback data in case API fails or database is not seeded
    const fallbackCategories: InsuranceCategoryModel[] = [
        {
            categoryId: 1,
            categoryName: 'Life Insurance',
            description: 'Financial protection for your family with flexible life insurance plans and high benefits.',
        },
        {
            categoryId: 2,
            categoryName: 'Health Insurance',
            description: 'Covers medical, surgical, and hospital expenses with a wide network of hospitals.',
        },
        {
            categoryId: 3,
            categoryName: 'Motor Insurance',
            description: 'Protects your vehicle against all risks of accident, theft, and damage.',
        },
        {
            categoryId: 4,
            categoryName: 'Home Insurance',
            description: 'Protects your home and assets against natural disasters, fire, and other risks.',
        },
    ];

    const [categories, setCategories] = useState<InsuranceCategoryModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Map category names to icons
    const getCategoryIcon = (categoryName: string) => {
        const name = categoryName.toLowerCase();
        if (name.includes('life') || name.includes('nhân thọ')) return lifeIcon;
        if (name.includes('health') || name.includes('y tế') || name.includes('sức khỏe')) return healthIcon;
        if (name.includes('home') || name.includes('nhà') || name.includes('căn hộ')) return homeIcon;
        if (name.includes('vehicle') || name.includes('motor') || name.includes('xe') || name.includes('ô tô')) return vehicleIcon;
        return lifeIcon; // default
    };

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAllCategories();
                // If API returns data, use it; otherwise use fallback
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    console.log('No categories from API, using fallback data');
                    setCategories(fallbackCategories);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                // Use fallback data when API fails
                setCategories(fallbackCategories);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Remove hardcoded services - now using dynamic categories
    // const services = [...];

    return (
        <div>
            {/* Page Header */}
            <PageHeader title="Services" currentPage="Services" />

            {/* Services Section */}
            <section className="py-16 md:py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-10 md:mb-[60px]">
                        <h2 className="text-[32px] sm:text-[42px] font-bold text-[#0a1628] mb-4 sm:mb-5 leading-tight">
                            We Provide Professional Insurance Services
                        </h2>
                        <p className="text-[#666] max-w-[700px] mx-auto leading-[1.8] text-sm sm:text-base">
                            Explore our wide range of insurance products designed to protect you and your loved ones
                            with comprehensive coverage options.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#015fc9] border-t-transparent"></div>
                            <p className="mt-4 text-[#666]">Loading insurance services...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[#666]">No insurance services available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-[30px]">
                            {categories.map((category) => (
                                <div
                                    key={category.categoryId}
                                    className="bg-white p-6 sm:p-10 rounded-[20px] shadow-[0_5px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-[#eee] hover:md:-translate-y-[10px] hover:shadow-[0_20px_60px_rgba(1,95,201,0.15)] hover:border-[#015fc9]"
                                >
                                    <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-[25px]">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#015fc9] rounded-[15px] flex items-center justify-center shrink-0">
                                            <img
                                                src={getCategoryIcon(category.categoryName)}
                                                alt={category.categoryName}
                                                className="w-8 h-8 sm:w-9 sm:h-9 object-contain brightness-0 invert"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xl sm:text-[22px] font-semibold text-[#0a1628] mb-3 sm:mb-[15px]">
                                                {category.categoryName}
                                            </h4>
                                            <p className="text-[#666] text-sm sm:text-[15px] leading-[1.7] mb-5">
                                                {category.description || 'Comprehensive coverage for your protection needs with flexible plans tailored to your requirements.'}
                                            </p>
                                            <Link
                                                to={`/calculator?categoryId=${category.categoryId}`}
                                                className="inline-flex items-center gap-2 text-[#015fc9] no-underline font-semibold text-xs sm:text-sm px-5 sm:px-[25px] py-2.5 sm:py-[10px] border-2 border-[#015fc9] rounded-[50px] transition-all duration-300 hover:bg-[#015fc9] hover:text-white"
                                            >
                                                Read More & Get Quote
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Services;
