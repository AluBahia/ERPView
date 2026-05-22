import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useRealtimeEstoque() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-estoque')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'itens_estoque' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['estoque'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
