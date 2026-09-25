import React from 'react';
import { PhoneCall, UserCheck, Building2, HelpCircle, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HelpSupportViewProps {
  language: Language;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ language }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              👨‍🌾
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Expert Connect & Agricultural Support
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Direct access to local extension officers, university lab scientists & Kisan Call Center
          </p>
        </div>
      </div>

      {/* Assigned Extension Worker Contact */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
          Your Block Agricultural Extension Officer
        </span>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-lg shadow-xs">
              AD
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Anjali Deshmukh</h3>
              <p className="text-xs text-stone-600 font-medium">
                Block Agricultural Extension Officer (Wardha District)
              </p>
              <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                Service Area: Hinganghat & Deoli Talukas
              </span>
            </div>
          </div>

          <a
            href="tel:9000000002"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors w-full sm:w-auto justify-center"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Extension Officer</span>
          </a>
        </div>
      </div>

      {/* Direct Lab & KVK Directory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-700" />
            <h3 className="font-bold text-stone-900 text-sm">PDKV Agricultural University Diagnostic Lab</h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Senior Plant Pathologist: Dr. Meera Kulkarni. Phytosanitary diagnostic reference facility for foliar & root pathogens.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
            <span className="text-purple-900 font-bold">Nagpur Campus</span>
            <span className="text-stone-500 font-semibold">Toll Free: 1800-233-0001</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-sm">Kisan Call Centre (KCC) Helpline</h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Government of India free agricultural advice hotline in Marathi, Hindi & English from 6:00 AM to 10:00 PM.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
            <span className="text-emerald-900 font-bold">National Toll Free</span>
            <strong className="text-emerald-800 text-sm font-mono">1551</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
