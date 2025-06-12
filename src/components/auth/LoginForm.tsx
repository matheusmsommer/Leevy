
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Verifique suas credenciais e tente novamente.";
      let showEmailConfirmationHelp = false;
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Confirme seu e-mail antes de fazer login.";
        showEmailConfirmationHelp = true;
      } else if (error.message?.includes('confirme o email') || error.message?.includes('confirmação de email')) {
        errorMessage = "Para usar as contas de demonstração, desabilite a confirmação de email nas configurações do Supabase.";
        showEmailConfirmationHelp = true;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });

      // Show additional help for email confirmation issues
      if (showEmailConfirmationHelp) {
        setTimeout(() => {
          toast({
            title: "💡 Dica para desenvolvimento",
            description: "Vá em Authentication > Settings no Supabase e desabilite 'Enable email confirmations' para usar as contas demo sem confirmação.",
          });
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-leevy rounded-2xl shadow-elevated mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">leevy</h1>
          <p className="text-muted-foreground text-lg">O futuro dos exames laboratoriais</p>
        </div>

        <Card className="border-0 shadow-elevated bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-border bg-background/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 border-border bg-background/50 focus:bg-background transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-leevy hover:opacity-90 text-white font-semibold shadow-elevated transition-all duration-200 hover:shadow-lg hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
            
            <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground text-center mb-4 font-medium">
                <Sparkles className="inline w-4 h-4 mr-1" />
                Contas de demonstração
              </p>
              <div className="space-y-3 text-xs">
                <button
                  onClick={() => handleDemoLogin('super@teste.com')}
                  className="w-full flex justify-between items-center p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground">Superadmin:</span>
                  <span className="text-muted-foreground font-mono">super@teste.com</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('admin@teste.com')}
                  className="w-full flex justify-between items-center p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground">Admin:</span>
                  <span className="text-muted-foreground font-mono">admin@teste.com</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('user@teste.com')}
                  className="w-full flex justify-between items-center p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground">Paciente:</span>
                  <span className="text-muted-foreground font-mono">user@teste.com</span>
                </button>
                <p className="text-center text-muted-foreground mt-3">
                  <em>Clique em uma conta para fazer login automaticamente</em>
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-medium mb-1">Para desenvolvedores:</p>
                    <p>Se aparecer erro de confirmação de email, desabilite "Enable email confirmations" nas configurações de Authentication do Supabase.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-sm mt-6">
          © 2024 Leevy. Transformando a saúde através da tecnologia.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
