export interface Plano {
  id: string;
  nome: string;
  preco_mensal: number;
  limite_produtos: number;
  limite_mesas: number;
  recursos: Record<string, any>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Estabelecimento {
  id: string;
  nome: string;
  subdominio: string;
  email: string;
  telefone?: string;
  endereco?: string;
  logo?: string;
  cor_primaria: string;
  cor_secundaria: string;
  plano_id?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  plano?: Plano;
}

export interface UsuarioEstabelecimento {
  id: string;
  estabelecimento_id: string;
  user_id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'funcionario';
  ativo: boolean;
  created_at: string;
  updated_at: string;
  estabelecimento?: Estabelecimento;
}

export interface Categoria {
  id: string;
  estabelecimento_id: string;
  nome: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Produto {
  id: string;
  estabelecimento_id: string;
  categoria_id?: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  disponivel: boolean;
  destaque: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  categoria?: Categoria;
}

export interface Mesa {
  id: string;
  estabelecimento_id: string;
  numero: string;
  qr_code: string;
  status: 'livre' | 'ocupada' | 'reservada';
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  id: string;
  estabelecimento_id: string;
  mesa_id?: string;
  tipo: 'mesa' | 'delivery';
  status: 'recebido' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  total: number;
  observacoes?: string;
  endereco_entrega?: string;
  telefone?: string;
  created_at: string;
  updated_at: string;
  mesa?: Mesa;
  itens?: PedidoItem[];
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  observacoes?: string;
  created_at: string;
  produto?: Produto;
}

export interface CartItem {
  produto: Produto;
  quantidade: number;
  observacoes?: string;
}