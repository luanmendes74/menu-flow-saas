import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pedido } from "@/types/database";
import { Clock, MapPin, Phone } from "lucide-react";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Pedido | null;
  onUpdateStatus: (id: string, status: Pedido['status']) => Promise<any>;
}

const OrderModal = ({ 
  open, 
  onOpenChange, 
  order,
  onUpdateStatus 
}: OrderModalProps) => {
  const [newStatus, setNewStatus] = useState<Pedido['status']>('recebido');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.status) return;
    
    setLoading(true);
    try {
      const { error } = await onUpdateStatus(order.id, newStatus);
      
      if (error) {
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Status atualizado",
          description: "O status do pedido foi atualizado com sucesso.",
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recebido": return "bg-blue-500/10 text-blue-500";
      case "preparando": return "bg-yellow-500/10 text-yellow-500";
      case "pronto": return "bg-green-500/10 text-green-500";
      case "entregue": return "bg-gray-500/10 text-gray-500";
      case "cancelado": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "recebido": return "Recebido";
      case "preparando": return "Preparando";
      case "pronto": return "Pronto";
      case "entregue": return "Entregue";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  if (!order) return null;

  const createdAt = new Date(order.created_at);
  const timeAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido #{order.id.slice(-8)}</span>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>há {timeAgo} min</span>
            </div>
            {order.mesa && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Mesa {order.mesa.numero}</span>
              </div>
            )}
            {order.telefone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{order.telefone}</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-semibold mb-3">Itens do Pedido</h4>
            <div className="space-y-2">
              {order.itens?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.produto?.nome}</div>
                    {item.observacoes && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Obs: {item.observacoes}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Qtd</div>
                    <div className="font-medium">{item.quantidade}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      R$ {item.preco_unitario.toFixed(2)} cada
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Tipo do Pedido</h4>
              <Badge variant="outline">
                {order.tipo === 'mesa' ? 'Mesa' : 'Delivery'}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Total</h4>
              <div className="text-2xl font-bold text-primary">
                R$ {order.total.toFixed(2)}
              </div>
            </div>
          </div>

          {order.endereco_entrega && (
            <div>
              <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
              <p className="text-muted-foreground">{order.endereco_entrega}</p>
            </div>
          )}

          {order.observacoes && (
            <div>
              <h4 className="font-semibold mb-2">Observações</h4>
              <p className="text-muted-foreground">{order.observacoes}</p>
            </div>
          )}

          <Separator />

          {/* Status Update */}
          <div className="space-y-4">
            <h4 className="font-semibold">Atualizar Status</h4>
            <div className="flex items-center gap-4">
              <Select
                value={newStatus}
                onValueChange={(value: Pedido['status']) => setNewStatus(value)}
                disabled={loading}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recebido">Recebido</SelectItem>
                  <SelectItem value="preparando">Preparando</SelectItem>
                  <SelectItem value="pronto">Pronto</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleUpdateStatus}
                disabled={loading || newStatus === order.status}
                variant="hero"
              >
                {loading ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;