import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface GovernorateCount {
  governorate: string | null;
}

export const AdminHealthCheck: React.FC = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [phonePercent, setPhonePercent] = useState(0);
  const [geoPercent, setGeoPercent] = useState(0);
  const [governorateCounts, setGovernorateCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const { count: total, error: totalError } = await supabase
        .from('directory')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        setError(totalError.message);
        return;
      }

      const { count: phoneCount } = await supabase
        .from('directory')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null)
        .neq('phone', '');

      const { count: geoCount } = await supabase
        .from('directory')
        .select('*', { count: 'exact', head: true })
        .not('lat', 'is', null)
        .not('lng', 'is', null);

      const { data: governorateData } = await supabase
        .from<GovernorateCount>('directory')
        .select('governorate');

      const grouped = governorateData?.reduce<Record<string, number>>((acc, entry) => {
        const key = entry.governorate || 'Unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}) || {};

      setGovernorateCounts(grouped);
      setTotalCount(total || 0);
      setPhonePercent(total ? Math.round(((phoneCount || 0) / total) * 100) : 0);
      setGeoPercent(total ? Math.round(((geoCount || 0) / total) * 100) : 0);
    };

    loadStats();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Data Health</h1>
        {error ? <p className="text-red-300">{error}</p> : (
          <div className="space-y-4 text-white">
            <p>Total records: <strong>{totalCount}</strong></p>
            <p>Phone completeness: <strong>{phonePercent}%</strong></p>
            <p>Geo completeness (lat/lng): <strong>{geoPercent}%</strong></p>
            <div>
              <h2 className="text-xl font-semibold mb-2">Count per governorate</h2>
              <ul className="space-y-1 text-white/90">
                {Object.entries(governorateCounts).map(([gov, count]) => (
                  <li key={gov}>{gov}: {count}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
