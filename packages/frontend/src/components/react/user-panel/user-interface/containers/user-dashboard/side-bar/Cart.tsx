import { type FC, useEffect } from 'react';
import SideBarStyles from '@cssComponents/user-panel/containers/side-bar.module.css'

const Cart: FC = () => {

    // O hook useEffect atende ao seu pedido: executa uma ação quando 'authenticated' muda.

    return (
        <div className={SideBarStyles.cart}>
            <div>
                
            </div>
        </div>
    );
}

export default Cart;