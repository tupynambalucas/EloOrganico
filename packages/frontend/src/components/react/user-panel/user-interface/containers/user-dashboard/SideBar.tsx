import { type FC, useEffect } from 'react';
import SideBarStyles from '@cssComponents/user-panel/containers/side-bar.module.css'
import Cart from './side-bar/Cart'
import User from './side-bar/User'

const SideBar: FC = () => {

    // O hook useEffect atende ao seu pedido: executa uma ação quando 'authenticated' muda.

    return (
        <div className={SideBarStyles.container}>
            <div>
                <Cart/>
                <User/>
            </div>
        </div>
    );
}

export default SideBar;