import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PromoCode } from '../../types';
import { DollarSign, Tag, Plus, Trash2, CheckCircle2, Gift } from 'lucide-react';

export const PricingManager: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    pricingSettings,
    updatePricingSettings,
    promoCodes,
    addPromoCode,
    deletePromoCode,
  } = useApp();

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addPromoCode({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue,
      maxUses,
      expiresAt,
      isActive: true,
    });

    setCode('');
  };

  return (
    <div className="space-y-8">
      {/* Base Pricing Matrix Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-indigo-600" />
          <span>{language === 'zh' ? '基础席位单价配置' : 'Base Per-Channel Seat Pricing'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Monthly Base Rate ($ / channel / month)
            </label>
            <input
              type="number"
              step="0.1"
              value={pricingSettings.baseMonthlyPerChannel}
              onChange={(e) =>
                updatePricingSettings({ baseMonthlyPerChannel: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Annual Discount Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="90"
              value={pricingSettings.annualDiscountPercentage}
              onChange={(e) =>
                updatePricingSettings({ annualDiscountPercentage: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
            />
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Calculated Annual Rate:{' '}
              <strong className="font-mono">
                $
                {(
                  pricingSettings.baseMonthlyPerChannel *
                  (1 - pricingSettings.annualDiscountPercentage / 100)
                ).toFixed(2)}
              </strong>{' '}
              / channel / mo
            </p>
          </div>
        </div>
      </div>

      {/* Promo Codes Manager */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-600" />
          <span>{language === 'zh' ? '优惠券与推广码管理' : 'Promo Codes & Coupons'}</span>
        </h3>

        {/* Add Promo Code Form */}
        <form onSubmit={handleAddPromo} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            {language === 'zh' ? '创建新优惠码' : 'Create New Promo Code'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-600 mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PROMO2026"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg uppercase font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Type</label>
              <select
                value={discountType}
                onChange={(e: any) => setDiscountType(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              >
                <option value="percentage">% Percentage</option>
                <option value="fixed">$ Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Max Redemptions</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
              >
                + Add Code
              </button>
            </div>
          </div>
        </form>

        {/* Existing Promo Codes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Promo Code</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Used / Max</th>
                <th className="pb-3">Expires</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promoCodes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-bold text-indigo-700">{p.code}</td>
                  <td className="py-3 font-semibold text-slate-800">
                    {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `$${p.discountValue} OFF`}
                  </td>
                  <td className="py-3 font-mono text-slate-600">
                    {p.usedCount} / {p.maxUses}
                  </td>
                  <td className="py-3 text-slate-500 font-mono">{p.expiresAt}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deletePromoCode(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
