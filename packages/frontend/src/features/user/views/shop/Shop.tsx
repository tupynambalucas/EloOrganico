import { type FC, useState, useMemo } from 'react';
import ShopStyles from '@cssComponents/user-panel/containers/shop.module.css'
import type { ICycle, IProduct } from '@sharedType/db-models'; 
import ProductCard from './shop/ProductCard';

interface ShopProps {
  cycle: ICycle | null;
}

const Shop: FC<ShopProps> = ({ cycle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    if (!cycle || !cycle.products) {
        return <div>Carregando informações do ciclo...</div>;
    }

    const isProduct = (item: string | IProduct): item is IProduct => {
        return typeof item === 'object' && item !== null && '_id' in item;
    };

    const uniqueCategories = useMemo(() => {
        return [...new Set(
            cycle.products
                .filter(isProduct)
                .map(p => p.category)
        )];
    }, [cycle.products]);

    const filteredProducts = useMemo(() => {
        return cycle.products
            .filter(isProduct)
            .filter(product => {
                return selectedCategory === 'All' || product.category === selectedCategory;
            })
            .filter(product => {
                return product.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [cycle.products, selectedCategory, searchTerm]);

    return (
        <div className={ShopStyles.container}>
            <div className={ShopStyles.header}>
                <div>
                    <h1 className='Inter-Semibold'>Produtos</h1>
                    <div className={ShopStyles.filters}>
                        <input 
                            type="text" 
                            placeholder="Pesquisar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='Inter-Regular'
                        />
                        <select 
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className='Inter-Regular'
                        >
                            <option className='Inter-Regular' value="All">Todas as Categorias</option>
                            {uniqueCategories.map(category => (
                                <option className='Inter-Regular' key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- ESTRUTURA LÓGICA CORRIGIDA --- */}
            {/* Agora, a condição verifica se renderizamos a grid OU a mensagem. */}
            {filteredProducts.length > 0 ? (
                <div className={ShopStyles.productsContainer}>
                    <div className={ShopStyles.products}> 
                        {filteredProducts.map(product => (
                            <ProductCard key={`${product._id}-${product.name}-${Math.random()}`} product={product} />
                        ))}
                    </div>
                </div>
                // Se há produtos, renderizamos o container da grid com os cards dentro
            ) : (
                // Se NÃO há produtos, renderizamos APENAS a mensagem.
                // Ela não está mais dentro de um container grid.
                <div className={ShopStyles.noProductsContainer}>
                    <p>Nenhum produto encontrado com os filtros aplicados.</p>
                </div>
            )}
        </div>
    );
}

export default Shop;