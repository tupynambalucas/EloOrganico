import { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';

import { parseProductList } from './cycleFunctions';
import { useCycleStore, type CycleFormData } from '../cycles.store';
import styles from './Createcycleform.module.css';

registerLocale('pt-BR', ptBR);

const CustomDataButton = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <button className={styles.dataPicker} type="button" onClick={onClick} ref={ref}>
      {value || 'Escolha uma data'}
    </button>
  )
);

CustomDataButton.displayName = 'CustomDataButton';

const CreateCycleForm = () => {
  const { createCycle, isSubmitting, error } = useCycleStore();

  const [description, setDescription] = useState('');
  const [openingDate, setOpeningDate] = useState<Date | null>(null);
  const [closingDate, setClosingDate] = useState<Date | null>(null);
  const [rawList, setRawList] = useState('');
  const [products, setProducts] = useState<CycleFormData['products']>([]);
  const [listIsValid, setListIsValid] = useState(false);

  const handleParseList = () => {
    const parsed = parseProductList(rawList);
    if (parsed.length === 0) {
      alert("Nenhum produto identificado. Verifique o formato da lista.");
      return;
    }
    setProducts(parsed);
    setListIsValid(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCycle({ description, products, openingDate, closingDate });
  };

  return (
      <div className={styles.formContainer}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        {!listIsValid ? (
          <div className={styles.stepOne}>
            <h3>Passo 1: Cole a lista de produtos</h3>
            <textarea
              className={styles.listInput}
              placeholder='Ex: Banana kg R$ 5,00...'
              value={rawList}
              onChange={(e) => setRawList(e.target.value)}
            />
            <button className={styles.primaryBtn} type="button" onClick={handleParseList}>
              Processar Lista
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.stepTwo}>
             <h3>Passo 2: Configurar Ciclo</h3>
             
             <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
                placeholder='Descrição ou recado do ciclo...' 
                className={styles.descriptionInput}
             />

             <div className={styles.dateGrid}>
                <div className={styles.dateField}>
                  <label>Abertura</label>
                  <DatePicker
                    selected={openingDate}
                    onChange={(date) => setOpeningDate(date)}
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    customInput={<CustomDataButton />}
                  />
                </div>
                <div className={styles.dateField}>
                   <label>Fechamento</label>
                   <DatePicker
                    selected={closingDate}
                    onChange={(date) => setClosingDate(date)}
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    customInput={<CustomDataButton />}
                  />
                </div>
             </div>
            
            <div className={styles.previewList}>
                <p><strong>{products.length}</strong> produtos prontos para importação.</p>
            </div>

             <div className={styles.actions}>
                <button type="button" onClick={() => setListIsValid(false)} className={styles.secondaryBtn}>
                    Voltar
                </button>
                <button type='submit' disabled={isSubmitting} className={styles.primaryBtn}>
                    {isSubmitting ? 'Criando...' : 'Confirmar e Abrir Ciclo'}
                </button>
             </div>
          </form>
        )}
      </div>
  );
};

export default CreateCycleForm;