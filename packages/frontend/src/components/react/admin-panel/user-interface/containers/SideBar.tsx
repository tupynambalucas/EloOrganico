import { forwardRef, useState } from 'react';
import { faTableList, faUsers, faCarrot, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EloOrganicoLogo from '@assets/midia/svg/logo/logo-negative.svg?react';
import SideBarStyle from '@cssComponents/admin-panel/user-interface/containers/side-bar.module.css'

type ActivePanel =  'usuarios' | 'partilhas' | 'relatorios' | 'configuracoes' | 'produtos';

type SideBarProps = {
    setActivePanel: (panel: ActivePanel) => void;
  
};

// 2. Convert the component to use a block body with an explicit return
const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  (props, ref) => {
    // Destructure props for easier access
    const {
      setActivePanel
    } = props;

    return (
        <div className={SideBarStyle.sidebar}>
          <div>
            <div></div>
            <div>
                <button onClick={() => setActivePanel('partilhas')}>
                    <div>
                        <FontAwesomeIcon icon={faTableList}/>
                        <p className='Inter-Regular'>Partilhas</p>
                    </div>
                </button>
                <button onClick={() => setActivePanel('usuarios')}>
                    <div>
                        <FontAwesomeIcon icon={faUsers}/>
                        <p className='Inter-Regular'>Usuários</p>
                    </div>
                </button>
                <button onClick={() => setActivePanel('produtos')}>
                    <div>
                        <FontAwesomeIcon icon={faCarrot}/>
                        <p className='Inter-Regular'>Produtos</p>
                    </div>
                </button>
                    <button onClick={() => setActivePanel('relatorios')}>
                    <div>
                        <FontAwesomeIcon icon={faChartSimple}/>
                        <p className='Inter-Regular'>Relatórios</p>
                    </div>
                </button>
            </div>
            <div>
                <button onClick={() => setActivePanel('configuracoes')}>Configurações</button>
            </div>
          </div>
        </div>
    )
  })

export default SideBar;