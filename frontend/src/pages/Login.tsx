import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!login || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    // Fake authentication - in real app, validate credentials
    loginUser('Usuário', login);
    toast.success('Login realizado com sucesso!');
    navigate('/home');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4 shadow-glow-primary">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">EduApp</h1>
          <p className="text-muted-foreground">Bem-vindo de volta!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Login"
            type="text"
            placeholder="Digite seu login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" size="lg">
            Entrar
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                CADASTRE-SE
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
