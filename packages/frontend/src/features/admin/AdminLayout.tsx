import { type FC, Suspense } from 'react';
import AdminStyles from '@cssComponents/admin-panel/main.module.css';
import ProductsView from '@features/admin/views/products/ProductsView';  
import SharingView from '@features/admin/views/sharing/SharingView';
import CustomersView from '@features/admin/views/customers/CustomersView';
import ReportsView from '@features/admin/views/reports/ReportsView';
import ConfigView from '@features/admin/views/config/ConfigView';
import SideBar from '@features/admin/components/sidebar/SideBar';
import Loader from '@/components/Loader'; // Seu loader global

// Importamos a store
import { useAdminNavigation } from './admin.navigation';

const AdminLayout: FC = () => {
  // Lemos o estado global
  const { currentView } = useAdminNavigation();

  const renderActivePanel = () => {
    switch (currentView) {
      case 'usuarios':
        return <CustomersView />;
      case 'partilhas':
        return <SharingView />;
      case 'relatorios':
        return <ReportsView />;
      case 'configuracoes':
        return <ConfigView />;
      case 'produtos':
        return <ProductsView />;
      default:
        return <SharingView />;
    }
  };

  return (
      <div className={AdminStyles.container}>
        {/* A Sidebar agora gerencia seu próprio estado, não precisa passar props */}
        <SideBar />
        
        <div className={AdminStyles.dashboard}>
           {/* Adicionei Suspense caso suas Views tenham lazy loading interno */}
           <Suspense fallback={<Loader />}>
              {renderActivePanel()}
           </Suspense>
        </div>
      </div>
  );
}

export default AdminLayout;