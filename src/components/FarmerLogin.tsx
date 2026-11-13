import React, { useState } from 'react';
import { ArrowRight, Globe, MapPin, Phone, Sprout, User } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations.ts';
import type { FarmerProfile, Language } from '../types.ts';

interface FarmerLoginProps {
  initialProfile?: FarmerProfile | null;
  onLogin: (profile: FarmerProfile) => void;
}

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string; native: string }> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const FarmerLogin: React.FC<FarmerLoginProps> = ({ initialProfile, onLogin }) => {
  const [language, setLanguage] = useState<Language>(initialProfile?.language ?? 'en');
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [phone, setPhone] = useState(initialProfile?.phone ?? '');
  const [place, setPlace] = useState(initialProfile?.place ?? '');
  const [locality, setLocality] = useState(initialProfile?.locality ?? '');
  const [error, setError] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!name.trim() || !place.trim() || !locality.trim()) {
      setError(t.login.validationRequired);
      return;
    }
    if (cleanedPhone.length !== 10) {
      setError(t.login.validationPhone);
      return;
    }
    setError('');
    onLogin({
      name: name.trim(),
      phone: cleanedPhone,
      place: place.trim(),
      locality: locality.trim(),
      language,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
        {/* Left Visual Column */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[620px] bg-emerald-950 flex flex-col justify-between">
          {!imgFailed ? (
            <img
              src="/src/assets/images/mandi_harvest_hero_1794557947702.jpg"
              alt="Indian farmers market harvest produce"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

          <div className="relative z-10 p-6 sm:p-8 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              MANDIMITRA
            </span>
          </div>

          <div className="relative z-10 p-6 sm:p-8 text-white">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-balance">
              {t.login.heroCaption}
            </h2>
            <p className="mt-3 text-sm text-emerald-100/90 leading-relaxed">
              {t.login.heroSubcaption}
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                {t.login.heading}
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-md leading-relaxed">
                {t.login.subheading}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* Language Selection */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-800 mb-2">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>{t.login.languageLabel}</span>
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const active = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setLanguage(opt.code)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        active
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.native}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="farmer-name" className="block text-sm font-medium text-slate-800 mb-1.5">
                  {t.login.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="farmer-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.login.namePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="farmer-phone" className="block text-sm font-medium text-slate-800 mb-1.5">
                  {t.login.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="farmer-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t.login.phonePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono-nums bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Place */}
              <div>
                <label htmlFor="farmer-place" className="block text-sm font-medium text-slate-800 mb-1.5">
                  {t.login.placeLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="farmer-place"
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder={t.login.placePlaceholder}
                    list="indian-places"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                    required
                  />
                  <datalist id="indian-places">
                    <option value="Davanagere" />
                    <option value="Hubballi" />
                    <option value="Mysuru" />
                    <option value="Kolar" />
                    <option value="Shivamogga" />
                    <option value="Kalaburagi" />
                    <option value="Raichur" />
                    <option value="Belagavi" />
                    <option value="Bengaluru" />
                    <option value="Nashik" />
                    <option value="Indore" />
                  </datalist>
                </div>
              </div>

              {/* Locality */}
              <div>
                <label htmlFor="farmer-locality" className="block text-sm font-medium text-slate-800 mb-1.5">
                  {t.login.localityLabel}
                </label>
                <input
                  id="farmer-locality"
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder={t.login.localityPlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                  required
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700 cursor-pointer"
            >
              <span>{t.login.submitButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
