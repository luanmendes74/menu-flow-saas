import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@/components/LandingPage";
import MenuInterface from "@/components/MenuInterface";
import Dashboard from "@/components/Dashboard";
import AuthPage from "@/components/AuthPage";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "menu" | "dashboard" | "auth">("landing");
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check URL for auth route
    if (window.location.pathname === '/auth') {
      setCurrentView("auth");
    } else if (user) {
      setCurrentView("dashboard");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (currentView === "auth") {
    return <AuthPage />;
  }

  if (currentView === "menu") {
    return <MenuInterface />;
  }

  if (currentView === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div className="relative">
      <LandingPage />
      
      {/* Demo Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg shadow-elegant p-2 flex gap-2 z-50">
        <Button 
          variant={currentView === "landing" ? "default" : "outline"} 
          size="sm"
          onClick={() => setCurrentView("landing")}
        >
          Landing
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setCurrentView("menu")}
        >
          Cardápio
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
