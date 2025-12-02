import { type FC } from 'react';
import ShopStyles from '@cssComponents/user-panel/containers/shop.module.css'
import type { IProduct } from '@sharedType/db-models';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  // Assume que IProduct tem as propriedades 'name' e 'category'
  return (
    <div className={ShopStyles.productCard}>
      {/* Aqui você pode adicionar uma imagem do produto no futuro */}
      {/* <img src={product.imageUrl} alt={product.name} /> */}
        <div>
            <div>
                <p className='Inter-Light'>{product.category}</p>
                <h3 className='Inter-Medium'>{product.name}</h3>
                <p>R$ {product.measure.value} {product.measure.type}</p>
            </div>
        </div>
        <div>
            <div>
                <input type="number"/>
                <div>
                    <p>$30.0</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;