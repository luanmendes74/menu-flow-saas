import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Star, Clock, Users, MapPin } from "lucide-react";

const MenuInterface = () => {
  const [activeCategory, setActiveCategory] = useState("entradas");
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [cartOpen, setCartOpen] = useState(false);

  const categories = [
    { id: "entradas", name: "Entradas", icon: "🥗" },
    { id: "principais", name: "Pratos Principais", icon: "🍽️" },
    { id: "pizzas", name: "Pizzas", icon: "🍕" },
    { id: "bebidas", name: "Bebidas", icon: "🍹" },
    { id: "sobremesas", name: "Sobremesas", icon: "🍰" },
  ];

  const menuItems = {
    entradas: [
      {
        id: "1",
        name: "Bruschetta Italiana",
        description: "Pão italiano tostado com tomate, manjericão e azeite extra virgem",
        price: 18.90,
        image: "/placeholder.svg",
        popular: true,
        prepTime: "10-15 min"
      },
      {
        id: "2", 
        name: "Carpaccio de Salmão",
        description: "Fatias finas de salmão com alcaparras, limão siciliano e azeite",
        price: 32.90,
        image: "/placeholder.svg",
        prepTime: "5-10 min"
      }
    ],
    principais: [
      {
        id: "3",
        name: "Risotto de Camarão",
        description: "Risotto cremoso com camarões grandes, vinho branco e parmesão",
        price: 45.90,
        image: "/placeholder.svg",
        popular: true,
        prepTime: "25-30 min"
      },
      {
        id: "4",
        name: "Filé Mignon Grelhado", 
        description: "Filé mignon (250g) grelhado com molho de vinho tinto e legumes",
        price: 58.90,
        image: "/placeholder.svg",
        prepTime: "20-25 min"
      }
    ],
    pizzas: [
      {
        id: "5",
        name: "Pizza Margherita",
        description: "Molho de tomate, mussarela de búfala, manjericão fresco",
        price: 35.90,
        image: "/placeholder.svg",
        popular: true,
        prepTime: "15-20 min"
      }
    ],
    bebidas: [
      {
        id: "6",
        name: "Caipirinha Premium",
        description: "Cachaça artesanal, limão tahiti, açúcar demerara",
        price: 16.90,
        image: "/placeholder.svg",
        prepTime: "5 min"
      }
    ],
    sobremesas: [
      {
        id: "7",
        name: "Tiramisù da Casa",
        description: "Tradicional tiramisù italiano com café espresso e mascarpone",
        price: 22.90,
        image: "/placeholder.svg",
        popular: true,
        prepTime: "Pronto"
      }
    ]
  };

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = Object.values(menuItems).flat().find(item => item.id === itemId);
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Header */}
      <div className="bg-gradient-hero text-primary-foreground px-4 py-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍴</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Restaurante Bella Vista</h1>
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
                  <span>Mesa 05</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-primary-foreground/90">
            Culinária italiana autêntica com ingredientes frescos e receitas tradicionais da família.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-2">
              <h3 className="font-semibold text-lg mb-4">Categorias</h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-smooth flex items-center gap-3 ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {categories.find(c => c.id === activeCategory)?.name}
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
              {menuItems[activeCategory as keyof typeof menuItems]?.map((item) => (
                <Card key={item.id} className="shadow-card hover:shadow-elegant transition-smooth">
                  <div className="md:flex">
                    <div className="md:w-32 h-32 bg-muted rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
                      <div className="w-full h-full bg-gradient-card flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          {item.popular && (
                            <Badge className="bg-accent text-accent-foreground">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <div className="text-xl font-bold text-primary">
                          R$ {item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      <CardDescription className="mb-4">
                        {item.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{item.prepTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {cart[item.id] > 0 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {cart[item.id] > 0 && (
                            <span className="w-8 text-center font-medium">
                              {cart[item.id]}
                            </span>
                          )}
                          
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => addToCart(item.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
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
              {Object.entries(cart).filter(([_, quantity]) => quantity > 0).map(([itemId, quantity]) => {
                const item = Object.values(menuItems).flat().find(item => item.id === itemId);
                return item ? (
                  <div key={itemId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {quantity}x R$ {item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-medium">
                      R$ {(item.price * quantity).toFixed(2)}
                    </div>
                  </div>
                ) : null;
              })}
              
              <Separator />
              
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">R$ {getCartTotal().toFixed(2)}</span>
              </div>
              
              <Button className="w-full" variant="hero" size="lg">
                Finalizar Pedido
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MenuInterface;