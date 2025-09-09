import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  StickyNote,
  Clock,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface NotesListProps {
  searchTerm: string;
  selectedCategory: string;
}

const NotesList: React.FC<NotesListProps> = ({ searchTerm, selectedCategory }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const categoryColors = {
    personal: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    work: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
    study: 'bg-green-500/20 text-green-700 border-green-500/30',
    ideas: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
  };

  const categoryLabels = {
    personal: 'Pessoal',
    work: 'Trabalho',
    study: 'Estudos',
    ideas: 'Ideias'
  };

  const noteColors = [
    '#fef3c7', // yellow
    '#dbeafe', // blue
    '#dcfce7', // green
    '#fce7f3', // pink
    '#f3e8ff', // purple
    '#fed7d7'  // red
  ];

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== noteId));
      toast({
        title: 'Nota excluída',
        description: 'A nota foi removida com sucesso'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a nota',
        variant: 'destructive'
      });
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const NoteCard: React.FC<{ note: Note }> = ({ note }) => (
    <Card 
      className="transition-all hover:shadow-md cursor-pointer group"
      style={{ backgroundColor: note.color + '10' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
            {note.title}
          </CardTitle>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {note.content && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-4">
            {note.content}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs ${categoryColors[note.category as keyof typeof categoryColors] || categoryColors.personal}`}
          >
            <Tag className="h-2 w-2 mr-1" />
            {categoryLabels[note.category as keyof typeof categoryLabels] || note.category}
          </Badge>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-2 w-2" />
            <span>
              {format(new Date(note.updated_at), 'dd/MM', { locale: ptBR })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <StickyNote className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-600">{filteredNotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = notes.filter(note => note.category === key).length;
          if (count === 0) return null;
          
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-2xl font-bold text-purple-600">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma nota encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente buscar por outros termos' : 'Crie sua primeira nota para começar!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesList;