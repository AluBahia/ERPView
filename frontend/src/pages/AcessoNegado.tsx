import { IconShieldLock } from '@tabler/icons-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function AcessoNegado() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="p-4 rounded-full bg-red/10">
        <IconShieldLock size={48} className="text-red" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary">Acesso Negado</h1>
      <p className="text-text-secondary text-center max-w-md">
        Você não tem permissão para acessar este módulo. Entre em contato com o administrador do sistema caso precise de acesso.
      </p>
      <Button onClick={() => navigate('/')} variant="primary">
        Voltar para o Dashboard
      </Button>
    </div>
  );
}
