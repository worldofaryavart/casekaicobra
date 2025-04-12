'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/auth-js';

export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user); // data.user has type SupabaseUser | null
      setLoading(false);
    };

    getUser();
  }, []);

  return { user, loading };
}
