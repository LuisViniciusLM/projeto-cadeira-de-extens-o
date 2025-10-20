import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Hash, Sigma, Equal, Triangle, TrendingUp, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const subjectsData: Record<string, { name: string; topics: Array<{ id: string; name: string; icon: any; color: string }> }> = {
  matematica: {
    name: 'Matemática',
    topics: [
      { id: 'aritmetica', name: 'Aritmética', icon: Hash, color: 'text-blue-300' },
      { id: 'algebra', name: 'Álgebra', icon: Sigma, color: 'text-purple-300' },
      { id: 'equacoes', name: 'Equações', icon: Equal, color: 'text-green-300' },
      { id: 'geometria', name: 'Geometria', icon: Triangle, color: 'text-yellow-300' },
      { id: 'sequencias', name: 'Sequências (PA, PG)', icon: TrendingUp, color: 'text-red-300' },
    ],
  },
  portugues: {
    name: 'Português',
    topics: [
      { id: 'gramatica', name: 'Gramática', icon: Hash, color: 'text-green-300' },
      { id: 'literatura', name: 'Literatura', icon: Sigma, color: 'text-blue-300' },
      { id: 'redacao', name: 'Redação', icon: Equal, color: 'text-purple-300' },
    ],
  },
};

export default function Subdisciplinas() {
  const navigate = useNavigate();
  const { disciplina } = useParams<{ disciplina: string }>();
  
  const subjectData = disciplina ? subjectsData[disciplina] : null;

  if (!subjectData) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Disciplina não encontrada</h1>
          <Button onClick={() => navigate('/disciplinas')}>Voltar para Disciplinas</Button>
        </div>
      </Layout>
    );
  }

  const handleTopicClick = (topicName: string) => {
    toast.success(`Abrindo conteúdo de ${topicName}...`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{subjectData.name}</h1>
          <p className="text-muted-foreground">Escolha um tópico para estudar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {subjectData.topics.map((topic) => (
            <Card
              key={topic.id}
              icon={topic.icon}
              title={topic.name}
              iconColor={topic.color}
              onClick={() => handleTopicClick(topic.name)}
            />
          ))}

          <Card
            icon={Plus}
            title="Adicionar"
            description="Novo tópico"
            iconColor="text-muted-foreground"
            className="border-dashed"
          />
        </div>

        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/disciplinas')}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </Button>
        </div>
      </div>
    </Layout>
  );
}
