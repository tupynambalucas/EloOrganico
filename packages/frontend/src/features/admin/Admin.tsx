import {useState, type FC } from 'react';
import AdminStyles from '@cssComponents/admin-panel/main.module.css'
import ProductsPanel from '@reactComponents/admin-panel/panels/producs';  
import SharingPanel from '@reactComponents/admin-panel/panels/sharing';
import UsersPanel from '@reactComponents/admin-panel/panels/users';
import ReportsPanel from '@reactComponents/admin-panel/panels/reports';
import ConfigPanel from '@reactComponents/admin-panel/panels/config';
import SideBar from '@reactComponents/admin-panel/user-interface/containers/SideBar';



type ActivePanel =  'usuarios' | 'partilhas' | 'relatorios' | 'configuracoes' | 'produtos';

const ServerOnly: FC = () => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('partilhas');


  const renderActivePanel = () => {
    switch (activePanel) {
      case 'usuarios':
        return <UsersPanel />;
      case 'partilhas':
        return <SharingPanel />;
      case 'relatorios':
        return <ReportsPanel />;
      case 'configuracoes':
        return <ConfigPanel />;
      case 'produtos':
        return <ProductsPanel />;
      default:
        return <UsersPanel />; // Painel padrão
    }
  };

  return (
      <div className={AdminStyles.container}>
        <SideBar setActivePanel={setActivePanel} />
        <div className={AdminStyles.dashboard}>
          {renderActivePanel()}
        </div>
      </div>
  );
}

export default ServerOnly;