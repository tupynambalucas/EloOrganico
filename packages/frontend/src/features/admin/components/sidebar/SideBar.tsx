import { faTableList, faUsers, faCarrot, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAdminNavigation, type AdminViewType } from '../../admin.navigation';
import styles from './sidebar.module.css';

// Removido: forwardRef, SideBarProps, HTMLDivElement
const SideBar = () => {
    // Conectamos na store
    const { setView, currentView } = useAdminNavigation();

    const handleNavigation = (view: AdminViewType) => {
        setView(view);
    };

    // Helper para verificar se o botão está ativo e aplicar classe CSS (opcional)
    // Supondo que você tenha uma classe .active no seu CSS module
    const getButtonClass = (view: AdminViewType) => {
        // Se currentView for igual a view, retorna a classe active combinada, senão nada
        // Ajuste a lógica de classe conforme seu CSS real
        return currentView === view ? styles.active : ''; 
    };

    return (
        <div className={styles.sidebar}>
          <div>
            {/* Espaço para Logo */}
            <div className={styles.logoArea}></div>
            
            <div className={styles.menu}>
                <button 
                    onClick={() => handleNavigation('partilhas')}
                    className={getButtonClass('partilhas')}
                >
                    <div>
                        <FontAwesomeIcon icon={faTableList}/>
                        <p className='Inter-Regular'>Partilhas</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleNavigation('usuarios')}
                    className={getButtonClass('usuarios')}
                >
                    <div>
                        <FontAwesomeIcon icon={faUsers}/>
                        <p className='Inter-Regular'>Usuários</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleNavigation('produtos')}
                    className={getButtonClass('produtos')}
                >
                    <div>
                        <FontAwesomeIcon icon={faCarrot}/>
                        <p className='Inter-Regular'>Produtos</p>
                    </div>
                </button>
                
                <button 
                    onClick={() => handleNavigation('relatorios')}
                    className={getButtonClass('relatorios')}
                >
                    <div>
                        <FontAwesomeIcon icon={faChartSimple}/>
                        <p className='Inter-Regular'>Relatórios</p>
                    </div>
                </button>
            </div>
            
            <div className={styles.footer}>
                <button onClick={() => handleNavigation('configuracoes')}>Configurações</button>
            </div>
          </div>
        </div>
    );
};

export default SideBar;