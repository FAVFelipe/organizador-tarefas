import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  LogOut, 
  Plus, 
  Search, 
  StickyNote,
  CheckSquare,
  User
} from 'lucide-react';
import TaskList from '@/components/TaskList';
import NotesList from '@/components/NotesList';
import AddTaskDialog from '@/components/AddTaskDialog';
import AddNoteDialog from '@/components/AddNoteDialog';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  const categories = [
    { id: 'all', label: 'Todas', count: 0 },
    { id: 'work', label: 'Trabalho', count: 0 },
    { id: 'personal', label: 'Pessoal', count: 0 },
    { id: 'study', label: 'Estudos', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <CheckSquare className="h-8 w-8 text-primary" />
                <StickyNote className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TaskKeeper</h1>
                <p className="text-sm text-muted-foreground">
                  Olá, {user?.user_metadata?.display_name || user?.email}!
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">CATEGORIAS</h4>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <span>{category.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowAddTask(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowAddNote(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Nota
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tasks" className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Tarefas</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center space-x-2">
                  <StickyNote className="h-4 w-4" />
                  <span>Notas</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="mt-6">
                <TaskList 
                  searchTerm={searchTerm} 
                  selectedCategory={selectedCategory}
                />
              </TabsContent>
              
              <TabsContent value="notes" className="mt-6">
                <NotesList 
                  searchTerm={searchTerm} 
                  selectedCategory={selectedCategory}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AddTaskDialog 
        open={showAddTask} 
        onOpenChange={setShowAddTask}
      />
      
      <AddNoteDialog 
        open={showAddNote} 
        onOpenChange={setShowAddNote}
      />
    </div>
  );
};

export default Dashboard;