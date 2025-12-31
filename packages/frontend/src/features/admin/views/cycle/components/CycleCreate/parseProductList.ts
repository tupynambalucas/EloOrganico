import type { IProduct } from '@elo-organico/shared';

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
  HORTIFRUTI: 'Hortifruti',
  MERCEARIA: 'Mercearia',
  GELEIAS: 'Geleias e Doces',
  'GELEIAS SEM AÇÚCAR': 'Geleias e Doces',
  DOCES: 'Geleias e Doces',
  VINHOS: 'Bebidas e Vinhos',
  BEBIDAS: 'Bebidas e Vinhos',
  'VINHOS EM GARRAFAS': 'Bebidas e Vinhos',
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
  return parseFloat(
    priceStr
      .replace(/[R$\s]/g, '')
      .replace(',', '.')
      .trim(),
  );
};

export const parseProductList = (text: string): ParseResult => {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  const products: IProduct[] = [];
  const failedLines: FailedLine[] = [];

  let currentCategory = 'Hortifruti';

  const contentRegex = /(?:\(|^|\s)(\d+(?:[.,]\d+)?)\s*(g|gr|kg|ml|l|lt|litros?)(?:\)|$|\s)/im;
  const priceRegex = /(?:[R$]\s*)?(\d+[.,]\d{2})\s*(\/.*)?$/i;
  const bulletRegex = /^[\-*•]/;
  const numbersCheckRegex = /\d/g;
  const headerCheckRegex = /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/;
  const unitSuffixRegex = /\s(kg|un|uni|unidade|pct|pcte|maço|bandeja|litro|l)\s*$/i;
  const minOrderRegex = /\/\s*(cx|saca|fardo)\s*([\d.,]+)\s*(kg|un)?/i;

  for (const line of lines) {
    let cleanedLine = line.trim();

    const hasBullet = bulletRegex.test(cleanedLine);
    cleanedLine = cleanedLine.replace(/^[\-*•]\s*/, '').trim();

    const numbersCount = (cleanedLine.match(numbersCheckRegex) ?? []).length;
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

      if (!detectedCategory && headerCheckRegex.test(headerText) && headerText.length > 3) {
        detectedCategory =
          cleanedLine.charAt(0).toUpperCase() +
          cleanedLine.slice(1).toLowerCase().replace(/[;:]$/, '');
      }

      if (detectedCategory) {
        currentCategory = detectedCategory;
        continue;
      }
      continue;
    }

    const priceMatch = priceRegex.exec(cleanedLine);

    if (!priceMatch) {
      if (hasBullet) {
        failedLines.push({
          text: line.trim(),
          category: currentCategory,
        });
      }
      continue;
    }

    const priceRaw = priceMatch[1];
    const priceValue = parsePrice(priceRaw);
    const extraInfo = priceMatch[2] ? priceMatch[2].trim() : '';

    let nameAndUnit = cleanedLine.substring(0, priceMatch.index).trim();

    let saleUnit = 'unidade';
    const unitMatch = unitSuffixRegex.exec(nameAndUnit);

    if (unitMatch) {
      saleUnit = normalizeMeasureType(unitMatch[1]);
      nameAndUnit = nameAndUnit.substring(0, unitMatch.index).trim();
    } else {
      if (nameAndUnit.toLowerCase().includes('garrafão')) saleUnit = 'garrafão';
      else if (nameAndUnit.toLowerCase().includes('pote')) saleUnit = 'unidade';
      else if (nameAndUnit.toLowerCase().includes('vinho')) saleUnit = 'garrafa';
    }

    let contentData: { value: number; unit: 'g' | 'kg' | 'ml' | 'L' } | undefined = undefined;
    const contentMatch = contentRegex.exec(nameAndUnit);

    if (contentMatch) {
      const contentValue = parseFloat(contentMatch[1].replace(',', '.'));
      const contentUnitRaw = contentMatch[2];

      contentData = {
        value: contentValue,
        unit: normalizeContentUnit(contentUnitRaw),
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
      const minOrderMatch = minOrderRegex.exec(extraInfo);
      if (minOrderMatch) {
        minimumOrder = {
          type: minOrderMatch[1].toLowerCase(),
          value: parseFloat(minOrderMatch[2].replace(',', '.')),
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
        minimumOrder,
      },
      content: contentData,
    });
  }

  return {
    products,
    failedLines,
    totalLinesProcessed: lines.length,
  };
};
