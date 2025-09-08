import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Página não encontrada</p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Navegue para:</p>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="default">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/menu">Cardápio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
