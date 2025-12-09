import { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';

import { parseProductList } from './parseProductList';
import { useCycleStore } from '../cycles.store';
import { useCyclesNavigation } from '../cycles.navigation';
import styles from './CreateCycle.module.css';
import { IProduct } from '@elo-organico/shared';

registerLocale('pt-BR', ptBR);

const CustomDataButton = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <button className={styles.dataPicker} type="button" onClick={onClick} ref={ref}>
      {value || 'Selecionar Data'}
    </button>
  )
);
CustomDataButton.displayName = 'CustomDataButton';

const CreateCycle = () => {
  const { createCycle, isSubmitting, error } = useCycleStore();
  const { currentStep, setStep } = useCyclesNavigation();

  const [rawList, setRawList] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [description, setDescription] = useState('');
  const [openingDate, setOpeningDate] = useState<Date | null>(new Date());
  const [closingDate, setClosingDate] = useState<Date | null>(null);

  const handleParseList = () => {
    if (!rawList.trim()) return;
    const parsed = parseProductList(rawList);
    if (parsed.length === 0) {
      alert("Nenhum produto identificado.");
      return;
    }
    setProducts(parsed);
    setStep('validate-list');
  };

  const handleConfirmList = () => {
    setStep('config-cycle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCycle({ description, products, openingDate, closingDate });
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      {currentStep === 'input-list' && (
        <div className={styles.stepContainer}>
          <header>
            <h3>1. Importar Produtos</h3>
            <p>Cole a lista do WhatsApp abaixo</p>
          </header>
          <textarea
            className={styles.listInput}
            placeholder="Ex: Banana prata kg $ 5,00..."
            value={rawList}
            onChange={(e) => setRawList(e.target.value)}
          />
          <footer>
            <button 
                className={styles.primaryBtn} 
                onClick={handleParseList}
                disabled={!rawList.trim()}
            >
              Passar Lista
            </button>
          </footer>
        </div>
      )}

      {currentStep === 'validate-list' && (
        <div className={styles.stepContainer}>
          <header>
            <h3>2. Validar Produtos ({products.length})</h3>
            <p>Verifique se os preços e unidades estão corretos.</p>
          </header>
          
          <div className={styles.productsList}>
            {products.map((p, idx) => (
                <div key={idx} className={styles.productRow}>
                    <span>{p.name}</span>
                    <span className={styles.badge}>{p.category}</span>
                    <strong>R$ {Number(p.measure.value).toFixed(2)} / {p.measure.type}</strong>
                </div>
            ))}
          </div>

          <footer className={styles.actions}>
            <button className={styles.secondaryBtn} onClick={() => setStep('input-list')}>
                Voltar e Corrigir
            </button>
            <button className={styles.primaryBtn} onClick={handleConfirmList}>
                Confirmar Lista
            </button>
          </footer>
        </div>
      )}

      {currentStep === 'config-cycle' && (
        <form className={styles.stepContainer} onSubmit={handleSubmit}>
          <header>
            <h3>3. Configurar Ciclo</h3>
            <p>Defina quando as vendas abrem e fecham.</p>
          </header>

          <div className={styles.formContent}>
            <textarea 
                className={styles.descriptionInput}
                placeholder="Recado para os clientes (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            
            <div className={styles.dateGrid}>
                <div className={styles.field}>
                    <label>Abertura</label>
                    <DatePicker
                        selected={openingDate}
                        onChange={(date) => setOpeningDate(date)}
                        locale="pt-BR"
                        showTimeSelect
                        dateFormat="dd/MM/yyyy HH:mm"
                        customInput={<CustomDataButton />}
                    />
                </div>
                <div className={styles.field}>
                    <label>Fechamento</label>
                    <DatePicker
                        selected={closingDate}
                        onChange={(date) => setClosingDate(date)}
                        locale="pt-BR"
                        showTimeSelect
                        dateFormat="dd/MM/yyyy HH:mm"
                        customInput={<CustomDataButton />}
                    />
                </div>
            </div>
          </div>

          <footer className={styles.actions}>
            <button type="button" className={styles.secondaryBtn} onClick={() => setStep('validate-list')}>
                Voltar
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Ciclo'}
            </button>
          </footer>
        </form>
      )}
    </div>
  );
};

export default CreateCycle;