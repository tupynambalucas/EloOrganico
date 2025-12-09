import { faArrowRightFromBracket, faList, faUsers, faCarrot, faChartSimple, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAdminNavigation, type AdminViewType } from '../admin.navigation';
import { LogoPositive } from '@/components/Icons';
import styles from './sidebar.module.css'; // Corrigido para minúsculo conforme seu padrão de arquivo

const SideBar = () => {
    const { setView, currentView } = useAdminNavigation();

    const handleNavigation = (view: AdminViewType) => {
        setView(view);
    };

    const getButtonClass = (view: AdminViewType) => {
        return currentView === view ? styles.active : ' '; 
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <LogoPositive />
            </div>
            <div className={styles.menu}>
                <button 
                    onClick={() => handleNavigation('cycles')}
                    className={getButtonClass('cycles')}
                >
                    <FontAwesomeIcon icon={faList} size="xl"/>
                    <span className={styles.tooltip}>Ciclos</span>
                </button>

                <button 
                    onClick={() => handleNavigation('users')}
                    className={getButtonClass('users')}
                >
                    <FontAwesomeIcon icon={faUsers} size="xl"/>
                    <span className={styles.tooltip}>Usuários</span>
                </button>

                <button 
                    onClick={() => handleNavigation('products')}
                    className={getButtonClass('products')}
                >
                    <FontAwesomeIcon icon={faCarrot} size="xl"/>
                    <span className={styles.tooltip}>Produtos</span>
                </button>
                
                <button 
                    onClick={() => handleNavigation('reports')}
                    className={getButtonClass('reports')}
                >
                    <FontAwesomeIcon icon={faChartSimple} size="xl"/>
                    <span className={styles.tooltip}>Relatórios</span>
                </button>
                <button 
                    onClick={() => handleNavigation('configurations')}
                    className={getButtonClass('configurations')}
                >
                    <FontAwesomeIcon icon={faGear} size="xl"/>
                    <span className={styles.tooltip}>Configurações</span>
                </button>
            </div>
            
            <div className={styles.footer}>
                <button 
                    // onClick aqui para logout
                >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} size="xl" flip="horizontal" />
                    {/* Sem tooltip aqui, conforme solicitado */}
                </button>
            </div>
        </div>
    );
};

export default SideBar;