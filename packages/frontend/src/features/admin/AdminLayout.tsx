import { type FC, Suspense } from 'react';
import styles from './Admin.module.css';
import ProductsView from '@/features/admin/views/product/ProductsView';  
import SharingView from '@/features/admin/views/cycle/CycleView';
import CustomersView from '@/features/admin/views/customer/CustomersView';
import ReportsView from '@/features/admin/views/report/ReportsView';
import ConfigView from '@/features/admin/views/config/ConfigView';
import SideBar from '@/features/admin/sidebar/SideBar';
import Loader from '@/components/loaders/ScreenLoader'; // Seu loader global

// Importamos a store
import { useAdminNavigation } from './admin.navigation';

const AdminLayout: FC = () => {
  // Lemos o estado global
  const { currentView } = useAdminNavigation();

  const renderActivePanel = () => {
    switch (currentView) {
      case 'users':
        return <CustomersView />;
      case 'cycles':
        return <SharingView />;
      case 'reports':
        return <ReportsView />;
      case 'configurations':
        return <ConfigView />;
      case 'products':
        return <ProductsView />;
      default:
        return <SharingView />;
    }
  };

  return (
      <div className={styles.container}>
        <SideBar />
        <main>
           <Suspense fallback={<Loader />}>
              {renderActivePanel()}
           </Suspense>
        </main>
      </div>
  );
}

export default AdminLayout;