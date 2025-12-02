const normalizeMeasureType = (unitString: string) => {
  const type = unitString.toLowerCase();
  if (type === 'pct') return 'pacote';
  if (type === 'uni') return 'unidade';
  return type; // Retorna 'kg' ou qualquer outro como está
};

const normalizeMinimumOrderType = (typeString: string) => {
  if (!typeString) return '';
  const type = typeString.toLowerCase();
  if (type === 'cx') return 'caixa';
  return type; // retorna 'saca' como está
};

export const parseProductList = (list: string) => {
  if (!list) return [];

  const lines = list.split('\n');
  const products = [];
  let currentCategory = "organicos"; // Categoria padrão

  const complexProductRegex = /^(.*?)\s+(kg|uni|pct)\s*(.*?)\s*([$]?\s*[\d,.]+)\s*(?:\/(cx|saca)\s*(.*))?$/i;
  const simpleProductRegex = /^(.*?)\s+([$]?\s*[\d,.]+)$/i;

  const ignorePatterns = [
    'olá',
    'segue previsão'
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    if (ignorePatterns.some(pattern => trimmedLine.toLowerCase().startsWith(pattern))) {
      continue;
    }

    const cleanedLine = trimmedLine.replace(/^\s*/, '').trim();

    const complexMatch = cleanedLine.match(complexProductRegex);
    const simpleMatch = cleanedLine.match(simpleProductRegex);

    if (complexMatch) {
      try {
        const [, productNameRaw, measureTypeRaw, contentRaw, valueRaw, minimumOrderTypeRaw, minimumOrderValueRaw] = complexMatch;
        
        const productName = productNameRaw.trim();
        const measureType = normalizeMeasureType(measureTypeRaw);
        const content = [measureTypeRaw, contentRaw].join(' ').trim();
        
        // LINHA CORRIGIDA com .toFixed(2)
        const value = parseFloat(valueRaw.replace(/[$\s]/g, '').replace(',', '.')).toFixed(2);

        const minimumOrder = minimumOrderTypeRaw && minimumOrderValueRaw
          ? {
              type: normalizeMinimumOrderType(minimumOrderTypeRaw),
              value: minimumOrderValueRaw.trim()
            }
          : false;

        products.push({
          name: productName,
          category: currentCategory,
          measure: {
            type: measureType,
            value: value,
            content: content,
            minimumOrder: minimumOrder,
          },
        });
      } catch (error) {
        console.error(`Erro ao formatar a linha complexa: "${cleanedLine}"`, error);
      }
    } else if (simpleMatch) {
      try {
        const [, productNameRaw, valueRaw] = simpleMatch;
        const productName = productNameRaw.trim();

        // E AQUI com .toFixed(2)
        const value = parseFloat(valueRaw.replace(/[$\s]/g, '').replace(',', '.')).toFixed(2);

        products.push({
          name: productName,
          category: currentCategory,
          measure: {
            type: 'unidade',
            value: value,
            content: 'unidade',
            minimumOrder: false,
          },
        });
      } catch (error) {
        console.error(`Erro ao formatar a linha simples: "${cleanedLine}"`, error);
      }
    } else {
      currentCategory = cleanedLine.replace(/[;:]$/, '').trim();
    }
  }
  
  return products;
};