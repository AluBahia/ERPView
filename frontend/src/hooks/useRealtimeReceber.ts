import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useRealtimeReceber() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-receber')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'titulos_receber' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['receber'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
