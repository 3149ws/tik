import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Gift,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface DynamicPricingProps {
  onSelectPlan?: (channelsCount: number, billingCycle: 'monthly' | 'annual') => void;
}

export const DynamicPricing: React.FC<DynamicPricingProps> = ({ onSelectPlan }) => {
  const { t, language } = useLanguage();
  const { pricingSettings, applyPromoCode, setActivePage, currentUser } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [channelsCount, setChannelsCount] = useState<number>(5);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ percent?: number; amount?: number } | null>(
    null
  );
  const [promoStatus, setPromoStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(
    null
  );

  // Pricing calculations
  const baseMonthly = pricingSettings.baseMonthlyPerChannel; // 7.00
  const annualDiscountPct = pricingSettings.annualDiscountPercentage; // 20%
  const effectiveMonthlyPerChannel =
    billingCycle === 'annual'
      ? baseMonthly * (1 - annualDiscountPct / 100) // 5.60
      : baseMonthly; // 7.00

  // Total raw price per month
  let monthlyTotal = channelsCount * effectiveMonthlyPerChannel;
  let annualTotal = monthlyTotal * 12;

  // Apply promo if any
  if (appliedDiscount?.percent) {
    monthlyTotal = monthlyTotal * (1 - appliedDiscount.percent / 100);
    annualTotal = annualTotal * (1 - appliedDiscount.percent / 100);
  } else if (appliedDiscount?.amount) {
    monthlyTotal = Math.max(0, monthlyTotal - appliedDiscount.amount);
    annualTotal = Math.max(0, annualTotal - appliedDiscount.amount * 12);
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const res = applyPromoCode(promoCodeInput);
    if (res.valid) {
      setAppliedDiscount({ percent: res.discountPercent, amount: res.discountAmount });
      setPromoStatus({
        type: 'success',
        msg: `${t.pricingPromoApplied} (${
          res.discountPercent ? `${res.discountPercent}% OFF` : `$${res.discountAmount} OFF`
        })`,
      });
    } else {
      setAppliedDiscount(null);
      setPromoStatus({ type: 'error', msg: t.pricingPromoInvalid });
    }
  };

  const handleChoose = (count: number) => {
    if (onSelectPlan) {
      onSelectPlan(count, billingCycle);
    } else {
      setActivePage('planning');
    }
  };

  const presetTiers = [
    {
      name: t.pricingStarterTitle,
      subtitle: t.pricingStarterDesc,
      channels: 3,
      badge: 'Starter',
      highlight: false,
      features: [
        t.pricingFeatureUnlimitedPosts,
        t.pricingFeatureDedicatedIp,
        t.pricingFeatureLivePreview,
        t.pricingFeatureApiVerified,
      ],
    },
    {
      name: t.pricingProTitle,
      subtitle: t.pricingProDesc,
      channels: 10,
      badge: language === 'zh' ? '🔥 矩阵首选推荐' : '🔥 Most Popular for Matrix',
      highlight: true,
      features: [
        t.pricingFeatureUnlimitedPosts,
        t.pricingFeatureDedicatedIp,
        t.pricingFeatureLivePreview,
        t.pricingFeatureApiVerified,
        t.pricingFeatureAutoHashtags,
        t.pricingFeatureUnifiedInbox,
      ],
    },
    {
      name: t.pricingAgencyTitle,
      subtitle: t.pricingAgencyDesc,
      channels: 25,
      badge: 'Enterprise Agency',
      highlight: false,
      features: [
        t.pricingFeatureUnlimitedPosts,
        t.pricingFeatureDedicatedIp,
        t.pricingFeatureLivePreview,
        t.pricingFeatureApiVerified,
        t.pricingFeatureAutoHashtags,
        t.pricingFeatureUnifiedInbox,
        t.pricingFeaturePrioritySupport,
        t.pricingFeatureDedicatedNodes,
      ],
    },
  ];

  return (
    <div id="pricing" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            {language === 'zh' ? '透明商业化定价' : 'Transparent Commercial Pricing'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            {t.pricingTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">{t.pricingSubtitle}</p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/60 shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.pricingMonthly} ($7.00 / ch)
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t.pricingAnnual} ($5.60 / ch)</span>
              <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 text-[10px] font-bold rounded-full">
                {t.pricingAnnualBadge}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Channel Slider Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Slider Control */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>{t.pricingSliderLabel}</span>
                </label>
                <span className="text-2xl font-black text-indigo-600 font-mono bg-indigo-50 px-3.5 py-1 rounded-xl border border-indigo-100">
                  {channelsCount} {language === 'zh' ? '个账号席位' : 'Channels'}
                </span>
              </div>

              {/* Range Slider */}
              <div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={channelsCount}
                  onChange={(e) => setChannelsCount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2">
                  <span>1 (Solo)</span>
                  <span>5 (Starter)</span>
                  <span>10 (Pro)</span>
                  <span>25 (Matrix)</span>
                  <span>50 (Agency)</span>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[1, 3, 5, 10, 15, 25, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setChannelsCount(num)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      channelsCount === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} {language === 'zh' ? '号' : 'ch'}
                  </button>
                ))}
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="pt-4 border-t border-slate-100 flex gap-2">
                <div className="relative flex-1">
                  <Gift className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder={language === 'zh' ? '输入优惠码 (例如: YUNINA2026)' : 'Promo code (e.g. YUNINA2026)'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  {t.pricingApplyCode}
                </button>
              </form>

              {promoStatus && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-1.5 ${
                    promoStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {promoStatus.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>{promoStatus.msg}</span>
                </div>
              )}
            </div>

            {/* Price Output Card */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white text-center space-y-4 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {language === 'zh' ? '实时计费总额' : 'Calculated Pricing'}
              </span>

              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  ${billingCycle === 'annual' ? (annualTotal / 12).toFixed(2) : monthlyTotal.toFixed(2)}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  USD / {language === 'zh' ? '月 (包含所选' : 'month (for'} {channelsCount}{' '}
                  {language === 'zh' ? '个账号)' : 'channels)'}
                </div>
              </div>

              <div className="py-2 px-3 bg-white/10 rounded-xl text-xs text-indigo-200 backdrop-blur-xs">
                {billingCycle === 'annual' ? (
                  <span>
                    {language === 'zh' ? '年付总计一次性结清: ' : 'Billed annually: '}
                    <strong className="text-white font-mono">${annualTotal.toFixed(2)} USD</strong>
                    <span className="text-emerald-400 ml-1 font-bold">(-20%)</span>
                  </span>
                ) : (
                  <span>
                    {language === 'zh' ? '按月结算，随时增减或取消' : 'Billed monthly, cancel anytime'}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleChoose(channelsCount)}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>{t.pricingSelectPlan}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400">
                {language === 'zh'
                  ? '包含海外独立纯净 IP 直发节点与 14 天免费体验'
                  : 'Includes dedicated clean IP dispatch node'}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Preset Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {presetTiers.map((tier, index) => {
            const tierMonthlyRate =
              billingCycle === 'annual'
                ? tier.channels * effectiveMonthlyPerChannel
                : tier.channels * baseMonthly;

            return (
              <div
                key={index}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                  tier.highlight
                    ? 'bg-white border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-105 z-10'
                    : 'bg-white/90 border border-slate-200/90 shadow-md hover:shadow-lg'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                    {!tier.highlight && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {tier.channels} {language === 'zh' ? '账号' : 'Channels'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-5 min-h-[32px]">{tier.subtitle}</p>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 font-mono">
                        ${tierMonthlyRate.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ mo</span>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-medium">
                      ${effectiveMonthlyPerChannel.toFixed(2)} {t.pricingPerChannelRate}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-600">
                    {tier.features.map((feat, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setChannelsCount(tier.channels);
                    handleChoose(tier.channels);
                  }}
                  className={`w-full py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    tier.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {t.pricingSelectPlan} ({tier.channels} {language === 'zh' ? '账号' : 'Channels'})
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
