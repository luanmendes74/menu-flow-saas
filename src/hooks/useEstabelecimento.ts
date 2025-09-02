import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Estabelecimento, Produto, Categoria, Mesa, Pedido } from '@/types/database';

export const useEstabelecimento = (estabelecimentoId?: string) => {
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (estabelecimentoId) {
      fetchEstabelecimento();
      fetchProdutos();
      fetchCategorias();
      fetchMesas();
      fetchPedidos();
    }
  }, [estabelecimentoId]);

  const fetchEstabelecimento = async () => {
    if (!estabelecimentoId) return;

    try {
      const { data, error } = await supabase
        .from('estabelecimentos')
        .select('*, plano:planos(*)')
        .eq('id', estabelecimentoId)
        .single();

      if (error) throw error;
      setEstabelecimento(data as Estabelecimento);
    } catch (error) {
      console.error('Error fetching estabelecimento:', error);
    }
  };

  const fetchProdutos = async () => {
    if (!estabelecimentoId) return;

    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*, categoria:categorias(*)')
        .eq('estabelecimento_id', estabelecimentoId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setProdutos((data || []) as Produto[]);
    } catch (error) {
      console.error('Error fetching produtos:', error);
    }
  };

  const fetchCategorias = async () => {
    if (!estabelecimentoId) return;

    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('estabelecimento_id', estabelecimentoId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setCategorias((data || []) as Categoria[]);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchMesas = async () => {
    if (!estabelecimentoId) return;

    try {
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .eq('estabelecimento_id', estabelecimentoId)
        .order('numero', { ascending: true });

      if (error) throw error;
      setMesas((data || []) as Mesa[]);
    } catch (error) {
      console.error('Error fetching mesas:', error);
    }
  };

  const fetchPedidos = async () => {
    if (!estabelecimentoId) return;

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          mesa:mesas(*),
          itens:pedido_itens(*, produto:produtos(*))
        `)
        .eq('estabelecimento_id', estabelecimentoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos((data || []) as Pedido[]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      setLoading(false);
    }
  };

  const createProduto = async (produto: Omit<Produto, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([produto])
        .select()
        .single();

      if (error) throw error;
      await fetchProdutos();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating produto:', error);
      return { data: null, error };
    }
  };

  const updateProduto = async (id: string, updates: Partial<Produto>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProdutos();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating produto:', error);
      return { data: null, error };
    }
  };

  const deleteProduto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProdutos();
      return { error: null };
    } catch (error) {
      console.error('Error deleting produto:', error);
      return { error };
    }
  };

  const createPedido = async (pedido: Omit<Pedido, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert([pedido])
        .select()
        .single();

      if (error) throw error;
      await fetchPedidos();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating pedido:', error);
      return { data: null, error };
    }
  };

  const updatePedidoStatus = async (id: string, status: Pedido['status']) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPedidos();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating pedido status:', error);
      return { data: null, error };
    }
  };

  return {
    estabelecimento,
    produtos,
    categorias,
    mesas,
    pedidos,
    loading,
    createProduto,
    updateProduto,
    deleteProduto,
    createPedido,
    updatePedidoStatus,
    refetch: {
      estabelecimento: fetchEstabelecimento,
      produtos: fetchProdutos,
      categorias: fetchCategorias,
      mesas: fetchMesas,
      pedidos: fetchPedidos
    }
  };
};