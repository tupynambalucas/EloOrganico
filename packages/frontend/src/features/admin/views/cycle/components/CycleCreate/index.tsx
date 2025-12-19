import { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSync } from '@fortawesome/free-solid-svg-icons';

import { parseProductList, FailedLine } from './parseProductList';
import { useAdminCycleStore } from '../../../../domains/cycle/cycle.store';
import { useCyclesNavigation } from '../../cycle.navigation';
import styles from './styles.module.css';
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

interface FixingItem {
  id: string;
  originalText: string;
  category: string;
  name: string;
  price: string;
  unit: string;
}

const CycleCreate = () => {
  const { createCycle, isSubmitting, error: storeError } = useAdminCycleStore();
  const { currentStep, setStep } = useCyclesNavigation();

  const [rawList, setRawList] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [failedLines, setFailedLines] = useState<FailedLine[]>([]);
  
  const [isFixing, setIsFixing] = useState(false);
  const [fixingItems, setFixingItems] = useState<FixingItem[]>([]);

  const [description, setDescription] = useState('');
  const [openingDate, setOpeningDate] = useState<Date | null>(new Date());
  const [closingDate, setClosingDate] = useState<Date | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleParseList = () => {
    setLocalError(null);
    if (!rawList.trim()) {
        setLocalError('Cole a lista de produtos antes de continuar.');
        return;
    }

    const result = parseProductList(rawList);
    
    if (result.products.length === 0 && result.failedLines.length === 0) {
      setLocalError('Nenhum produto identificado.');
      return;
    }

    setProducts(result.products);
    setFailedLines(result.failedLines);
    setStep('validate-list');
  };

  const handleStartFixing = () => {
    const itemsToFix = failedLines.map((fail, idx) => {
      const cleanText = fail.text.replace(/[\-*•]/g, '').trim();
      let estimatedName = cleanText;

      const priceMatch = cleanText.match(/(?:[R$]\s*)?(\d+[.,]?\d*)\s*(\/.*)?$/i);
      if (priceMatch) {
          estimatedName = cleanText.substring(0, priceMatch.index).trim();
      }

      return {
        id: `fix-${idx}`,
        originalText: fail.text,
        category: fail.category,
        name: estimatedName,
        price: '',
        unit: 'unidade'
      };
    });
    
    setFixingItems(itemsToFix);
    setIsFixing(true);
  };

  const handleUpdateFixingItem = (id: string, field: keyof FixingItem, value: string) => {
    setFixingItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleProcessFixedItems = () => {
    const stillInvalid: FixingItem[] = [];
    const validNewProducts: IProduct[] = [];

    fixingItems.forEach(item => {
      const priceNum = parseFloat(item.price.replace(',', '.'));
      
      if (item.name.trim().length > 2 && !isNaN(priceNum) && priceNum > 0) {
        validNewProducts.push({
          name: item.name.trim(),
          category: item.category,
          available: true,
          measure: {
            type: item.unit,
            value: priceNum
          }
        });
      } else {
        stillInvalid.push(item);
      }
    });

    if (validNewProducts.length > 0) {
      setProducts(prev => [...prev, ...validNewProducts]);
    }

    setFixingItems(stillInvalid);

    if (stillInvalid.length === 0) {
      setIsFixing(false);
      setFailedLines([]);
    } else {
        alert(`Atenção: ${stillInvalid.length} itens ainda estão incorretos.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openingDate || !closingDate) {
        setLocalError('Defina as datas de abertura e fechamento.');
        return;
    }

    const success = await createCycle({
      products,
      description,
      openingDate,
      closingDate
    });

    if (success) {
      setRawList('');
      setProducts([]);
      setFailedLines([]);
      setDescription('');
    }
  };

  const totalProducts = products.length;
  const hasErrors = failedLines.length > 0;

  return (
    <div className={styles.container}>
      {(localError || storeError) && (
        <div className={styles.errorMessage}>
            {localError || storeError}
        </div>
      )}

      {currentStep === 'input-list' && (
        <div className={styles.stepContainer}>
            <h3>Novo Ciclo - Colar Lista</h3>
            <p>Cole a lista do WhatsApp ou Excel abaixo.</p>
            <textarea
                className={styles.listInput}
                placeholder="Ex: Alface Americana un R$ 3,50..."
                value={rawList}
                onChange={(e) => setRawList(e.target.value)}
            />
            <footer className={styles.actions}>
                <button 
                    className={styles.primaryBtn} 
                    onClick={handleParseList}
                    disabled={!rawList.trim()}
                >
                    Processar Lista
                </button>
            </footer>
        </div>
      )}

      {currentStep === 'validate-list' && (
        <div className={styles.stepContainer}>
            <div className={styles.headerStep}>
                <h3>
                    {isFixing 
                        ? `Corrigindo Produtos (${fixingItems.length})` 
                        : `Validar Produtos (${totalProducts})`}
                </h3>
                {!isFixing && (
                    <button className={styles.secondaryBtn} onClick={() => setStep('input-list')}>
                        Voltar / Editar Texto
                    </button>
                )}
            </div>

            {isFixing ? (
                <>
                    <div className={styles.fixList}>
                        {fixingItems.map(item => (
                            <div key={item.id} className={styles.fixCard}>
                                <div className={styles.fixCardTitle}>
                                    Texto Original: &quot;{item.originalText}&quot;
                                </div>
                                <div className={styles.fixGrid}>
                                    <div className={styles.fixField} style={{ flex: '2 1 200px' }}>
                                        <label>Nome do Produto</label>
                                        <input 
                                            className={styles.fixInput}
                                            value={item.name}
                                            onChange={(e) => handleUpdateFixingItem(item.id, 'name', e.target.value)}
                                            placeholder="Nome..."
                                        />
                                    </div>
                                    <div className={styles.fixField} style={{ flex: '1 1 80px' }}>
                                        <label>Preço (R$)</label>
                                        <input 
                                            className={styles.fixInput}
                                            value={item.price}
                                            onChange={(e) => handleUpdateFixingItem(item.id, 'price', e.target.value)}
                                            placeholder="0,00"
                                            type="number"
                                        />
                                    </div>
                                    <div className={styles.fixField} style={{ flex: '1 1 100px' }}>
                                        <label>Unidade</label>
                                        <select 
                                            className={styles.fixInput}
                                            value={item.unit}
                                            onChange={(e) => handleUpdateFixingItem(item.id, 'unit', e.target.value)}
                                        >
                                            <option value="unidade">Unidade</option>
                                            <option value="pacote">Pacote</option>
                                            <option value="kg">Kg</option>
                                            <option value="litro">Litro</option>
                                            <option value="maço">Maço</option>
                                            <option value="bandeja">Bandeja</option>
                                            <option value="garrafão">Garrafão</option>
                                        </select>
                                    </div>
                                    <div className={styles.fixField} style={{ flex: '1 1 120px' }}>
                                        <label>Categoria</label>
                                        <input 
                                            className={styles.fixInput}
                                            value={item.category}
                                            disabled
                                            title="Categoria detectada automaticamente"
                                            style={{ backgroundColor: '#f3f4f6' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <footer className={styles.actions}>
                        <button className={styles.primaryBtn} onClick={handleProcessFixedItems}>
                            <FontAwesomeIcon icon={faSync} style={{ marginRight: 8 }} />
                            Atualizar Produtos
                        </button>
                    </footer>
                </>
            ) : (
                <>
                    <div className={styles.previewList}>
                        {products.map((p, idx) => (
                            <div key={idx} className={styles.productRow}>
                                <div className={styles.pInfo}>
                                    <strong>{p.name}</strong>
                                    <small>{p.category}</small>
                                </div>
                                <div className={styles.pMeta}>
                                    <span className={styles.badge}>
                                        {p.content ? `${p.content.value}${p.content.unit}` : p.measure.type}
                                    </span>
                                    <span className={styles.price}>R$ {Number(p.measure.value).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasErrors ? (
                        <div className={styles.dangerZone}>
                            <div className={styles.dangerHeader}>
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                Atenção: {failedLines.length} produtos da lista não puderam ser lidos
                            </div>
                            <div className={styles.dangerContent}>
                                <div className={styles.failedPreview}>
                                    {failedLines.slice(0, 3).map((fail, idx) => (
                                        <div key={idx}>• {fail.text}</div>
                                    ))}
                                    {failedLines.length > 3 && (
                                        <div style={{ marginTop: 4, fontStyle: 'italic' }}>
                                            + Outros {failedLines.length - 3} produtos não puderam ser lidos
                                        </div>
                                    )}
                                </div>
                                <div className={styles.dangerFooter}>
                                    Verifique se esses itens têm preço formatado corretamente.
                                </div>
                                <button className={styles.fixButton} onClick={handleStartFixing}>
                                    Corrigir Produtos
                                </button>
                            </div>
                        </div>
                    ) : (
                        <footer className={styles.actions}>
                            <button className={styles.primaryBtn} onClick={() => setStep('config-cycle')}>
                                Continuar
                            </button>
                        </footer>
                    )}
                </>
            )}
        </div>
      )}

      {currentStep === 'config-cycle' && (
        <form onSubmit={handleSubmit} className={styles.stepContainer}>
          <h3>Configurações do Ciclo</h3>
          
          <div className={styles.formGroup}>
            <label>Descrição (Opcional)</label>
            <input 
                type="text" 
                className={styles.descriptionInput}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Ciclo Semanal #42"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Período de Vendas</label>    
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

export default CycleCreate;