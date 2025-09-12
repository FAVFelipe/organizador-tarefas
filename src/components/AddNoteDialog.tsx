import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteCreated?: () => void;
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ open, onOpenChange, onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [color, setColor] = useState('#fef3c7');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const noteColors = [
    { value: '#fef3c7', label: 'Amarelo' },
    { value: '#dbeafe', label: 'Azul' },
    { value: '#dcfce7', label: 'Verde' },
    { value: '#fce7f3', label: 'Rosa' },
    { value: '#f3e8ff', label: 'Roxo' },
    { value: '#fed7d7', label: 'Vermelho' }
  ];

  const categories = [
    { value: 'personal', label: 'Pessoal' },
    { value: 'work', label: 'Trabalho' },
    { value: 'study', label: 'Estudos' },
    { value: 'ideas', label: 'Ideias' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user?.id,
          title: title.trim(),
          content: content.trim() || null,
          category,
          color
        });

      if (error) throw error;

      toast({
        title: 'Nota criada!',
        description: 'Sua nova nota foi adicionada com sucesso.'
      });

      // Reset form
      setTitle('');
      setContent('');
      setCategory('personal');
      setColor('#fef3c7');
      onOpenChange(false);
      onNoteCreated?.();
      
      // Refresh the page to show new note
      // window.location.reload();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a nota',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Nota</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Ideias para o projeto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              placeholder="Escreva suas anotações aqui..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-md border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noteColors.map((noteColor) => (
                      <SelectItem key={noteColor.value} value={noteColor.value}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-sm border"
                            style={{ backgroundColor: noteColor.value }}
                          />
                          <span>{noteColor.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Criando...' : 'Criar Nota'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;