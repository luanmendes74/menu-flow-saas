import { useState } from "react";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import MenuInterface from "@/components/MenuInterface";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "menu" | "dashboard">("landing");

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
