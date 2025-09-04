import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Produto, Categoria } from "@/types/database";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Produto | null;
  categories: Categoria[];
  estabelecimentoId: string;
  onSave: (produto: Omit<Produto, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
}

const ProductModal = ({ 
  open, 
  onOpenChange, 
  product, 
  categories, 
  estabelecimentoId,
  onSave 
}: ProductModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria_id: "",
    imagem: "",
    disponivel: true,
    destaque: false,
    ordem: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        descricao: product.descricao || "",
        preco: product.preco.toString(),
        categoria_id: product.categoria_id || "",
        imagem: product.imagem || "",
        disponivel: product.disponivel,
        destaque: product.destaque,
        ordem: product.ordem || 0
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        categoria_id: "",
        imagem: "",
        disponivel: true,
        destaque: false,
        ordem: 0
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || null,
        preco: parseFloat(formData.preco),
        categoria_id: formData.categoria_id || null,
        imagem: formData.imagem.trim() || null,
        disponivel: formData.disponivel,
        destaque: formData.destaque,
        ordem: formData.ordem,
        estabelecimento_id: estabelecimentoId
      };

      const { error } = await onSave(productData);
      
      if (error) {
        toast({
          title: "Erro ao salvar produto",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: product ? "Produto atualizado" : "Produto criado",
          description: product 
            ? "O produto foi atualizado com sucesso."
            : "O produto foi criado com sucesso.",
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {product 
              ? "Atualize as informações do produto." 
              : "Adicione um novo produto ao seu cardápio."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Pizza Margherita"
                required
                disabled={loading}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva os ingredientes e características do produto..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                placeholder="0,00"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="imagem">URL da Imagem</Label>
              <Input
                id="imagem"
                type="url"
                value={formData.imagem}
                onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="ordem">Ordem de Exibição</Label>
              <Input
                id="ordem"
                type="number"
                min="0"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                placeholder="0"
                disabled={loading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="disponivel"
                  checked={formData.disponivel}
                  onCheckedChange={(checked) => setFormData({ ...formData, disponivel: checked })}
                  disabled={loading}
                />
                <Label htmlFor="disponivel">Produto disponível</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="destaque"
                  checked={formData.destaque}
                  onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
                  disabled={loading}
                />
                <Label htmlFor="destaque">Produto em destaque</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : (product ? "Atualizar" : "Criar")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;