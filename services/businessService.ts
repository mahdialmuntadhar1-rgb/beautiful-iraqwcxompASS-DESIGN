import { businesses as MOCK_BUSINESSES } from '../constants';
import { supabase } from '../lib/supabase';
import type { Business } from '../types';

type DirectoryRow = {
  id: number | string;
  name: string | null;
  name_ar?: string | null;
  name_ku?: string | null;
  category: string | null;
  subcategory?: string | null;
  governorate: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  whatsapp?: string | null;
  website?: string | null;
  rating?: number | null;
  lat?: number | null;
  lng?: number | null;
};

export interface BusinessQuery {
  page: number;
  pageSize: number;
  category?: string;
  governorate?: string;
  minRating?: number;
  search?: string;
}

export interface BusinessQueryResult {
  businesses: Business[];
  totalCount: number;
  usingMockData: boolean;
  error: string | null;
}

const mapDirectoryRowToBusiness = (row: DirectoryRow): Business => ({
  id: row.id,
  name: row.name ?? 'Unknown business',
  nameAr: row.name_ar ?? undefined,
  nameKu: row.name_ku ?? undefined,
  category: row.category ?? 'uncategorized',
  subcategory: row.subcategory ?? undefined,
  governorate: row.governorate ?? undefined,
  city: row.city ?? undefined,
  address: row.address ?? undefined,
  phone: row.phone ?? undefined,
  whatsapp: row.whatsapp ?? undefined,
  website: row.website ?? undefined,
  rating: row.rating ?? 0,
  lat: row.lat ?? undefined,
  lng: row.lng ?? undefined,
});

const matchesLocalFilters = (business: Business, params: BusinessQuery) => {
  if ((params.minRating ?? 0) > 0 && business.rating < (params.minRating ?? 0)) {
    return false;
  }

  if (params.search && params.search.trim()) {
    const search = params.search.trim().toLowerCase();
    const searchableFields = [business.name, business.nameAr, business.nameKu, business.city, business.address]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (!searchableFields.includes(search)) {
      return false;
    }
  }

  return true;
};

const filterMockBusinesses = (params: BusinessQuery): Business[] => {
  return MOCK_BUSINESSES.filter((business) => {
    if (params.category && params.category !== 'all' && business.category !== params.category) {
      return false;
    }

    if (params.governorate && params.governorate !== 'all' && business.governorate !== params.governorate) {
      return false;
    }

    return matchesLocalFilters(business, params);
  });
};

const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const from = page * pageSize;
  const to = from + pageSize;
  return items.slice(from, to);
};

export const getBusinesses = async (params: BusinessQuery): Promise<BusinessQueryResult> => {
  const from = params.page * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from('directory')
    .select('id, name, name_ar, name_ku, category, subcategory, governorate, city, address, phone, whatsapp, website, rating, lat, lng', { count: 'exact' });

  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category);
  }

  if (params.governorate && params.governorate !== 'all') {
    query = query.eq('governorate', params.governorate);
  }

  const { data, count, error } = await query.range(from, to);

  if (error || !data || data.length === 0) {
    const filteredMock = filterMockBusinesses(params);
    return {
      businesses: paginate(filteredMock, params.page, params.pageSize),
      totalCount: filteredMock.length,
      usingMockData: true,
      error: error?.message ?? (data?.length === 0 ? 'No rows returned from Supabase. Falling back to mock data.' : null),
    };
  }

  const mapped = (data as DirectoryRow[]).map(mapDirectoryRowToBusiness).filter((business) => matchesLocalFilters(business, params));

  return {
    businesses: mapped,
    totalCount: count ?? data.length,
    usingMockData: false,
    error: null,
  };
};
