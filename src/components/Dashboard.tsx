import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  MoreVertical
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Receita do Mês",
      value: "R$ 12.847",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Pedidos Hoje",
      value: "34",
      change: "+8%", 
      trend: "up",
      icon: ShoppingBag,
      color: "text-accent"
    },
    {
      title: "Ticket Médio",
      value: "R$ 45.80",
      change: "+5%",
      trend: "up", 
      icon: TrendingUp,
      color: "text-secondary"
    },
    {
      title: "Mesas Ativas",
      value: "8/12",
      change: "67%",
      trend: "neutral",
      icon: Users,
      color: "text-muted-foreground"
    }
  ];

  const recentOrders = [
    {
      id: "#001",
      table: "Mesa 05",
      items: "2x Pizza Margherita, 1x Caipirinha",
      total: "R$ 68.70",
      status: "preparing",
      time: "há 5 min"
    },
    {
      id: "#002", 
      table: "Mesa 03",
      items: "1x Risotto Camarão, 1x Tiramisù",
      total: "R$ 68.80", 
      status: "ready",
      time: "há 8 min"
    },
    {
      id: "#003",
      table: "Mesa 12", 
      items: "1x Filé Mignon, 2x Bebidas",
      total: "R$ 92.70",
      status: "delivered",
      time: "há 15 min"
    },
    {
      id: "#004",
      table: "Delivery",
      items: "3x Bruschetta, 1x Carpaccio", 
      total: "R$ 89.60",
      status: "new",
      time: "há 2 min"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "preparing": return "bg-yellow-500";
      case "ready": return "bg-green-500";
      case "delivered": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "Novo";
      case "preparing": return "Preparando";
      case "ready": return "Pronto";
      case "delivered": return "Entregue";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Restaurante Bella Vista</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="hero">
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
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
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
                    <Button className="w-full justify-start" variant="outline">
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
                        <span>48/200</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mesas</span>
                        <span>12/50</span>
                      </div>
                      <Progress value={24} className="h-2" />
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
              {["new", "preparing", "ready", "delivered"].map((status) => (
                <Card key={status} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                      {getStatusText(status)}
                      <Badge variant="outline" className="ml-auto">
                        {recentOrders.filter(order => order.status === status).length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentOrders
                      .filter(order => order.status === status)
                      .map((order) => (
                        <div key={order.id} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{order.id}</span>
                            <span className="text-xs text-muted-foreground">{order.time}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{order.table}</div>
                          <div className="text-xs text-muted-foreground">{order.items}</div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{order.total}</span>
                            <Button size="sm" variant="outline">
                              {status === "new" && "Aceitar"}
                              {status === "preparing" && "Pronto"}
                              {status === "ready" && "Entregar"}
                              {status === "delivered" && "Ver"}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Cardápio</h2>
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>

            <div className="grid gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Estatísticas do Cardápio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">48</div>
                      <div className="text-sm text-muted-foreground">Total de Produtos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-muted-foreground">Categorias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Produtos Populares</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">Fora de Estoque</div>
                    </div>
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
              {Array.from({ length: 12 }, (_, i) => i + 1).map((tableNumber) => (
                <Card key={tableNumber} className="shadow-card">
                  <CardContent className="p-6 text-center">
                    <div className="text-xl font-bold mb-2">Mesa {tableNumber.toString().padStart(2, '0')}</div>
                    <Badge 
                      className={
                        tableNumber <= 8 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-gray-500/10 text-gray-500"
                      }
                    >
                      {tableNumber <= 8 ? "Ocupada" : "Livre"}
                    </Badge>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver QR Code
                      </Button>
                      {tableNumber <= 8 && (
                        <Button variant="destructive" size="sm" className="w-full">
                          Liberar Mesa
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    <div className="flex justify-between items-center">
                      <span>Pizza Margherita</span>
                      <Badge>89 vendas</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Risotto de Camarão</span>
                      <Badge>67 vendas</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tiramisù da Casa</span>
                      <Badge>54 vendas</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;