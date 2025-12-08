// packages/frontend/src/features/shop/layouts/MobileShopLayout.tsx
import styles from './layouts.module.css'; // Vamos criar um CSS simples depois

const MobileShopLayout = () => {
  return (
    <div className={styles.mobileContainer}>
      <header className={styles.mobileHeader}>
        {/* Logo reduzido, saldo, ou menu hamburguer */}
        <h3>Elo Mobile</h3>
      </header>

      <main className={styles.mobileContent}>
        {/* Aqui virá a lista de produtos (scroll vertical infinito) */}
        <p>Lista de Produtos Mobile (Cards verticais)</p>
      </main>

      <nav className={styles.bottomNav}>
        {/* Navegação fixa no rodapé estilo App */}
        <button>🏠 Início</button>
        <button>🔍 Buscar</button>
        <button>🛒 Carrinho</button>
      </nav>
    </div>
  );
};

export default MobileShopLayout;