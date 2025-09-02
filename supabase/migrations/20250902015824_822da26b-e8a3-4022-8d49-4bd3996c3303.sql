-- Create subscription plans table first
CREATE TABLE public.planos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  preco_mensal DECIMAL(10,2) NOT NULL,
  limite_produtos INTEGER NOT NULL,
  limite_mesas INTEGER NOT NULL,
  recursos JSONB DEFAULT '{}',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create establishments table (main tenant table)
CREATE TABLE public.estabelecimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  subdominio TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  logo TEXT,
  cor_primaria TEXT DEFAULT '#FF6B35',
  cor_secundaria TEXT DEFAULT '#F7931E',
  plano_id UUID REFERENCES public.planos(id),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create establishment users table
CREATE TABLE public.usuarios_estabelecimento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estabelecimento_id UUID NOT NULL REFERENCES public.estabelecimentos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'funcionario' CHECK (tipo IN ('admin', 'funcionario')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(estabelecimento_id, user_id)
);

-- Create categories table
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estabelecimento_id UUID NOT NULL REFERENCES public.estabelecimentos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estabelecimento_id UUID NOT NULL REFERENCES public.estabelecimentos(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem TEXT,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  destaque BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables/mesas table
CREATE TABLE public.mesas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estabelecimento_id UUID NOT NULL REFERENCES public.estabelecimentos(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'livre' CHECK (status IN ('livre', 'ocupada', 'reservada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(estabelecimento_id, numero)
);

-- Create orders table
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estabelecimento_id UUID NOT NULL REFERENCES public.estabelecimentos(id) ON DELETE CASCADE,
  mesa_id UUID REFERENCES public.mesas(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'mesa' CHECK (tipo IN ('mesa', 'delivery')),
  status TEXT NOT NULL DEFAULT 'recebido' CHECK (status IN ('recebido', 'preparando', 'pronto', 'entregue', 'cancelado')),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  endereco_entrega TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.pedido_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estabelecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_estabelecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for planos (public read access)
CREATE POLICY "Plans are viewable by everyone" ON public.planos FOR SELECT USING (ativo = true);

-- Create RLS policies for estabelecimentos
CREATE POLICY "Users can view their establishment" ON public.estabelecimentos FOR SELECT USING (
  id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their establishment" ON public.estabelecimentos FOR UPDATE USING (
  id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid() AND tipo = 'admin'
  )
);

-- Create RLS policies for usuarios_estabelecimento
CREATE POLICY "Users can view establishment users" ON public.usuarios_estabelecimento FOR SELECT USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

-- Create RLS policies for categorias
CREATE POLICY "Users can view their establishment categories" ON public.categorias FOR SELECT USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage categories" ON public.categorias FOR ALL USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid() AND tipo = 'admin'
  )
);

-- Create RLS policies for produtos
CREATE POLICY "Users can view their establishment products" ON public.produtos FOR SELECT USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage products" ON public.produtos FOR ALL USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid() AND tipo = 'admin'
  )
);

-- Create RLS policies for mesas
CREATE POLICY "Users can view their establishment tables" ON public.mesas FOR SELECT USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage tables" ON public.mesas FOR ALL USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid() AND tipo = 'admin'
  )
);

-- Create RLS policies for pedidos
CREATE POLICY "Users can view their establishment orders" ON public.pedidos FOR SELECT USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage orders" ON public.pedidos FOR ALL USING (
  estabelecimento_id IN (
    SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
    WHERE user_id = auth.uid()
  )
);

-- Create RLS policies for pedido_itens
CREATE POLICY "Users can view order items" ON public.pedido_itens FOR SELECT USING (
  pedido_id IN (
    SELECT id FROM public.pedidos 
    WHERE estabelecimento_id IN (
      SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can manage order items" ON public.pedido_itens FOR ALL USING (
  pedido_id IN (
    SELECT id FROM public.pedidos 
    WHERE estabelecimento_id IN (
      SELECT estabelecimento_id FROM public.usuarios_estabelecimento 
      WHERE user_id = auth.uid()
    )
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_estabelecimentos_updated_at BEFORE UPDATE ON public.estabelecimentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_usuarios_estabelecimento_updated_at BEFORE UPDATE ON public.usuarios_estabelecimento FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mesas_updated_at BEFORE UPDATE ON public.mesas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON public.planos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.planos (nome, preco_mensal, limite_produtos, limite_mesas, recursos) VALUES
('Básico', 29.00, 50, 10, '{"suporte": "email", "relatorios": "basicos"}'),
('Premium', 59.00, 200, 50, '{"suporte": "prioritario", "relatorios": "avancados", "analytics": true}'),
('Enterprise', 99.00, -1, -1, '{"suporte": "dedicado", "api": true, "customizacao": true, "relatorios": "completos"}');

-- Create indexes for better performance
CREATE INDEX idx_estabelecimentos_subdominio ON public.estabelecimentos(subdominio);
CREATE INDEX idx_usuarios_estabelecimento_user_id ON public.usuarios_estabelecimento(user_id);
CREATE INDEX idx_usuarios_estabelecimento_estabelecimento_id ON public.usuarios_estabelecimento(estabelecimento_id);
CREATE INDEX idx_produtos_estabelecimento_id ON public.produtos(estabelecimento_id);
CREATE INDEX idx_produtos_categoria_id ON public.produtos(categoria_id);
CREATE INDEX idx_categorias_estabelecimento_id ON public.categorias(estabelecimento_id);
CREATE INDEX idx_mesas_estabelecimento_id ON public.mesas(estabelecimento_id);
CREATE INDEX idx_mesas_qr_code ON public.mesas(qr_code);
CREATE INDEX idx_pedidos_estabelecimento_id ON public.pedidos(estabelecimento_id);
CREATE INDEX idx_pedidos_mesa_id ON public.pedidos(mesa_id);
CREATE INDEX idx_pedido_itens_pedido_id ON public.pedido_itens(pedido_id);