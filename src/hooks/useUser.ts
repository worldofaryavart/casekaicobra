'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/auth-js';
import { useRouter } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial user state
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
        setLoading(false);
        
        // Refresh the router to update page content
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          router.refresh();
        }
        if (event === 'SIGNED_OUT') {
          router.refresh();
          router.push('/login');
        }
      }
    );

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return { user, loading };
}