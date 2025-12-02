import { useState, type FC } from 'react';

import CurrentSharingStyles from '@cssComponents/admin-panel/panels/sharing/current-sharing.module.css';
import SharingPanelStyles from '@cssComponents/admin-panel/panels/sharing/main.module.css';
import SharingForm from './sharing/SharingForm';
import { useRouteContext } from '@tupynamba/fastifyreact-ts/client'; 

type Product = {
  name: string;
  category: string;
  measure: {
    value: number | string;
    type: string;
    minimumOrder?: {
      type: string;
      value: number | string;
    };
  };
};

export type SharingFormData = {
  products: Product[]; // Você pode criar um tipo mais específico para 'Product' se quiser
  description: string;
  openingDate: Date | null;
  closingDate: Date | null;
};

const SharingPanel: FC = () => {
  const [currentSharing, setCurrentSharing] = useState(false);
  const { state, actions } = useRouteContext(); 
  
  const handleSharingCreate = async (data: SharingFormData) => {
    console.log('Enviando dados para a action do contexto:', data);

    // Chama a nova action!
    const success = await actions.admin.createSharing(state, data);

    if (success) {
      // Se a action retornou true, a criação foi bem-sucedida
      setCurrentSharing(true); // Atualiza a UI para mostrar a partilha atual
    } else {
      // Se retornou false, a action lidou com o erro (ex: state.error)
      // Você pode mostrar uma notificação de erro aqui se quiser.
      alert('Falha ao criar a partilha. Verifique o console ou a mensagem de erro.');
    }
  };
  
  return (
    <div className={SharingPanelStyles.container}>
      <div>
        <div className={CurrentSharingStyles.currentSharing}>
            {currentSharing ? (
                <div>
                    <h1>Partilha Atual</h1>
                </div>
              ) : (
                <SharingForm 
                    onSharingCreate={handleSharingCreate}
                />
            )}
        </div>
      </div>
    </div>
  );
}

export default SharingPanel;