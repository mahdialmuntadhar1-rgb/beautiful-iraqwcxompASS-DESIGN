import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GlassCard } from './GlassCard';
import { MapPin, ArrowLeft } from './icons';
import type { Business } from '../types';

interface BusinessDetailProps {
  id: string;
  onBack: () => void;
}

export const BusinessDetail: React.FC<BusinessDetailProps> = ({ id, onBack }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusiness = async () => {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from<Business>('directory')
        .select('*')
        .eq('id', id);

      if (fetchError) {
        setError(fetchError.message);
        setBusiness(null);
      } else {
        setBusiness(data?.[0] || null);
      }
      setIsLoading(false);
    };

    loadBusiness();
  }, [id]);

  const phone = business?.phone?.trim();
  const hasCoords = business?.lat !== undefined && business?.lat !== null && business?.lng !== undefined && business?.lng !== null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to directory
        </button>

        {isLoading && <div className="rounded-2xl bg-white/5 animate-pulse h-64" />}

        {!isLoading && error && <p className="text-red-300">{error}</p>}

        {!isLoading && !error && !business && <p className="text-white/70">Business not found.</p>}

        {!isLoading && business && (
          <GlassCard className="p-6 md:p-8 text-start space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{business.name}</h1>
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-sm font-semibold">{business.category}</span>
            </div>
            <p className="text-white/80 flex items-center gap-2"><MapPin className="w-4 h-4" />{business.governorate || 'Unknown governorate'}{business.city ? `, ${business.city}` : ''}</p>

            <div>
              <h2 className="text-white font-semibold mb-1">Phone</h2>
              {phone ? (
                <a href={`tel:${phone}`} className="text-teal-400 hover:underline">{phone}</a>
              ) : (
                <p className="text-white/60">Phone not available</p>
              )}
            </div>

            <div>
              <h2 className="text-white font-semibold mb-1">Location</h2>
              {hasCoords ? (
                <a
                  href={`https://maps.google.com/?q=${business.lat},${business.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:underline"
                >
                  Open in Google Maps
                </a>
              ) : (
                <p className="text-white/60">Map coordinates not available</p>
              )}
            </div>

            <div>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${phone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'}`}>
                {phone ? '✓ Verified' : 'Unverified'}
              </span>
            </div>
          </GlassCard>
        )}
      </div>
    </section>
  );
};
