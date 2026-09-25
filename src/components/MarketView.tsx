import React from 'react';
import { TrendingUp, MapPin, Calendar, Building, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { Language } from '../types';

interface MarketViewProps {
  language: Language;
}

export const MarketView: React.FC<MarketViewProps> = ({ language }) => {
  const marketRates = [
    {
      crop: 'Soybean',
      variety: 'JS 20-29 / Yellow',
      price: '₹4,850',
      unit: 'Quintal',
      mandi: 'Hinganghat APMC (Wardha)',
      trend: '+₹120',
      isUp: true,
      minMax: '₹4,400 - ₹4,920',
      date: 'Today, 10:30 AM',
    },
    {
      crop: 'Cotton (Kapas)',
      variety: 'Long Staple (Bt)',
      price: '₹7,420',
      unit: 'Quintal',
      mandi: 'Wardha APMC',
      trend: '+₹80',
      isUp: true,
      minMax: '₹6,900 - ₹7,550',
      date: 'Today, 11:15 AM',
    },
    {
      crop: 'Pigeon Pea (Tur)',
      variety: 'Maruti / White',
      price: '₹9,200',
      unit: 'Quintal',
      mandi: 'Amravati Main APMC',
      trend: '-₹50',
      isUp: false,
      minMax: '₹8,800 - ₹9,400',
      date: 'Today, 09:45 AM',
    },
    {
      crop: 'Wheat',
      variety: 'Lok-1 / Sharbati',
      price: '₹2,680',
      unit: 'Quintal',
      mandi: 'Nagpur APMC Market',
      trend: '+₹40',
      isUp: true,
      minMax: '₹2,450 - ₹2,750',
      date: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              💰
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Live Mandi Crop Market Prices
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time APMC Mandi rates, daily trends & local market intelligence
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-700 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Wardha & Vidarbha APMCs</span>
        </span>
      </div>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {marketRates.map((m, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">{m.crop}</h3>
                <span className="text-xs text-stone-500">{m.variety}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  m.isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {m.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{m.trend}</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100">
              <span className="text-2xl font-extrabold text-stone-900">{m.price}</span>
              <span className="text-xs text-stone-500 font-semibold">/ {m.unit}</span>
            </div>

            <div className="space-y-1 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>APMC Mandi:</span>
                <strong className="text-stone-900">{m.mandi}</strong>
              </div>
              <div className="flex justify-between">
                <span>Range Today:</span>
                <strong className="text-stone-800">{m.minMax}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Updated:</span>
                <span>{m.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
