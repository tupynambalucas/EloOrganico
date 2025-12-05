import type { IProduct } from '@elo-organico/shared';

const normalizeMeasureType = (unitString: string) => {
  const type = unitString.toLowerCase();
  if (type === 'pct') return 'pacote';
  if (type === 'uni') return 'unidade';
  return type;
};

const normalizeMinimumOrderType = (typeString: string) => {
  if (!typeString) return '';
  const type = typeString.toLowerCase();
  if (type === 'cx') return 'caixa';
  return type;
};

export const parseProductList = (list: string): IProduct[] => {
  if (!list) return [];

  const lines = list.split('\n');
  
  const products: Omit<IProduct, '_id'>[] = []; 
  let currentCategory = "organicos"; 

  const complexProductRegex = /^(.*?)\s+(kg|uni|pct)\s*(.*?)\s*([$]?\s*[\d,.]+)\s*(?:\/(cx|saca)\s*(.*))?$/i;
  const simpleProductRegex = /^(.*?)\s+([$]?\s*[\d,.]+)$/i;

  const ignorePatterns = ['olá', 'segue previsão'];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || ignorePatterns.some(pattern => trimmedLine.toLowerCase().startsWith(pattern))) {
      continue;
    }

    const cleanedLine = trimmedLine.replace(/^\s*/, '').trim();
    const complexMatch = cleanedLine.match(complexProductRegex);
    const simpleMatch = cleanedLine.match(simpleProductRegex);

    if (complexMatch) {
      try {
        const [, productNameRaw, measureTypeRaw, , valueRaw, minimumOrderTypeRaw, minimumOrderValueRaw] = complexMatch;
        
        const value = parseFloat(valueRaw.replace(/[$\s]/g, '').replace(',', '.')).toFixed(2);
        
        const minimumOrder = minimumOrderTypeRaw && minimumOrderValueRaw
          ? {
              type: normalizeMinimumOrderType(minimumOrderTypeRaw),
              value: minimumOrderValueRaw.trim()
            }
          : undefined;

        products.push({
          name: productNameRaw.trim(),
          category: currentCategory,
          available: true,
          measure: {
            type: normalizeMeasureType(measureTypeRaw),
            value: Number(value) || value,
            minimumOrder: minimumOrder,
          },
        });
      } catch (error) {
        console.error(`Erro parse complexo: "${cleanedLine}"`, error);
      }
    } else if (simpleMatch) {
      try {
        const [, productNameRaw, valueRaw] = simpleMatch;
        const value = parseFloat(valueRaw.replace(/[$\s]/g, '').replace(',', '.')).toFixed(2);

        products.push({
          name: productNameRaw.trim(),
          category: currentCategory,
          available: true,
          measure: {
            type: 'unidade',
            value: Number(value) || value,
          },
        });
      } catch (error) {
        console.error(`Erro parse simples: "${cleanedLine}"`, error);
      }
    } else {
      currentCategory = cleanedLine.replace(/[;:]$/, '').trim();
    }
  }
  
  return products as IProduct[];
};