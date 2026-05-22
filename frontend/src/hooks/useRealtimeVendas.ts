import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useRealtimeVendas() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-vendas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos_venda' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vendas'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
