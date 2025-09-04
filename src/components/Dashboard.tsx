import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useEstabelecimento } from "@/hooks/useEstabelecimento";
import { toast } from "@/hooks/use-toast";
import ProductModal from "./ProductModal";
import OrderModal from "./OrderModal";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  QrCode,
  Plus,
  Settings,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { user, userEstabelecimento, signOut } = useAuth();
  const {
    estabelecimento,
    produtos,
    categorias,
    mesas,
    pedidos,
    loading,
    createProduto,
    updateProduto,
    deleteProduto,
    updatePedidoStatus,
  } = useEstabelecimento(userEstabelecimento?.estabelecimento_id);

  useEffect(() => {
    if (!user) {
      // Redirect to auth page
      window.location.href = '/auth';
    }
  }, [user]);

  // Calculate real stats from data
  const todayOrders = pedidos.filter(p => {
    const today = new Date();
    const orderDate = new Date(p.created_at);
    return orderDate.toDateString() === today.toDateString();
  });

  const thisMonthOrders = pedidos.filter(p => {
    const now = new Date();
    const orderDate = new Date(p.created_at);
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  });

  const monthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const ticketMedio = todayOrders.length > 0 ? todayOrders.reduce((sum, order) => sum + Number(order.total), 0) / todayOrders.length : 0;
  const mesasOcupadas = pedidos.filter(p => p.status !== 'entregue' && p.status !== 'cancelado' && p.mesa_id).length;

  const stats = [
    {
      title: "Receita do Mês",
      value: `R$ ${monthRevenue.toFixed(2)}`,
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Pedidos Hoje",
      value: todayOrders.length.toString(),
      change: "+8%", 
      trend: "up",
      icon: ShoppingBag,
      color: "text-accent"
    },
    {
      title: "Ticket Médio",
      value: `R$ ${ticketMedio.toFixed(2)}`,
      change: "+5%",
      trend: "up", 
      icon: TrendingUp,
      color: "text-secondary"
    },
    {
      title: "Mesas Ativas",
      value: `${mesasOcupadas}/${mesas.length}`,
      change: `${Math.round((mesasOcupadas / Math.max(mesas.length, 1)) * 100)}%`,
      trend: "neutral",
      icon: Users,
      color: "text-muted-foreground"
    }
  ];

  const recentOrders = pedidos.slice(0, 4).map(order => {
    const createdAt = new Date(order.created_at);
    const timeAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60));
    const itemsText = order.itens?.slice(0, 2).map(item => 
      `${item.quantidade}x ${item.produto?.nome}`
    ).join(', ') + (order.itens && order.itens.length > 2 ? '...' : '');

    return {
      id: `#${order.id.slice(-3)}`,
      table: order.mesa ? `Mesa ${order.mesa.numero}` : "Delivery",
      items: itemsText || "Sem itens",
      total: `R$ ${order.total.toFixed(2)}`,
      status: order.status,
      time: `há ${timeAgo} min`,
      originalOrder: order
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recebido": return "bg-blue-500";
      case "preparando": return "bg-yellow-500";
      case "pronto": return "bg-green-500";
      case "entregue": return "bg-gray-500";
      case "cancelado": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "recebido": return "Novo";
      case "preparando": return "Preparando";
      case "pronto": return "Pronto";
      case "entregue": return "Entregue";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  const handleProductSave = async (productData: any) => {
    if (selectedProduct) {
      return await updateProduto(selectedProduct.id, productData);
    } else {
      return await createProduto(productData);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const { error } = await deleteProduto(productId);
      if (error) {
        toast({
          title: "Erro ao excluir produto",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso.",
        });
      }
    }
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order.originalOrder);
    setOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">{estabelecimento?.nome || "Carregando..."}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => signOut()}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="hero"
                onClick={() => {
                  setSelectedProduct(null);
                  setProductModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="menu">Cardápio</TabsTrigger>
            <TabsTrigger value="tables">Mesas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={stat.trend === "up" ? "text-accent" : "text-muted-foreground"}>
                        {stat.change}
                      </span>{" "}
                      em relação ao mês anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Pedidos Recentes</CardTitle>
                    <CardDescription>
                      Acompanhe os últimos pedidos em tempo real
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                        onClick={() => handleOrderClick(order)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                          <div>
                            <div className="font-medium">{order.id} - {order.table}</div>
                            <div className="text-sm text-muted-foreground">{order.items}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{order.total}</div>
                          <div className="text-sm text-muted-foreground">
                            {getStatusText(order.status)} • {order.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null);
                        setProductModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      Gerar QR Code
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Button>
                  </CardContent>
                </Card>

                {/* Plan Usage */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Uso do Plano</CardTitle>
                    <CardDescription>Plano Premium</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Produtos</span>
                        <span>{produtos.length}/200</span>
                      </div>
                      <Progress value={(produtos.length / 200) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mesas</span>
                        <span>{mesas.length}/50</span>
                      </div>
                      <Progress value={(mesas.length / 50) * 100} className="h-2" />
                    </div>
                    <Button variant="hero" size="sm" className="w-full">
                      Upgrade do Plano
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
              <div className="flex gap-2">
                <Badge className="bg-blue-500/10 text-blue-500">4 Novos</Badge>
                <Badge className="bg-yellow-500/10 text-yellow-500">3 Preparando</Badge>
                <Badge className="bg-green-500/10 text-green-500">2 Prontos</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["recebido", "preparando", "pronto", "entregue"].map((status) => (
                <Card key={status} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                      {getStatusText(status)}
                      <Badge variant="outline" className="ml-auto">
                        {pedidos.filter(order => order.status === status).length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pedidos
                      .filter(order => order.status === status)
                      .slice(0, 3)
                      .map((order) => {
                        const createdAt = new Date(order.created_at);
                        const timeAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60));
                        return (
                          <div 
                            key={order.id} 
                            className="p-3 border rounded-lg space-y-2 cursor-pointer hover:bg-muted/50"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOrderModalOpen(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">#{order.id.slice(-3)}</span>
                              <span className="text-xs text-muted-foreground">há {timeAgo} min</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.mesa ? `Mesa ${order.mesa.numero}` : "Delivery"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.itens?.length || 0} itens
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">R$ {order.total.toFixed(2)}</span>
                              <Button size="sm" variant="outline">
                                Ver
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Cardápio</h2>
              <Button 
                variant="hero"
                onClick={() => {
                  setSelectedProduct(null);
                  setProductModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>

            <div className="grid gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Estatísticas do Cardápio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{produtos.length}</div>
                      <div className="text-sm text-muted-foreground">Total de Produtos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{categorias.length}</div>
                      <div className="text-sm text-muted-foreground">Categorias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{produtos.filter(p => p.destaque).length}</div>
                      <div className="text-sm text-muted-foreground">Produtos em Destaque</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{produtos.filter(p => !p.disponivel).length}</div>
                      <div className="text-sm text-muted-foreground">Indisponíveis</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Lista de Produtos</CardTitle>
                  <CardDescription>
                    Gerencie todos os produtos do seu cardápio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {produtos.map((produto) => (
                      <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            {produto.imagem ? (
                              <img 
                                src={produto.imagem} 
                                alt={produto.nome}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-2xl">🍽️</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{produto.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {produto.categoria?.nome || "Sem categoria"}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={produto.disponivel ? "default" : "secondary"}>
                                {produto.disponivel ? "Disponível" : "Indisponível"}
                              </Badge>
                              {produto.destaque && (
                                <Badge variant="outline">Destaque</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold text-lg">R$ {produto.preco.toFixed(2)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(produto);
                                setProductModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteProduct(produto.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {produtos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Mesas</h2>
              <Button variant="hero">
                <QrCode className="h-4 w-4" />
                Gerar QR Codes
              </Button>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mesas.map((mesa) => {
                const isOccupied = pedidos.some(p => 
                  p.mesa_id === mesa.id && 
                  p.status !== 'entregue' && 
                  p.status !== 'cancelado'
                );
                
                return (
                  <Card key={mesa.id} className="shadow-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-xl font-bold mb-2">Mesa {mesa.numero}</div>
                      <Badge 
                        className={
                          isOccupied
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-gray-500/10 text-gray-500"
                        }
                      >
                        {isOccupied ? "Ocupada" : "Livre"}
                      </Badge>
                      <div className="mt-4 space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver QR Code
                        </Button>
                        {isOccupied && (
                          <Button variant="destructive" size="sm" className="w-full">
                            Liberar Mesa
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {mesas.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhuma mesa cadastrada no sistema.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Vendas por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Gráfico de vendas seria exibido aqui</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {produtos.slice(0, 5).map((produto, index) => (
                      <div key={produto.id} className="flex justify-between items-center">
                        <span>{produto.nome}</span>
                        <Badge>{Math.floor(Math.random() * 100)} vendas</Badge>
                      </div>
                    ))}
                    {produtos.length === 0 && (
                      <div className="text-center text-muted-foreground">
                        Nenhum produto para exibir
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ProductModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        product={selectedProduct}
        categories={categorias}
        estabelecimentoId={userEstabelecimento?.estabelecimento_id || ""}
        onSave={handleProductSave}
      />

      <OrderModal
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        order={selectedOrder}
        onUpdateStatus={updatePedidoStatus}
      />
    </div>
  );
};

export default Dashboard;