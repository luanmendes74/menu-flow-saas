import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UsuarioEstabelecimento } from '@/types/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userEstabelecimento, setUserEstabelecimento] = useState<UsuarioEstabelecimento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user establishment data with setTimeout to prevent deadlock
          setTimeout(() => {
            if (isMounted) {
              fetchUserEstabelecimento(session.user.id);
            }
          }, 0);
        } else {
          setUserEstabelecimento(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserEstabelecimento(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserEstabelecimento = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios_estabelecimento')
        .select(`
          *,
          estabelecimento:estabelecimentos(*)
        `)
        .eq('user_id', userId)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Error fetching user establishment:', error);
        return;
      }

      setUserEstabelecimento(data as UsuarioEstabelecimento);
    } catch (error) {
      console.error('Error fetching user establishment:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUserEstabelecimento(null);
    return { error };
  };

  return {
    user,
    session,
    userEstabelecimento,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session,
    isAdmin: userEstabelecimento?.tipo === 'admin'
  };
};