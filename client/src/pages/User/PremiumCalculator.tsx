import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    paymentApi,
    policyApi,
    schemeApi,
    vnPayApi,
    type InsuranceSchemeModel,
    type PremiumCalculationModel,
    type PremiumFrequency,
} from '../../services/insuranceApi';

const FALLBACK_MIN_SUM = 10000;
const FALLBACK_MAX_SUM = 2000000;
const FALLBACK_MIN_TERM = 5;
const FALLBACK_MAX_TERM = 30;

const frequencyOptions: Array<{ value: PremiumFrequency; label: string; savings: number }> = [
    { value: 'Monthly', label: 'Monthly', savings: 0 },
    { value: 'Quarterly', label: 'Quarterly', savings: 1 },
    { value: 'HalfYearly', label: 'Half-Yearly', savings: 3 },
    { value: 'Yearly', label: 'Yearly', savings: 5 },
];

interface Rider {
    id: number;
    name: string;
    description: string;
    price: number;
    icon: string;
}

const AVAILABLE_RIDERS: Rider[] = [
    {
        id: 1,
        name: 'Critical Illness Cover',
        description: 'Lump sum payment on diagnosis of major illnesses.',
        price: 45.0,
        icon: '🏥',
    },
    {
        id: 2,
        name: 'Accidental Death Benefit',
        description: 'Double coverage in case of accidental death.',
        price: 25.5,
        icon: '🛡️',
    },
    {
        id: 3,
        name: 'Waiver of Premium',
        description: 'Future premiums waived if you become disabled.',
        price: 15.0,
        icon: '⚖️',
    },
];

const installmentsPerYear: Record<PremiumFrequency, number> = {
    Monthly: 12,
    Quarterly: 4,
    HalfYearly: 2,
    Yearly: 1,
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const readAmount = (value?: number | null, fallback = 0): number => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return fallback;
    }
    return value;
};

const formatCurrency = (value: number): string => currencyFormatter.format(value);

const formatCompactCurrency = (value: number): string => compactCurrencyFormatter.format(value);

const parseCurrencyInput = (raw: string): number => {
    const sanitized = raw.replace(/[^\d]/g, '');
    if (!sanitized) {
        return 0;
    }
    return Number(sanitized);
};

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Something went wrong. Please try again.';

const isLifeCategory = (categoryName?: string | null): boolean => {
    if (!categoryName) return false;
    const normalized = categoryName.toLowerCase();
    return normalized.includes('life') || normalized.includes('nhân thọ') || normalized.includes('nhan tho');
};

const isMedicalCategory = (categoryName?: string | null): boolean => {
    if (!categoryName) return false;
    const normalized = categoryName.toLowerCase();
    return normalized.includes('medical') || normalized.includes('y tế') || normalized.includes('y te');
};

const isMotorCategory = (categoryName?: string | null): boolean => {
    if (!categoryName) return false;
    const normalized = categoryName.toLowerCase();
    return normalized.includes('motor') || normalized.includes('xe');
};

const isHomeCategory = (categoryName?: string | null): boolean => {
    if (!categoryName) return false;
    const normalized = categoryName.toLowerCase();
    return normalized.includes('home') || normalized.includes('nhà') || normalized.includes('nha');
};

const buildTermOptions = (scheme: InsuranceSchemeModel | undefined, selectedTerm: number): number[] => {
    const minTerm = Math.max(1, readAmount(scheme?.minTerm, FALLBACK_MIN_TERM));
    const maxTerm = Math.max(minTerm, readAmount(scheme?.maxTerm, FALLBACK_MAX_TERM));
    const options = [];
    for (let year = minTerm; year <= maxTerm; year += 1) {
        options.push(year);
    }
    if (!options.includes(selectedTerm)) {
        options.push(selectedTerm);
    }
    return [...new Set(options)].sort((a, b) => a - b);
};

