import { vi } from 'vitest';

const createQueryBuilder = () => {
  const builder: any = {
    select: vi.fn().mockImplementation(() => builder),
    insert: vi.fn().mockImplementation(() => builder),
    update: vi.fn().mockImplementation(() => builder),
    delete: vi.fn().mockImplementation(() => builder),
    eq: vi.fn().mockImplementation(() => builder),
    limit: vi.fn().mockImplementation(() => builder),
    order: vi.fn().mockImplementation(() => builder),
    single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
    then: vi.fn().mockImplementation((onfulfilled) => {
      return Promise.resolve({ data: [], error: null }).then(onfulfilled);
    }),
  };
  return builder;
};

export const mockSupabaseClient = {
  from: vi.fn().mockImplementation(() => createQueryBuilder()),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
};

// Mock standard package exports
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

// Mock internal lib file
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

