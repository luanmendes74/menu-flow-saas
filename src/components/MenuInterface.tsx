import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Minus, Star, Clock, Users, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEstabelecimento } from "@/hooks/useEstabelecimento";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "@/types/database";

const MenuInterface = () => {
  const { user } = useAuth();
  const { userEstabelecimento } = useAuth();
  const estabelecimentoId = userEstabelecimento?.estabelecimento_id || "demo";
  const { produtos, categorias, mesas, estabelecimento, createPedido } = useEstabelecimento(estabelecimentoId);
  
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<string>("");
  const [observacoes, setObservacoes] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"mesa" | "delivery">("mesa");

  // Set first category as active when categories load
  useEffect(() => {
    if (categorias.length > 0 && !activeCategory) {
      setActiveCategory(categorias[0].id);
    }
  }, [categorias, activeCategory]);

  const addToCart = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    setCart(prev => {
      const existingItem = prev.find(item => item.produto.id === produtoId);
      if (existingItem) {
        return prev.map(item =>
          item.produto.id === produtoId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prev, { produto, quantidade: 1 }];
      }
    });
  };

  const removeFromCart = (produtoId: string) => {
    setCart(prev => {
      return prev.map(item =>
        item.produto.id === produtoId
          ? { ...item, quantidade: Math.max(item.quantidade - 1, 0) }
          : item
      ).filter(item => item.quantidade > 0);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantidade, 0);
  };

  const handleFinalizarPedido = async () => {
    if (cart.length === 0) return;

    if (tipoEntrega === "mesa" && !selectedMesa) {
      toast({
        title: "Mesa obrigatória",
        description: "Selecione uma mesa para finalizar o pedido.",
        variant: "destructive",
      });
      return;
    }

    if (tipoEntrega === "delivery" && (!telefone || !enderecoEntrega)) {
      toast({
        title: "Dados obrigatórios",
        description: "Preencha telefone e endereço para delivery.",
        variant: "destructive",
      });
      return;
    }

    const pedidoData = {
      estabelecimento_id: estabelecimentoId,
      mesa_id: tipoEntrega === "mesa" ? selectedMesa : null,
      tipo: tipoEntrega,
      total: getCartTotal(),
      observacoes,
      telefone: tipoEntrega === "delivery" ? telefone : null,
      endereco_entrega: tipoEntrega === "delivery" ? enderecoEntrega : null,
      status: "recebido" as const,
    };

    const { data: pedido, error } = await createPedido(pedidoData);

    if (error || !pedido) {
      toast({
        title: "Erro ao criar pedido",
        description: error?.message || "Tente novamente",
        variant: "destructive",
      });
      return;
    }

    // Create order items
    for (const item of cart) {
      // Here you would typically create pedido_itens via another API call
      // For now, we'll just show success
    }

    toast({
      title: "Pedido realizado!",
      description: `Pedido #${pedido.id.slice(-8)} criado com sucesso.`,
    });

    // Reset cart and close modals
    setCart([]);
    setCartOpen(false);
    setCheckoutOpen(false);
    setObservacoes("");
    setTelefone("");
    setEnderecoEntrega("");
    setSelectedMesa("");
  };

  // Use demo data if no products from database
  const displayCategories = categorias.length > 0 ? categorias : [
    { id: "entradas", nome: "Entradas", estabelecimento_id: "demo", descricao: null, ordem: 1, ativo: true, created_at: "", updated_at: "" },
    { id: "principais", nome: "Pratos Principais", estabelecimento_id: "demo", descricao: null, ordem: 2, ativo: true, created_at: "", updated_at: "" },
    { id: "pizzas", nome: "Pizzas", estabelecimento_id: "demo", descricao: null, ordem: 3, ativo: true, created_at: "", updated_at: "" },
    { id: "bebidas", nome: "Bebidas", estabelecimento_id: "demo", descricao: null, ordem: 4, ativo: true, created_at: "", updated_at: "" },
    { id: "sobremesas", nome: "Sobremesas", estabelecimento_id: "demo", descricao: null, ordem: 5, ativo: true, created_at: "", updated_at: "" },
  ];

  const displayProdutos = produtos.length > 0 ? produtos : [
    {
      id: "1", nome: "Bruschetta Italiana", descricao: "Pão italiano tostado com tomate, manjericão e azeite extra virgem",
      preco: 18.90, categoria_id: "entradas", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: true, ordem: 1, created_at: "", updated_at: ""
    },
    {
      id: "2", nome: "Carpaccio de Salmão", descricao: "Fatias finas de salmão com alcaparras, limão siciliano e azeite",
      preco: 32.90, categoria_id: "entradas", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: false, ordem: 2, created_at: "", updated_at: ""
    },
    {
      id: "3", nome: "Risotto de Camarão", descricao: "Risotto cremoso com camarões grandes, vinho branco e parmesão",
      preco: 45.90, categoria_id: "principais", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: true, ordem: 1, created_at: "", updated_at: ""
    },
    {
      id: "4", nome: "Filé Mignon Grelhado", descricao: "Filé mignon (250g) grelhado com molho de vinho tinto e legumes",
      preco: 58.90, categoria_id: "principais", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: false, ordem: 2, created_at: "", updated_at: ""
    },
    {
      id: "5", nome: "Pizza Margherita", descricao: "Molho de tomate, mussarela de búfala, manjericão fresco",
      preco: 35.90, categoria_id: "pizzas", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: true, ordem: 1, created_at: "", updated_at: ""
    },
    {
      id: "6", nome: "Caipirinha Premium", descricao: "Cachaça artesanal, limão tahiti, açúcar demerara",
      preco: 16.90, categoria_id: "bebidas", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: false, ordem: 1, created_at: "", updated_at: ""
    },
    {
      id: "7", nome: "Tiramisù da Casa", descricao: "Tradicional tiramisù italiano com café espresso e mascarpone",
      preco: 22.90, categoria_id: "sobremesas", estabelecimento_id: "demo", imagem: null, disponivel: true, destaque: true, ordem: 1, created_at: "", updated_at: ""
    }
  ];

  const filteredProdutos = displayProdutos.filter(produto => produto.categoria_id === activeCategory && produto.disponivel);

  const restaurantName = estabelecimento?.nome || "Restaurante Bella Vista";

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Header */}
      <div className="bg-gradient-hero text-primary-foreground px-4 py-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild className="text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍴</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{restaurantName}</h1>
              <div className="flex items-center gap-4 text-primary-foreground/90 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.8</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>25-35 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Delivery disponível</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-primary-foreground/90">
            {estabelecimento?.endereco || "Culinária italiana autêntica com ingredientes frescos e receitas tradicionais da família."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-2">
              <h3 className="font-semibold text-lg mb-4">Categorias</h3>
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-smooth flex items-center gap-3 ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="text-xl">🍽️</span>
                  <span className="font-medium">{category.nome}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {displayCategories.find(c => c.id === activeCategory)?.nome}
              </h2>
              <Button
                onClick={() => setCartOpen(!cartOpen)}
                variant="hero"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                Carrinho
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredProdutos.map((produto) => {
                const cartItem = cart.find(item => item.produto.id === produto.id);
                const quantity = cartItem?.quantidade || 0;
                
                return (
                  <Card key={produto.id} className="shadow-card hover:shadow-elegant transition-smooth">
                    <div className="md:flex">
                      <div className="md:w-32 h-32 bg-muted rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
                        {produto.imagem ? (
                          <img 
                            src={produto.imagem} 
                            alt={produto.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-card flex items-center justify-center text-4xl">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{produto.nome}</CardTitle>
                            {produto.destaque && (
                              <Badge className="bg-accent text-accent-foreground">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <div className="text-xl font-bold text-primary">
                            R$ {produto.preco.toFixed(2)}
                          </div>
                        </div>
                        
                        <CardDescription className="mb-4">
                          {produto.descricao}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>15-20 min</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {quantity > 0 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeFromCart(produto.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {quantity > 0 && (
                              <span className="w-8 text-center font-medium">
                                {quantity}
                              </span>
                            )}
                            
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => addToCart(produto.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      {cartOpen && getCartItemCount() > 0 && (
        <div className="fixed bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="shadow-glow border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Seu Pedido</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.produto.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{item.produto.nome}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantidade}x R$ {item.produto.preco.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium">
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">R$ {getCartTotal().toFixed(2)}</span>
              </div>
              
              <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="hero" size="lg">
                    Finalizar Pedido
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Finalizar Pedido</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de Entrega</Label>
                      <Select value={tipoEntrega} onValueChange={(value: "mesa" | "delivery") => setTipoEntrega(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mesa">Mesa</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {tipoEntrega === "mesa" && (
                      <div className="space-y-2">
                        <Label>Mesa</Label>
                        <Select value={selectedMesa} onValueChange={setSelectedMesa}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma mesa" />
                          </SelectTrigger>
                          <SelectContent>
                            {mesas.filter(mesa => mesa.status === "livre").map((mesa) => (
                              <SelectItem key={mesa.id} value={mesa.id}>
                                Mesa {mesa.numero}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {tipoEntrega === "delivery" && (
                      <>
                        <div className="space-y-2">
                          <Label>Telefone</Label>
                          <Input
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Endereço de Entrega</Label>
                          <Textarea
                            value={enderecoEntrega}
                            onChange={(e) => setEnderecoEntrega(e.target.value)}
                            placeholder="Rua, número, complemento, bairro, cidade"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>Observações (opcional)</Label>
                      <Textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Observações sobre o pedido..."
                      />
                    </div>

                    <Separator />
                    
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">R$ {getCartTotal().toFixed(2)}</span>
                    </div>

                    <Button onClick={handleFinalizarPedido} className="w-full" variant="hero" size="lg">
                      Confirmar Pedido
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MenuInterface;