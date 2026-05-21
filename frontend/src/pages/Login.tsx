import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { IconArrowLeft, IconMail } from '@tabler/icons-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        toast.error(result.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch {
      toast.error('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail) {
      toast.error('Informe seu e-mail.');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Link de redefinição de senha enviado para seu e-mail!');
        setShowResetPassword(false);
        setResetEmail('');
      }
    } catch {
      toast.error('Erro ao solicitar redefinição de senha.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-bg-primary p-4"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-bg-secondary border border-border rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue/15 text-blue text-2xl font-bold">
              EV
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              ERPView
            </h1>
            <p className="text-sm text-text-muted">
              Faça login para acessar o sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                E-mail
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-blue/50 transition-shadow"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Senha
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-blue/50 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/50 disabled:opacity-60 disabled:cursor-not-allowed bg-blue text-white hover:bg-blue-dim px-6 py-2.5 text-base mt-2 w-full"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Reset Password Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setShowResetPassword(true);
                setResetEmail(email);
              }}
              className="text-sm text-blue hover:text-blue-dim transition-colors focus:outline-none underline"
            >
              Esqueceu sua senha?
            </button>
          </div>
        </div>
      </motion.div>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowResetPassword(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-bg-secondary border border-border rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="p-1 rounded-lg hover:bg-bg-tertiary transition-colors text-text-muted"
                  >
                    <IconArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-text-primary">Redefinir Senha</h2>
                </div>

                <p className="text-sm text-text-muted mb-6">
                  Informe seu e-mail e enviaremos um link para redefinir sua senha.
                </p>

                {/* Form */}
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      E-mail
                    </label>
                    <div className="relative">
                      <IconMail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50"
                      />
                      <input
                        type="email"
                        autoComplete="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-bg-tertiary border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-blue/50 transition-shadow"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/50 disabled:opacity-60 disabled:cursor-not-allowed bg-blue text-white hover:bg-blue-dim px-6 py-2.5 text-base w-full"
                  >
                    <IconMail size={18} />
                    {resetLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
