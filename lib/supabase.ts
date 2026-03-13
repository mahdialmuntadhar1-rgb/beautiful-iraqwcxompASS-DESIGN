type SelectOptions = {
  count?: 'exact';
  head?: boolean;
};

type QueryResponse<T> = {
  data: T[] | null;
  error: { message: string } | null;
  count: number | null;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const authHeaders = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
};

class QueryBuilder<T extends object> {
  private filters: string[] = [];
  private selected = '*';
  private withCount = false;
  private headOnly = false;
  private fromIndex: number | null = null;
  private toIndex: number | null = null;

  constructor(private table: string) {}

  select(columns: string, options?: SelectOptions) {
    this.selected = columns;
    this.withCount = options?.count === 'exact';
    this.headOnly = !!options?.head;
    return this;
  }

  eq(column: string, value: string | number) {
    this.filters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(String(value))}`);
    return this;
  }

  neq(column: string, value: string | number) {
    this.filters.push(`${encodeURIComponent(column)}=neq.${encodeURIComponent(String(value))}`);
    return this;
  }

  not(column: string, operator: 'is', value: null) {
    this.filters.push(`${encodeURIComponent(column)}=not.${operator}.${value === null ? 'null' : encodeURIComponent(String(value))}`);
    return this;
  }

  range(from: number, to: number) {
    this.fromIndex = from;
    this.toIndex = to;
    return this.execute();
  }

  async then<TResult1 = QueryResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResponse<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResponse<T>> {
    const search = new URLSearchParams();
    search.set('select', this.selected);

    for (const filter of this.filters) {
      const [key, value] = filter.split('=');
      if (key && value) {
        search.set(decodeURIComponent(key), decodeURIComponent(value));
      }
    }

    const headers: Record<string, string> = {
      ...authHeaders,
      'Content-Type': 'application/json',
    };

    if (this.withCount) {
      headers.Prefer = 'count=exact';
    }

    if (this.fromIndex !== null && this.toIndex !== null) {
      headers.Range = `${this.fromIndex}-${this.toIndex}`;
    }

    const method = this.headOnly ? 'HEAD' : 'GET';
    const response = await fetch(`${supabaseUrl}/rest/v1/${this.table}?${search.toString()}`, {
      method,
      headers,
    });

    if (!response.ok) {
      return {
        data: null,
        error: { message: `Supabase request failed (${response.status})` },
        count: null,
      };
    }

    const countHeader = response.headers.get('content-range');
    const count = countHeader ? Number(countHeader.split('/')[1]) : null;
    const data = this.headOnly ? [] : ((await response.json()) as T[]);

    return {
      data,
      error: null,
      count,
    };
  }
}

const createClient = (url: string, anonKey: string) => {
  void url;
  void anonKey;

  return {
    from<T extends object>(table: string) {
      return new QueryBuilder<T>(table);
    },
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
