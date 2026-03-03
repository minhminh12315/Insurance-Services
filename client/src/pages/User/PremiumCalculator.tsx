import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import './PremiumCalculator.css';

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
    const navigate = useNavigate();
    const { user } = useAuth();
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
        const taxAmount = annualPremium * 0.18;
        const discountRate = frequencyOptions.find((option) => option.value === paymentFrequency)?.savings ?? 0;
        const discountAmount = ((annualPremium + taxAmount) * discountRate) / 100;
        const totalPayable = annualPremium + taxAmount - discountAmount;
        const installment = totalPayable / installmentsPerYear[paymentFrequency];

        return {
            annualPremium,
            taxAmount,
            discountRate,
            discountAmount,
            totalPayable,
            installment,
        };
    }, [calculation, paymentFrequency]);

    useEffect(() => {
        const loadSchemes = async () => {
            setIsLoadingSchemes(true);
            setErrorMessage('');
            try {
                const availableSchemes = await schemeApi.getLifeSchemes();
                setSchemes(availableSchemes);

                if (availableSchemes.length === 0) {
                    setErrorMessage('No active plan available at the moment.');
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
    }, []);

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
            const policy = await policyApi.createPolicy({
                schemeId: selectedScheme.schemeId,
                termYears,
                paymentFrequency,
                sumAssured,
                lifeDetails: {
                    nomineeName: user.full_name,
                    nomineeRelation: 'Self',
                },
            });

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

    const initials = user?.full_name
        ? user.full_name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : 'U';

    return (
        <div className="premium-page">
            <header className="premium-header">
                <div className="premium-header__brand">
                    <div className="premium-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 3L4 6.5V11C4 16 7.5 20.6 12 22C16.5 20.6 20 16 20 11V6.5L12 3Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path d="M12 7V15" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M9 10.5H15" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                    </div>
                    <span>SecureLife</span>
                </div>

                <nav className="premium-header__nav">
                    <button type="button" onClick={() => navigate('/user/policies')}>
                        Policies
                    </button>
                    <button type="button" className="is-active">
                        Calculators
                    </button>
                    <button type="button" onClick={() => navigate('/about')}>
                        About Us
                    </button>
                </nav>

                <div className="premium-header__actions">
                    <span className="premium-help">Need help?</span>
                    <Link to="/contact">Contact Agent</Link>
                    <button type="button" className="premium-avatar" onClick={() => navigate('/user/profile')}>
                        {initials}
                    </button>
                </div>
            </header>

            <main className="premium-main">
                <section className="premium-steps">
                    {[
                        { step: 1, label: 'Select Plan' },
                        { step: 2, label: 'Calculate Premium' },
                        { step: 3, label: 'Policy & Payment' },
                        { step: 4, label: 'Confirmation' },
                    ].map((item) => {
                        const isDone = item.step < stepIndex;
                        const isCurrent = item.step === stepIndex;

                        return (
                            <div className="premium-step" key={item.step}>
                                <span className={`premium-step__circle ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}>
                                    {isDone ? '✓' : item.step}
                                </span>
                                <span className={`premium-step__label ${isCurrent ? 'is-current' : ''}`}>{item.label}</span>
                            </div>
                        );
                    })}
                </section>

                {errorMessage ? <p className="premium-alert premium-alert--error">{errorMessage}</p> : null}
                {confirmationMessage ? <p className="premium-alert premium-alert--success">{confirmationMessage}</p> : null}

                <section className="premium-layout">
                    <div className="premium-config-area">
                        <div className="premium-plan-title">
                            <div>
                                <h1>{selectedScheme?.schemeName || 'Life Protection Plan'}</h1>
                                <p>Premium Life Insurance Plan</p>
                            </div>
                            <div className="premium-tags">
                                <span>Life Protection</span>
                                <span>Investment Linked</span>
                            </div>
                        </div>

                        <div className="premium-config-card">
                            <h2>Configure Your Plan</h2>

                            <div className="premium-field-group">
                                <label htmlFor="plan-selector">Policy Plan</label>
                                <select
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

                            <div className="premium-field-group">
                                <div className="premium-field-inline">
                                    <label htmlFor="sum-assured-input">Sum Assured</label>
                                    <input
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
                                    className="premium-range"
                                    type="range"
                                    min={minSumAssured}
                                    max={maxSumAssured}
                                    step={10000}
                                    value={sumAssured}
                                    onChange={(event) => setSumAssured(Number(event.target.value))}
                                />
                                <div className="premium-range-labels">
                                    <span>{formatCompactCurrency(minSumAssured)}</span>
                                    <span>{formatCompactCurrency(maxSumAssured)}</span>
                                </div>
                            </div>

                            <div className="premium-field-group">
                                <label htmlFor="term-select">Policy Term (Years)</label>
                                <select
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
                                <p className="premium-field-help">
                                    Choosing a longer term may reduce annual premium but extends the payment period.
                                </p>
                            </div>

                            <div className="premium-field-group">
                                <label>Payment Frequency</label>
                                <div className="premium-frequency-grid">
                                    {frequencyOptions.map((option) => (
                                        <button
                                            type="button"
                                            key={option.value}
                                            className={paymentFrequency === option.value ? 'is-selected' : ''}
                                            onClick={() => setPaymentFrequency(option.value)}
                                        >
                                            <span>{option.label}</span>
                                            {option.savings > 0 ? <small>Save {option.savings}%</small> : null}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="premium-riders-card">
                            <div className="premium-riders-card__header">
                                <h3>Riders & Add-ons</h3>
                                <button type="button" disabled>
                                    Next Step
                                </button>
                            </div>
                            <div className="premium-rider-row">Critical Illness Cover</div>
                            <div className="premium-rider-row">Accidental Death Benefit</div>
                        </div>
                    </div>

                    <aside className="premium-summary">
                        <h2>Premium Summary</h2>

                        <div className="premium-summary__rows">
                            <div>
                                <span>Base Premium</span>
                                <strong>{formatCurrency(pricingBreakdown.annualPremium)}</strong>
                            </div>
                            <div>
                                <span>Tax (GST 18%)</span>
                                <strong>{formatCurrency(pricingBreakdown.taxAmount)}</strong>
                            </div>
                            <div className="discount">
                                <span>Yearly Discount</span>
                                <strong>-{formatCurrency(pricingBreakdown.discountAmount)}</strong>
                            </div>
                        </div>

                        <div className="premium-summary__total">
                            <span>Total Payable</span>
                            <div>
                                <strong>{formatCurrency(pricingBreakdown.totalPayable)}</strong>
                                <small>per year</small>
                            </div>
                        </div>

                        <div className="premium-summary__installment">
                            <span>Premium per Installment</span>
                            <strong>{formatCurrency(pricingBreakdown.installment)}</strong>
                            <small>Due: {paymentFrequency}</small>
                        </div>

                        <button
                            type="button"
                            className="premium-pay-button"
                            onClick={handleProceedToPayment}
                            disabled={isSubmitting || isLoadingSchemes || isCalculating || !calculation}
                        >
                            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                        </button>

                        <p className="premium-summary__terms">
                            By proceeding, you agree to the <Link to="/about">Terms & Conditions</Link>
                        </p>

                        <div className="premium-summary__meta">
                            <span>Secure Payment</span>
                            <span>24/7 Support</span>
                        </div>

                        {isCalculating ? <p className="premium-summary__status">Recalculating premium...</p> : null}
                    </aside>
                </section>
            </main>

            <footer className="premium-footer">
                <div className="premium-footer__brand">
                    <div className="premium-logo is-small" />
                    <span>SecureLife</span>
                </div>
                <div className="premium-footer__links">
                    <Link to="/about">Privacy Policy</Link>
                    <Link to="/about">Terms of Service</Link>
                    <Link to="/contact">Help Center</Link>
                </div>
                <p>© 2026 SecureLife. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PremiumCalculator;
