import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, User, ArrowRight, RefreshCw } from 'lucide-react';
import { OTPInput } from './OTPInput';
import { useAuth } from '../hooks/useAuth';

interface AuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar' | 'ku';
}

export const AuthSheet: React.FC<AuthSheetProps> = ({ isOpen, onClose, lang }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { signIn, verifyOtp } = useAuth();

  const t = {
    en: {
      title: "Join Iraq Compass",
      subtitle: "Discover the best of Iraq",
      phoneLabel: "Phone Number",
      nameLabel: "Display Name",
      continue: "Continue",
      verifyTitle: "Verify your number",
      verifySubtitle: "Enter the 6-digit code sent to",
      resend: "Resend code",
      resendIn: "Resend in",
      error: "Something went wrong. Please try again."
    },
    ar: {
      title: "انضم إلى بوصلة العراق",
      subtitle: "اكتشف أفضل ما في العراق",
      phoneLabel: "رقم الهاتف",
      nameLabel: "الاسم المستعار",
      continue: "استمرار",
      verifyTitle: "تأكيد رقمك",
      verifySubtitle: "أدخل الرمز المكون من 6 أرقام المرسل إلى",
      resend: "إعادة إرسال الرمز",
      resendIn: "إعادة الإرسال خلال",
      error: "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    },
    ku: {
      title: "ببە بە ئەندام لە قیبلەنومای عێراق",
      subtitle: "باشترینەکانی عێراق بدۆزەرەوە",
      phoneLabel: "ژمارەی مۆبایل",
      nameLabel: "ناوی نیشاندان",
      continue: "بەردەوام بە",
      verifyTitle: "ژمارەکەت پشتڕاست بکەرەوە",
      verifySubtitle: "ئەو کۆدە 6 ژمارەییەی نێردراوە بنووسە بۆ",
      resend: "ناردنەوەی کۆد",
      resendIn: "ناردنەوە لە",
      error: "هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە."
    }
  }[lang];

  const handleSendOtp = async () => {
    if (!phone || !displayName) return;
    setIsLoading(true);
    const { error } = await signIn(phone);
    setIsLoading(false);
    if (!error) {
      setStep('otp');
      startCountdown();
    } else {
      alert(t.error);
    }
  };

  const handleVerify = async (otpValue: string) => {
    setIsLoading(true);
    const { error } = await verifyOtp(phone, otpValue, displayName);
    setIsLoading(false);
    if (!error) {
      onClose();
    } else {
      alert(t.error);
    }
  };

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[120] bg-[#0a0e1a] border-t border-white/10 rounded-t-[32px] overflow-hidden"
            dir={dir}
          >
            <div className="max-w-[480px] mx-auto px-6 py-8">
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-1 bg-white/20 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/60">
                  <X size={20} />
                </button>
              </div>

              {step === 'phone' ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
                    <p className="text-[#e8dcc8]/60">{t.subtitle}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[#e8dcc8]/40 uppercase tracking-widest px-1">
                        {t.nameLabel}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={18} />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Salar Ali"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#d4af37] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-[#e8dcc8]/40 uppercase tracking-widest px-1">
                        {t.phoneLabel}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={18} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+964 770 000 0000"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#d4af37] focus:outline-none transition-all"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading || !phone || !displayName}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f4cf57] text-[#0a0e1a] font-bold text-lg shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : (
                      <>
                        {t.continue}
                        <ArrowRight size={20} className={lang !== 'en' ? 'rotate-180' : ''} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 text-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{t.verifyTitle}</h2>
                    <p className="text-[#e8dcc8]/60">
                      {t.verifySubtitle} <span className="text-white font-medium" dir="ltr">{phone}</span>
                    </p>
                  </div>

                  <OTPInput onComplete={handleVerify} />

                  <div className="pt-4">
                    {countdown > 0 ? (
                      <p className="text-[#e8dcc8]/40 text-sm">
                        {t.resendIn} {countdown}s
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-[#d4af37] font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                      >
                        <RefreshCw size={16} />
                        {t.resend}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
