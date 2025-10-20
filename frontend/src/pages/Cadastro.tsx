import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function Cadastro() {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!name || !login || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    register(name, login, password);
    toast.success('Cadastro realizado com sucesso!');
    navigate('/home');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4 shadow-glow-primary">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Criar Conta</h1>
          <p className="text-muted-foreground">Junte-se ao EduApp hoje!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome"
            type="text"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Login"
            type="text"
            placeholder="Escolha um login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Crie uma senha (min. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" size="lg">
            Cadastrar
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                ENTRAR
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
