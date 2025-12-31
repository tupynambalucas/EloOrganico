import {
  faArrowRightFromBracket,
  faList,
  faUsers,
  faCarrot,
  faChartSimple,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LogoPositive } from '@/components/Icons';
import { useAuthStore } from '@/domains/auth';
import { useAdminNavigation } from '../../admin.navigation';
import type { AdminViewType } from '../../admin.navigation';
import styles from './styles.module.css';

const SideBar = () => {
  const { setView, currentView } = useAdminNavigation();
  const { logout } = useAuthStore();

  const handleNavigation = (view: AdminViewType) => {
    setView(view);
  };

  const getButtonClass = (view: AdminViewType) => {
    return currentView === view ? styles.active : '';
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <LogoPositive />
      </div>
      <div className={styles.menu}>
        <button
          type="button"
          onClick={() => handleNavigation('cycles')}
          className={getButtonClass('cycles')}
        >
          <FontAwesomeIcon icon={faList} size="xl" />
          <span className={styles.tooltip}>Ciclos</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('users')}
          className={getButtonClass('users')}
        >
          <FontAwesomeIcon icon={faUsers} size="xl" />
          <span className={styles.tooltip}>Usuários</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('products')}
          className={getButtonClass('products')}
        >
          <FontAwesomeIcon icon={faCarrot} size="xl" />
          <span className={styles.tooltip}>Produtos</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('reports')}
          className={getButtonClass('reports')}
        >
          <FontAwesomeIcon icon={faChartSimple} size="xl" />
          <span className={styles.tooltip}>Relatórios</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('configurations')}
          className={getButtonClass('configurations')}
        >
          <FontAwesomeIcon icon={faGear} size="xl" />
          <span className={styles.tooltip}>Configurações</span>
        </button>
      </div>

      <div className={styles.footer}>
        <button type="button" onClick={() => void logout()} title="Sair do sistema">
          <FontAwesomeIcon icon={faArrowRightFromBracket} size="xl" flip="horizontal" />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
