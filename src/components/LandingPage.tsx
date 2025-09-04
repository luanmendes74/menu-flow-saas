import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, QrCode, Smartphone, TrendingUp, Clock, Users, Star, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-menu.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MenuDigital</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Recursos</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-smooth">Preços</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-smooth">Contato</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/auth'}>Entrar</Button>
            <Button variant="hero" onClick={() => window.location.href = '/auth'}>Começar Grátis</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-secondary text-secondary-foreground">
                  🚀 Plataforma SaaS Completa
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Transforme seu
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> restaurante </span>
                  com cardápios digitais
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Crie cardápios digitais profissionais, receba pedidos via QR code e gerencie seu estabelecimento com nossa plataforma completa.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg">
                  Experimentar Grátis
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  Ver Demonstração
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Restaurantes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50k+</div>
                  <div className="text-sm text-muted-foreground">Pedidos/mês</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9★</div>
                  <div className="text-sm text-muted-foreground">Avaliação</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-glow">
                <img 
                  src={heroImage} 
                  alt="Cardápio Digital em Tablet" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-card border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Pedido recebido!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary">Recursos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Tudo que você precisa para <span className="text-primary">digitalizar</span> seu restaurante
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma oferece todas as ferramentas necessárias para modernizar seu estabelecimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <QrCode className="h-12 w-12 text-primary mb-4" />
                <CardTitle>QR Codes por Mesa</CardTitle>
                <CardDescription>
                  Gere QR codes únicos para cada mesa automaticamente. Clientes fazem pedidos direto pelo celular.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Cardápio Responsivo</CardTitle>
                <CardDescription>
                  Interface otimizada para mobile com design profissional e navegação intuitiva.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Gestão de Pedidos</CardTitle>
                <CardDescription>
                  Acompanhe pedidos em tempo real com status automático e notificações instantâneas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Relatórios Avançados</CardTitle>
                <CardDescription>
                  Analytics completos com vendas, produtos mais pedidos e horários de pico.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Multi-usuário</CardTitle>
                <CardDescription>
                  Gerencie sua equipe com diferentes níveis de acesso e permissões personalizadas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Personalização Total</CardTitle>
                <CardDescription>
                  Customize cores, logo e layout para combinar com a identidade visual do seu estabelecimento.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-accent/10 text-accent">Planos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Escolha o plano ideal para seu <span className="text-accent">negócio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Planos flexíveis que crescem junto com seu estabelecimento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-card border-0 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Básico</CardTitle>
                <CardDescription>Ideal para começar</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">R$ 29</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>50 produtos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>10 mesas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>QR codes ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Suporte por email</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-primary border-2 relative bg-gradient-card">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Para estabelecimentos em crescimento</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">R$ 59</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>200 produtos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>50 mesas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Relatórios avançados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Suporte prioritário</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Delivery integrado</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="hero">
                  Assinar Premium
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>Para grandes operações</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">R$ 99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Produtos ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Mesas ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>API personalizada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>Suporte dedicado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>White label</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="accent">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Pronto para revolucionar seu restaurante?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Junte-se a centenas de estabelecimentos que já modernizaram seus cardápios com nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-lg">
                Começar Teste Grátis
              </Button>
              <Button variant="outline" size="lg" className="text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">MenuDigital</span>
              </div>
              <p className="text-muted-foreground">
                A plataforma completa para digitalizar seu restaurante e aumentar suas vendas.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produto</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Recursos</div>
                <div>Preços</div>
                <div>Integrações</div>
                <div>API</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Suporte</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Central de Ajuda</div>
                <div>Documentação</div>
                <div>Contato</div>
                <div>Status</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Empresa</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Sobre</div>
                <div>Blog</div>
                <div>Carreiras</div>
                <div>Privacidade</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MenuDigital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;