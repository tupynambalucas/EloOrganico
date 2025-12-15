import { useMemo } from 'react';
import { useAuthStore } from '@/domains/auth/auth.store';
import userIconList from '@/constants/userIconList';

// Props opcionais para flexibilidade (tamanho, classe extra)
interface UserIconProps {
  className?: string;
  size?: number;
  // Opcional: permitir forçar um ícone específico se necessário (ex: preview no cadastro)
  forceIcon?: string; 
}

const UserIcon = ({ className = '', size = 40, forceIcon }: UserIconProps) => {
  // 1. Conecta na Store para ler o usuário logado
  const { user } = useAuthStore();

  // 2. Determina qual nome de ícone usar
  // Prioridade: Ícone forçado (preview) > Ícone do usuário logado > Fallback (primeiro da lista)
  const iconName = forceIcon || user?.icon || userIconList[0].name;

  // 3. Busca a imagem correspondente na lista
  // useMemo evita recalcular a busca a cada render, embora find seja rápido.
  const iconData = useMemo(() => {
    return userIconList.find((item) => item.name === iconName) || userIconList[0];
  }, [iconName]);

  return (
    <img 
      src={iconData.base64} 
      alt={`Avatar ${iconName}`} 
      className={className}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', // Garante que fique redondo (padrão de avatar)
        objectFit: 'cover'
      }} 
    />
  );
};

export default UserIcon;