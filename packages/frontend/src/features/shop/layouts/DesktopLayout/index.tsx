import styles from './styles.module.css';
import DesktopSidebar from './components/Sidebar';
import DesktopStorefront from './components/Storefront';

const DesktopLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.storeFrontContainer}>
        <DesktopStorefront />
      </div>

      <div className={styles.sidebarContainer}>
        <DesktopSidebar />
      </div>
    </div>
  );
};

export default DesktopLayout;
