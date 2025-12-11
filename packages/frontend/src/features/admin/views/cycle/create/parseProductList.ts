import type { IProduct } from '@elo-organico/shared';

// Alterada a interface para incluir a categoria na falha
export interface FailedLine {
  text: string;
  category: string;
}

export interface ParseResult {
  products: IProduct[];
  failedLines: FailedLine[];
  totalLinesProcessed: number;
}

const CATEGORY_NORMALIZATION: Record<string, string> = {
  'ALIMENTOS ORGÂNICOS': 'Hortifruti',
  'HORTIFRUTI': 'Hortifruti',
  'MERCEARIA': 'Mercearia',
  'GELEIAS': 'Geleias e Doces',
  'GELEIAS SEM AÇÚCAR': 'Geleias e Doces',
  'DOCES': 'Geleias e Doces',
  'VINHOS': 'Bebidas e Vinhos',
  'BEBIDAS': 'Bebidas e Vinhos',
  'VINHOS EM GARRAFAS': 'Bebidas e Vinhos'
};

const normalizeMeasureType = (unitString: string) => {
  if (!unitString) return 'unidade';
  const type = unitString.toLowerCase().trim().replace('.', '');
  
  if (['pct', 'pcte', 'pacote'].includes(type)) return 'pacote';
  if (['uni', 'un', 'unidade'].includes(type)) return 'unidade';
  if (['l', 'litro', 'lt', 'garrafa'].includes(type)) return 'litro';
  if (['kg', 'quilo', 'kilo'].includes(type)) return 'kg';
  if (['maço', 'maco'].includes(type)) return 'maço';
  if (['bandeja', 'bdj'].includes(type)) return 'bandeja';
  
  return type; 
};

const normalizeContentUnit = (unit: string): 'g' | 'kg' | 'ml' | 'L' => {
  const u = unit.toLowerCase().trim().replace('.', '');
  if (['g', 'gr', 'gramas'].includes(u)) return 'g';
  if (['kg', 'kilo'].includes(u)) return 'kg';
  if (['ml'].includes(u)) return 'ml';
  if (['l', 'lt', 'litro', 'litros'].includes(u)) return 'L';
  return 'g';
};

const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace(/[R$\s]/g, '').replace(',', '.').trim());
};

export const parseProductList = (text: string): ParseResult => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const products: IProduct[] = [];
  const failedLines: FailedLine[] = []; // Array de objetos agora
  
  let currentCategory = 'Hortifruti';

  const contentRegex = /(?:\(|^|\s)(\d+(?:[.,]\d+)?)\s*(g|gr|kg|ml|l|lt|litros?)(?:\)|$|\s)/im;

  for (const line of lines) {
    let cleanedLine = line.trim();
    
    const hasBullet = /^[\-*•]/.test(cleanedLine);
    cleanedLine = cleanedLine.replace(/^[\-*•]\s*/, '').trim();

    // 1. Detecção de Categoria
    const numbersCount = (cleanedLine.match(/\d/g) || []).length;
    const isCategoryCandidate = numbersCount < 2 && cleanedLine.length < 50;
    
    if (isCategoryCandidate) {
      const headerText = cleanedLine.replace(/[;:]$/, '').toUpperCase().trim();
      let detectedCategory = null;
      
      for (const [key, value] of Object.entries(CATEGORY_NORMALIZATION)) {
        if (headerText.includes(key)) {
          detectedCategory = value;
          break;
        }
      }

      if (!detectedCategory && /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/.test(headerText) && headerText.length > 3) {
         detectedCategory = cleanedLine.charAt(0).toUpperCase() + cleanedLine.slice(1).toLowerCase().replace(/[;:]$/, '');
      }

      if (detectedCategory) {
        currentCategory = detectedCategory;
        continue; 
      }
      continue; // Lixo/Saudação
    }

    // 2. Extração de Preço
    const priceRegex = /(?:[R$]\s*)?(\d+[.,]\d{2})\s*(\/.*)?$/i;
    const priceMatch = cleanedLine.match(priceRegex);

    if (!priceMatch) {
        // Se tinha bullet, é quase certeza que era pra ser um produto
        if (hasBullet) {
            failedLines.push({
                text: line.trim(),
                category: currentCategory // Salva a categoria atual para o contexto da correção
            });
        }
        continue; 
    }

    // --- Processamento de Sucesso ---
    const priceRaw = priceMatch[1];
    const priceValue = parsePrice(priceRaw);
    const extraInfo = priceMatch[2] ? priceMatch[2].trim() : '';

    let nameAndUnit = cleanedLine.substring(0, priceMatch.index).trim();

    let saleUnit = 'unidade';
    const unitMatch = nameAndUnit.match(/\s(kg|un|uni|unidade|pct|pcte|maço|bandeja|litro|l)\s*$/i);
    
    if (unitMatch) {
      saleUnit = normalizeMeasureType(unitMatch[1]);
      nameAndUnit = nameAndUnit.substring(0, unitMatch.index).trim();
    } else {
      if (nameAndUnit.toLowerCase().includes('garrafão')) saleUnit = 'garrafão';
      else if (nameAndUnit.toLowerCase().includes('pote')) saleUnit = 'unidade';
      else if (nameAndUnit.toLowerCase().includes('vinho')) saleUnit = 'garrafa';
    }

    let contentData = undefined;
    const contentMatch = nameAndUnit.match(contentRegex);

    if (contentMatch) {
      const contentValue = parseFloat(contentMatch[1].replace(',', '.'));
      const contentUnitRaw = contentMatch[2];
      
      contentData = {
        value: contentValue,
        unit: normalizeContentUnit(contentUnitRaw)
      };

      nameAndUnit = nameAndUnit.replace(contentMatch[0], '').trim();
      nameAndUnit = nameAndUnit.replace(/\(\)/g, '').trim();
    }

    let finalName = nameAndUnit
      .replace(/[;.,-]$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    finalName = finalName.charAt(0).toUpperCase() + finalName.slice(1);

    let minimumOrder = undefined;
    if (extraInfo) {
       const minOrderMatch = extraInfo.match(/\/\s*(cx|saca|fardo)\s*([\d.,]+)\s*(kg|un)?/i);
       if (minOrderMatch) {
         minimumOrder = {
           type: minOrderMatch[1].toLowerCase(),
           value: parseFloat(minOrderMatch[2].replace(',', '.'))
         };
       }
    }

    products.push({
      name: finalName,
      category: currentCategory,
      available: true,
      measure: {
        type: saleUnit,
        value: priceValue,
        minimumOrder
      },
      content: contentData
    });
  }
  
  return {
    products,
    failedLines,
    totalLinesProcessed: lines.length
  };
};