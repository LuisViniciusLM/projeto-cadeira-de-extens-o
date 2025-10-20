import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Calculator, BookText, Globe, Languages, Landmark, Plus, ArrowLeft } from 'lucide-react';

const subjects = [
  { id: 'matematica', name: 'Matemática', icon: Calculator, color: 'text-blue-400' },
  { id: 'portugues', name: 'Português', icon: BookText, color: 'text-green-400' },
  { id: 'ingles', name: 'Inglês', icon: Globe, color: 'text-red-400' },
  { id: 'espanhol', name: 'Espanhol', icon: Languages, color: 'text-yellow-400' },
  { id: 'historia', name: 'História', icon: Landmark, color: 'text-purple-400' },
];

export default function Disciplinas() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Minhas Disciplinas</h1>
          <p className="text-muted-foreground">Selecione uma disciplina para começar a estudar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              icon={subject.icon}
              title={subject.name}
              iconColor={subject.color}
              onClick={() => navigate(`/disciplinas/${subject.id}`)}
            />
          ))}

          <Card
            icon={Plus}
            title="Adicionar"
            description="Nova disciplina"
            iconColor="text-muted-foreground"
            className="border-dashed"
          />
        </div>

        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/home')}
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
