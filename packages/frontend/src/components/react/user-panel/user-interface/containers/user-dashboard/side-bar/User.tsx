import { type FC, useEffect } from 'react';
import SideBarStyles from '@cssComponents/user-panel/containers/side-bar.module.css'

const User: FC = () => {

    // O hook useEffect atende ao seu pedido: executa uma ação quando 'authenticated' muda.

    return (
        <div className={SideBarStyles.user}>
            <div>
                
            </div>
        </div>
    );
}

export default User;