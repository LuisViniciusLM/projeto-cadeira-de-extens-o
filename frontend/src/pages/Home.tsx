import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, MessageCircle, LogOut, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Até logo!');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Olá, {user?.name || 'Estudante'}!
            </h1>
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground">O que você gostaria de fazer hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            icon={BookOpen}
            title="Disciplinas"
            description="Explore seus cursos e materiais de estudo"
            iconColor="text-primary"
            onClick={() => navigate('/disciplinas')}
          />

          <Card
            icon={MessageCircle}
            title="Chat"
            description="Converse e tire suas dúvidas"
            iconColor="text-accent"
            onClick={() => navigate('/chat')}
          />
        </div>

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </Layout>
  );
}