const PremiumCalculator = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const categoryIdParam = searchParams.get('categoryId');
    const categoryIdFilter = categoryIdParam ? Number(categoryIdParam) : undefined;

    const [schemes, setSchemes] = useState<InsuranceSchemeModel[]>([]);
    const [selectedSchemeId, setSelectedSchemeId] = useState<number | null>(null);
    const [sumAssured, setSumAssured] = useState<number>(500000);
    const [termYears, setTermYears] = useState<number>(20);
    const [paymentFrequency, setPaymentFrequency] = useState<PremiumFrequency>('Yearly');
    const [calculation, setCalculation] = useState<PremiumCalculationModel | null>(null);
    const [isLoadingSchemes, setIsLoadingSchemes] = useState<boolean>(true);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [selectedRiderIds, setSelectedRiderIds] = useState<number[]>([]);

    const selectedScheme = useMemo(
        () => schemes.find((scheme) => scheme.schemeId === selectedSchemeId),
        [schemes, selectedSchemeId]
    );

    const minSumAssured = readAmount(selectedScheme?.minInvestmentAmount, FALLBACK_MIN_SUM);
    const maxSumAssured = Math.max(minSumAssured, readAmount(selectedScheme?.maxInvestmentAmount, FALLBACK_MAX_SUM));
    const minTerm = Math.max(1, readAmount(selectedScheme?.minTerm, FALLBACK_MIN_TERM));
    const maxTerm = Math.max(minTerm, readAmount(selectedScheme?.maxTerm, FALLBACK_MAX_TERM));

    const stepIndex = confirmationMessage ? 4 : isSubmitting ? 3 : 2;
    const termOptions = useMemo(() => buildTermOptions(selectedScheme, termYears), [selectedScheme, termYears]);

    const pricingBreakdown = useMemo(() => {
        const annualPremium = calculation?.annualPremium ?? 0;
        const riderCost = AVAILABLE_RIDERS.filter((r) => selectedRiderIds.includes(r.id)).reduce(
            (sum, r) => sum + r.price,
            0
        );

        const totalAnnualBase = annualPremium + riderCost;
        const taxAmount = totalAnnualBase * 0.18;
        const discountRate = frequencyOptions.find((option) => option.value === paymentFrequency)?.savings ?? 0;
        const discountAmount = ((totalAnnualBase + taxAmount) * discountRate) / 100;
        const totalPayable = totalAnnualBase + taxAmount - discountAmount;
        const installment = totalPayable / installmentsPerYear[paymentFrequency];

        return {
            annualPremium: totalAnnualBase,
            taxAmount,
            discountRate,
            discountAmount,
            totalPayable,
            installment,
            riderCost,
        };
    }, [calculation, paymentFrequency, selectedRiderIds]);

    useEffect(() => {
        const loadSchemes = async () => {
            setIsLoadingSchemes(true);
            setErrorMessage('');
            try {
                const availableSchemes = await schemeApi.getLifeSchemes(categoryIdFilter);
                setSchemes(availableSchemes);

                if (availableSchemes.length === 0) {
                    setErrorMessage('No active plan available for this category at the moment.');
                    return;
                }

                const defaultScheme = availableSchemes[0];
                setSelectedSchemeId(defaultScheme.schemeId);

                const schemeMinSum = readAmount(defaultScheme.minInvestmentAmount, FALLBACK_MIN_SUM);
                const schemeMaxSum = Math.max(schemeMinSum, readAmount(defaultScheme.maxInvestmentAmount, FALLBACK_MAX_SUM));
                const initialSum = clamp(500000, schemeMinSum, schemeMaxSum);
                setSumAssured(initialSum);

                const schemeMinTerm = Math.max(1, readAmount(defaultScheme.minTerm, FALLBACK_MIN_TERM));
                const schemeMaxTerm = Math.max(schemeMinTerm, readAmount(defaultScheme.maxTerm, FALLBACK_MAX_TERM));
                setTermYears(clamp(20, schemeMinTerm, schemeMaxTerm));
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setIsLoadingSchemes(false);
            }
        };

        void loadSchemes();
    }, [categoryIdFilter]);

    useEffect(() => {
        if (!selectedScheme) {
            return;
        }

        setSumAssured((currentValue) => clamp(currentValue, minSumAssured, maxSumAssured));
        setTermYears((currentValue) => clamp(currentValue, minTerm, maxTerm));
    }, [selectedScheme, minSumAssured, maxSumAssured, minTerm, maxTerm]);

    useEffect(() => {
        if (!selectedSchemeId) {
            return;
        }

        const timeoutId = window.setTimeout(async () => {
            setIsCalculating(true);
            setErrorMessage('');
            try {
                const result = await schemeApi.calculatePremium({
                    schemeId: selectedSchemeId,
                    sumAssured,
                    termYears,
                    paymentFrequency,
                });
                setCalculation(result);
            } catch (error) {
                setCalculation(null);
                setErrorMessage(getErrorMessage(error));
            } finally {
                setIsCalculating(false);
            }
        }, 250);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [selectedSchemeId, sumAssured, termYears, paymentFrequency]);

    const handleProceedToPayment = async () => {
        if (!selectedScheme || !user || !calculation) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setConfirmationMessage('');

        try {
            const categoryName = selectedScheme.categoryName ?? '';
            const policyPayload = {
                schemeId: selectedScheme.schemeId,
                termYears,
                paymentFrequency,
                sumAssured,
                ...(isLifeCategory(categoryName)
                    ? {
                        lifeDetails: {
                            nomineeName: user.full_name,
                            nomineeRelation: 'Self',
                        },
                    }
                    : {}),
                ...(isMedicalCategory(categoryName)
                    ? {
                        medicalDetails: {
                            preExistingDiseases: '',
                            hospitalNetworkTier: 'Standard',
                            isFamilyFloater: false,
                        },
                    }
                    : {}),
                ...(isMotorCategory(categoryName)
                    ? {
                        motorDetails: {
                            vehicleRegNumber: `TEMP-${Date.now().toString().slice(-6)}`,
                            vehicleModel: 'Customer Vehicle',
                            vehicleType: 'Private',
                        },
                    }
                    : {}),
                ...(isHomeCategory(categoryName)
                    ? {
                        homeDetails: {
                            propertyAddress: user.address || user.city || 'Customer address',
                            propertyValue: sumAssured,
                            structureType: 'Residential',
                        },
                    }
                    : {}),
            };

            const policy = await policyApi.createPolicy(policyPayload);

            const payment = await paymentApi.createPayment({
                policyId: policy.policyId,
                amountPaid: Number(pricingBreakdown.installment.toFixed(2)),
                paymentMethod: 'VNPay',
                transactionReference: `PREMIUM-${Date.now()}`,
            });

            try {
                const vnpay = await vnPayApi.createPaymentUrl({
                    orderID: payment.paymentId,
                    amount: Number(pricingBreakdown.installment.toFixed(2)),
                    paymentMethod: 'VNPay',
                    orderDescription: `Premium payment for ${policy.policyNumber}`,
                });

                if (vnpay.success && vnpay.paymentUrl) {
                    window.location.href = vnpay.paymentUrl;
                    return;
                }
            } catch {
                // Fallback to local confirmation when gateway URL is unavailable.
            }

            setConfirmationMessage(
                `Policy ${policy.policyNumber} was created and payment ${payment.paymentId} is recorded successfully.`
            );
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f2f6fb] via-[#f5f7fb] to-[#eef2f9] text-[#111827] flex flex-col">
            <main className="w-full max-w-[1680px] mx-auto my-6 px-6 lg:my-8 lg:px-8 flex-1">
                <section className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6">
                    {[
                        { step: 1, label: 'Select Plan' },
                        { step: 2, label: 'Calculate Premium' },
                        { step: 3, label: 'Policy & Payment' },
                        { step: 4, label: 'Confirmation' },
                    ].map((item) => {
                        const isDone = item.step < stepIndex;
                        const isCurrent = item.step === stepIndex;

                        return (
                            <div className="flex items-center gap-3 relative after:content-[''] after:h-px after:bg-[#d8dee8] after:flex-1 last:after:hidden" key={item.step}>
                                <span className={`w-9 h-9 rounded-full border-2 inline-flex items-center justify-center text-lg shrink-0 transition-colors ${isDone ? 'border-[#0b67db] bg-[#0b67db] text-white' :
                                    isCurrent ? 'border-[#0b67db] text-[#0b67db]' :
                                        'border-[#c1cedf] text-[#7a8798] bg-white'
                                    }`}>
                                    {isDone ? '✓' : item.step}
                                </span>
                                <span className={`text-base min-w-max transition-colors ${isCurrent ? 'text-[#0f172a] font-semibold' : 'text-[#64748b]'
                                    }`}>{item.label}</span>
                            </div>
                        );
                    })}
                </section>

                {errorMessage ? (
                    <p className="rounded-lg p-3.5 mb-4 text-sm bg-[#fff3f2] border border-[#fecaca] text-[#b91c1c]">
                        {errorMessage}
                    </p>
                ) : null}
                {confirmationMessage ? (
                    <p className="rounded-lg p-3.5 mb-4 text-sm bg-[#edfff2] border border-[#a7f3d0] text-[#047857]">
                        {confirmationMessage}
                    </p>
                ) : null}

                <div className="flex justify-between items-start gap-4 mb-6">
                    <div>
                        <h1 className="text-[46px] leading-[1.1] m-0 text-[#0f172a] font-bold">
                            {selectedScheme?.schemeName || 'Life Protection Plan'}
                        </h1>
                        <p className="mt-2.5 mb-0 text-[#496489] text-lg">
                            {selectedScheme?.description || 'Premium Life Insurance Plan'}
                        </p>
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                        <span className="border border-[#bfd6ff] bg-[#eef4ff] text-[#215fca] rounded-[14px] text-sm py-1 px-3">
                            {selectedScheme?.categoryName || 'Universal'}
                        </span>
                        {selectedScheme?.profitRatio ? (
                            <span className="border border-[#a8e3bf] bg-[#ebfff0] text-[#167d3f] rounded-[14px] text-sm py-1 px-3">
                                {selectedScheme.profitRatio}% Profit Ratio
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <section className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 items-stretch">
                        <div className="bg-white border border-[#d8e1ed] rounded-[22px] p-7 lg:p-8 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                            <h2 className="m-0 text-3xl lg:text-4xl font-bold text-[#0f172a]">
                                Configure Your Plan
                            </h2>

                            <div className="mt-6">
                                <label className="block mb-2 text-[#1e293b] font-semibold text-base" htmlFor="plan-selector">
                                    Policy Plan
                                </label>
                                <select
                                    className="w-full border border-[#c6d3e6] rounded-lg p-3.5 text-[17px] text-[#0f172a] bg-[#fcfdff] focus:outline focus:outline-2 focus:outline-[#0b67db]/20 focus:outline-offset-1"
                                    id="plan-selector"
                                    value={selectedSchemeId ?? ''}
                                    onChange={(event) => setSelectedSchemeId(Number(event.target.value))}
                                    disabled={isLoadingSchemes}
                                >
                                    {schemes.map((scheme) => (
                                        <option key={scheme.schemeId} value={scheme.schemeId}>
                                            {scheme.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between gap-3">
                                    <label className="block text-[#1e293b] font-semibold text-base" htmlFor="sum-assured-input">
                                        Sum Assured
                                    </label>
                                    <input
                                        className="w-full max-w-[320px] text-right border border-[#c6d3e6] rounded-lg p-3.5 text-[17px] text-[#0f172a] bg-[#fcfdff] focus:outline focus:outline-2 focus:outline-[#0b67db]/20"
                                        id="sum-assured-input"
                                        type="text"
                                        value={`${formatCompactCurrency(sumAssured)} USD`}
                                        onChange={(event) => {
                                            const value = clamp(parseCurrencyInput(event.target.value), minSumAssured, maxSumAssured);
                                            setSumAssured(value);
                                        }}
                                    />
                                </div>

                                <input
                                    className="w-full mt-4 accent-[#0b67db] cursor-pointer"
                                    type="range"
                                    min={minSumAssured}
                                    max={maxSumAssured}
                                    step={10000}
                                    value={sumAssured}
                                    onChange={(event) => setSumAssured(Number(event.target.value))}
                                />
                                <div className="mt-1 flex justify-between text-[#6f819a] text-sm">
                                    <span>{formatCompactCurrency(minSumAssured)}</span>
                                    <span>{formatCompactCurrency(maxSumAssured)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block mb-2 text-[#1e293b] font-semibold text-base" htmlFor="term-select">
                                    Policy Term (Years)
                                </label>
                                <select
                                    className="w-full border border-[#c6d3e6] rounded-lg p-3.5 text-[17px] text-[#0f172a] bg-[#fcfdff] focus:outline focus:outline-2 focus:outline-[#0b67db]/20"
                                    id="term-select"
                                    value={termYears}
                                    onChange={(event) => setTermYears(Number(event.target.value))}
                                >
                                    {termOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option} Years
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-[#6c7f9a] text-sm leading-relaxed">
                                    Choosing a longer term may reduce annual premium but extends the payment period.
                                </p>
                            </div>

                            <div className="mt-6">
                                <label className="block mb-2 text-[#1e293b] font-semibold text-base">
                                    Payment Frequency
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {frequencyOptions.map((option) => (
                                        <button
                                            type="button"
                                            key={option.value}
                                            className={`border rounded-xl p-3 cursor-pointer min-h-[88px] flex flex-col items-center justify-center text-[15px] transition-all ${paymentFrequency === option.value
                                                ? 'border-[#1a71de] bg-[#eef4ff] text-[#145bc9] ring-2 ring-[#1a71de]/10'
                                                : 'border-[#ced7e5] bg-white text-[#0f172a] hover:border-[#b1c0d6]'
                                                }`}
                                            onClick={() => setPaymentFrequency(option.value)}
                                        >
                                            <span className="font-semibold">{option.label}</span>
                                            {option.savings > 0 ? (
                                                <small className="mt-1 text-[#16a34a] font-bold text-xs uppercase tracking-wider">
                                                    Save {option.savings}%
                                                </small>
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <aside className="bg-white border border-[#d8e1ed] rounded-[22px] p-8 text-[#0f172a] shadow-[0_12px_40px_rgba(15,23,42,0.08)] flex flex-col h-full">
                            <h2 className="mt-0 mb-6 text-2xl font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-4">
                                Premium Summary
                            </h2>

                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between text-[15px] font-medium text-[#64748b]">
                                    <span>Base Plan</span>
                                    <strong className="text-[#0f172a] font-bold">{formatCurrency(calculation?.annualPremium ?? 0)}</strong>
                                </div>
                                {pricingBreakdown.riderCost > 0 && (
                                    <div className="flex justify-between text-[15px] font-medium text-[#64748b]">
                                        <span>Add-ons</span>
                                        <strong className="text-[#0f172a] font-bold">{formatCurrency(pricingBreakdown.riderCost)}</strong>
                                    </div>
                                )}
                                <div className="flex justify-between text-[15px] font-medium text-[#64748b]">
                                    <span>Tax (GST 18%)</span>
                                    <strong className="text-[#0f172a] font-bold">{formatCurrency(pricingBreakdown.taxAmount)}</strong>
                                </div>
                                <div className="flex justify-between text-[15px] font-medium text-[#64748b]">
                                    <span>{paymentFrequency} Discount</span>
                                    <strong className="text-[#c2410c] font-bold">-{formatCurrency(pricingBreakdown.discountAmount)}</strong>
                                </div>
                            </div>

                            <div className="mt-auto bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center border border-[#e2e8f0]">
                                <span className="text-xs text-[#64748b] font-bold uppercase tracking-wider">Total Payable</span>
                                <div className="text-right">
                                    <strong className="block text-3xl font-extrabold text-[#0f172a] leading-tight">
                                        {formatCurrency(pricingBreakdown.totalPayable)}
                                    </strong>
                                    <small className="text-xs text-[#94a3b8]">per year</small>
                                </div>
                            </div>

                            <div className="my-6 text-center bg-[#0b67db] p-5 rounded-2xl text-white shadow-lg shadow-[#0b67db]/30">
                                <span className="block text-[13px] opacity-90 mb-1 font-medium">Premium per Installment</span>
                                <strong className="block text-2xl font-extrabold leading-tight">
                                    {formatCurrency(pricingBreakdown.installment)}
                                </strong>
                                <small className="block text-[11px] opacity-80 mt-1 uppercase tracking-wider font-bold">
                                    Due: {paymentFrequency}
                                </small>
                            </div>

                            <button
                                type="button"
                                className="w-full p-4.5 bg-[#10b981] text-white rounded-2xl text-[17px] font-bold cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:bg-[#64748b] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:transform-none"
                                onClick={handleProceedToPayment}
                                disabled={isSubmitting || isLoadingSchemes || isCalculating || !calculation}
                            >
                                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                            </button>

                            <p className="mt-5 text-[11px] text-center text-[#64748b] leading-relaxed">
                                By proceeding, you agree to the <Link to="/about" className="text-[#0b67db] font-semibold underline hover:no-underline">Terms & Conditions</Link>
                            </p>

                            <div className="mt-6 flex justify-around pt-5 border-t border-[#e2e8f0]">
                                <span className="text-[11px] text-[#64748b] flex items-center gap-1.5 font-bold">
                                    <span className="text-sm">🛡️</span> Secure Payment
                                </span>
                                <span className="text-[11px] text-[#64748b] flex items-center gap-1.5 font-bold">
                                    <span className="text-sm">💬</span> 24/7 Support
                                </span>
                            </div>

                            {isCalculating ? (
                                <p className="mt-3 text-[#0b67db] text-[13px] text-center italic font-medium">Recalculating premium...</p>
                            ) : null}
                        </aside>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-[#d8e1ed] rounded-[22px] p-7 lg:p-8 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="m-0 text-[28px] font-bold text-[#0f172a]">Plan Benefits & Highlights</h3>
                                <div className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-3 py-1 rounded-[12px] text-[13px] font-semibold">
                                    Official Plan
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                                <div className="flex items-center gap-4 p-4 bg-[#f8fbff] border border-[#eef2f9] rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d1e3ff] group">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform">📈</div>
                                    <div>
                                        <h4 className="m-0 text-sm text-[#64748b] uppercase tracking-wider text-[11px] font-bold">Profit Ratio</h4>
                                        <p className="mt-0.5 text-lg font-bold text-[#0f172a]">
                                            {selectedScheme?.profitRatio ? `${selectedScheme.profitRatio}% Expected` : 'Market Linked'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-[#f8fbff] border border-[#eef2f9] rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d1e3ff] group">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform">🛡️</div>
                                    <div>
                                        <h4 className="m-0 text-sm text-[#64748b] uppercase tracking-wider text-[11px] font-bold">Term Flexibility</h4>
                                        <p className="mt-0.5 text-lg font-bold text-[#0f172a]">{minTerm} to {maxTerm} Years</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-[#f8fbff] border border-[#eef2f9] rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d1e3ff] group">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform">💰</div>
                                    <div>
                                        <h4 className="m-0 text-sm text-[#64748b] uppercase tracking-wider text-[11px] font-bold">Investment</h4>
                                        <p className="mt-0.5 text-lg font-bold text-[#0f172a] truncate w-full">
                                            {formatCompactCurrency(minSumAssured)}+
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-[#f8fbff] border border-[#eef2f9] rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d1e3ff] group">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform">✨</div>
                                    <div>
                                        <h4 className="m-0 text-sm text-[#64748b] uppercase tracking-wider text-[11px] font-bold">Category</h4>
                                        <p className="mt-0.5 text-lg font-bold text-[#0f172a]">{selectedScheme?.categoryName || 'Protection'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-[#d8dee8] pt-6">
                                <h4 className="mt-0 mb-3 text-base text-[#0f172a] font-bold">Detailed Description</h4>
                                <p className="m-0 text-[#475569] leading-relaxed text-[15px]">
                                    {selectedScheme?.description || 'This insurance scheme provides comprehensive coverage and financial security for you and your family.'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-[#d8e1ed] rounded-[22px] p-7 lg:p-8 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="m-0 text-[28px] font-bold text-[#0f172a]">Riders & Add-ons</h3>
                                <div className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-3 py-1 rounded-[12px] text-[13px] font-semibold transition-all">
                                    {selectedRiderIds.length} Selected
                                </div>
                            </div>
                            <p className="mt-0 text-[#6c7f9a] text-sm mb-6">Customize your protection with optional benefit riders.</p>

                            <div className="flex flex-col gap-3">
                                {AVAILABLE_RIDERS.map((rider) => (
                                    <div
                                        key={rider.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border group ${selectedRiderIds.includes(rider.id)
                                            ? 'border-[#0b67db] bg-[#f0f7ff] border-2 shadow-sm'
                                            : 'border-[#dce5f1] bg-white hover:border-[#0b67db] hover:bg-[#f8fbff]'
                                            }`}
                                        onClick={() => {
                                            setSelectedRiderIds(prev =>
                                                prev.includes(rider.id)
                                                    ? prev.filter(id => id !== rider.id)
                                                    : [...prev, rider.id]
                                            );
                                        }}
                                    >
                                        <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center text-sm transition-all duration-200 ${selectedRiderIds.includes(rider.id)
                                            ? 'bg-[#0b67db] border-[#0b67db] text-white'
                                            : 'bg-white border-[#cbd5e1] text-transparent'
                                            }`}>
                                            {selectedRiderIds.includes(rider.id) ? '✓' : ''}
                                        </div>
                                        <div className="text-2xl filter group-hover:scale-110 transition-transform">{rider.icon}</div>
                                        <div className="flex-1">
                                            <h4 className="m-0 text-base font-semibold text-[#0f172a]">{rider.name}</h4>
                                            <p className="mt-0.5 text-xs text-[#64748b] leading-tight">{rider.description}</p>
                                        </div>
                                        <div className="font-bold text-[#10b981] text-[15px] whitespace-nowrap">
                                            +${rider.price.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PremiumCalculator;
