import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useRealtimeProducao() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-producao')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ordens_producao' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['producao'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
