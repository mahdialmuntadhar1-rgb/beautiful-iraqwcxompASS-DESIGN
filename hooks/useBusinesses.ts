import { useCallback, useEffect, useState } from 'react';
import { getBusinesses } from '../services/businessService';
import type { Business } from '../types';

interface UseBusinessesFilters {
  category: string;
  governorate: string;
  rating: number;
  search?: string;
}

interface UseBusinessesResult {
  businesses: Business[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  usingMockData: boolean;
  reload: () => Promise<void>;
}

export const useBusinesses = (
  filters: UseBusinessesFilters,
  page: number,
  pageSize: number,
): UseBusinessesResult => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getBusinesses({
      page,
      pageSize,
      category: filters.category,
      governorate: filters.governorate,
      minRating: filters.rating,
      search: filters.search,
    });

    setBusinesses(result.businesses);
    setTotalCount(result.totalCount);
    setUsingMockData(result.usingMockData);
    setError(result.error);
    setIsLoading(false);
  }, [filters.category, filters.governorate, filters.rating, filters.search, page, pageSize]);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  return { businesses, totalCount, isLoading, error, usingMockData, reload: loadBusinesses };
};
