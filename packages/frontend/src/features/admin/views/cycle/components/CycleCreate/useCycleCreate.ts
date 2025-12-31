import { useState, useCallback, useEffect } from 'react';
import { useAdminCycleStore } from '../../../../domains/cycle/cycle.store';
import { useCyclesNavigation } from '../../cycle.navigation';
import { parseProductList, type FailedLine } from './parseProductList';
import type { FixingItem } from './types';
import type { IProduct } from '@elo-organico/shared';

export const useCycleCreate = () => {
  const { currentStep, setStep, resetNavigation } = useCyclesNavigation();
  const { createCycle, isSubmitting, error: storeError } = useAdminCycleStore();

  // --- Estado Local ---
  const [textInput, setTextInput] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [failedLines, setFailedLines] = useState<FailedLine[]>([]);

  // Estado para correção em massa
  const [fixingItems, setFixingItems] = useState<FixingItem[]>([]);
  const [isFixingErrors, setIsFixingErrors] = useState(false);

  const [openingDate, setOpeningDate] = useState<Date | null>(new Date());
  const [closingDate, setClosingDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });

  useEffect(() => {
    return () => resetNavigation();
  }, [resetNavigation]);

  const handleReset = useCallback(() => {
    setTextInput('');
    setDescription('');
    setProducts([]);
    setFailedLines([]);
    setFixingItems([]);
    setIsFixingErrors(false);
    resetNavigation();
  }, [resetNavigation]);

  const handleParse = useCallback(() => {
    const { products: parsedProducts, failedLines: failures } = parseProductList(textInput);
    setProducts(parsedProducts);
    setFailedLines(failures);

    // Se houver falhas, não entra em modo de correção automático,
    // apenas mostra o ValidateStep com o alerta, igual ao original.
    setStep('validate-list');
    setIsFixingErrors(false);
  }, [textInput, setStep]);

  // Lógica original: converte TODAS as falhas em itens editáveis de uma vez
  const handleStartFixing = useCallback(() => {
    const priceRegex = /(?:[R$]\s*)?(\d+[.,]?\d*)\s*(\/.*)?$/i;

    const itemsToFix = failedLines.map((fail, idx) => {
      const cleanText = fail.text.replace(/[\-*•]/g, '').trim();
      let estimatedName = cleanText;

      const priceMatch = priceRegex.exec(cleanText);
      if (priceMatch) {
        estimatedName = cleanText.substring(0, priceMatch.index).trim();
      }

      return {
        id: `fix-${idx}-${fail.text.length}`,
        originalText: fail.text,
        category: fail.category || '',
        name: estimatedName,
        price: '', // O usuário deve preencher
        unit: 'unidade',
      };
    });

    setFixingItems(itemsToFix);
    setIsFixingErrors(true);
  }, [failedLines]);

  const handleUpdateFixingItem = useCallback(
    (id: string, field: keyof FixingItem, value: string) => {
      setFixingItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      );
    },
    [],
  );

  // Processa todos os itens corrigidos
  const handleProcessFixedItems = useCallback(() => {
    const stillInvalid: FixingItem[] = [];
    const validNewProducts: IProduct[] = [];

    fixingItems.forEach((item) => {
      const priceNum = parseFloat(item.price.replace(',', '.'));

      if (item.name.trim().length > 2 && !isNaN(priceNum) && priceNum > 0) {
        validNewProducts.push({
          name: item.name.trim(),
          category: item.category,
          available: true,
          measure: {
            type: item.unit,
            value: priceNum,
          },
        });
      } else {
        stillInvalid.push(item);
      }
    });

    if (validNewProducts.length > 0) {
      setProducts((prev) => [...prev, ...validNewProducts]);
    }

    setFixingItems(stillInvalid);

    if (stillInvalid.length === 0) {
      setIsFixingErrors(false);
      setFailedLines([]); // Limpa as falhas pois foram todas resolvidas
    } else {
      // Opcional: Feedback visual de que ainda faltam itens
      // alert(`Atenção: ${stillInvalid.length} itens ainda estão incorretos.`);
    }
  }, [fixingItems]);

  const handleRemoveProduct = useCallback((indexToRemove: number) => {
    setProducts((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!openingDate || !closingDate) return;

    const finalDescription = description.trim()
      ? description
      : `Ciclo de ${openingDate.toLocaleDateString()}`;

    const success = await createCycle({
      description: finalDescription,
      openingDate,
      closingDate,
      products,
    });

    if (success) {
      handleReset();
    }
  }, [createCycle, openingDate, closingDate, products, description, handleReset]);

  return {
    state: {
      step: currentStep,
      textInput,
      description,
      products,
      failedLines,
      fixingItems, // Array
      openingDate,
      closingDate,
      isSubmitting,
      storeError,
      isFixingErrors,
    },
    actions: {
      setStep,
      setTextInput,
      setDescription,
      setOpeningDate,
      setClosingDate,
      handleParse,
      handleStartFixing,
      handleUpdateFixingItem,
      handleProcessFixedItems,
      handleRemoveProduct,
      handleSubmit,
      handleReset,
    },
  };
};
