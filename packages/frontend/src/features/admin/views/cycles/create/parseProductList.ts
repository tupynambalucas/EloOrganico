import type { IProduct } from '@elo-organico/shared';

// Mapa de Normalização (De -> Para)
const CATEGORY_MAP: Record<string, string> = {
  'ALIMENTOS ORGÂNICOS': 'Hortifruti', // Caso apareça no texto
  'MERCEARIA': 'Mercearia',
  'Geleias 320 g': 'Geleias e Doces',
  'GELEIAS SEM AÇÚCAR': 'Geleias e Doces',
  'Vinhos em garrafas;': 'Bebidas e Vinhos'
};

// Mapa de Contexto (Adiciona sufixo ao nome se necessário)
const CONTEXT_SUFFIX_MAP: Record<string, string> = {
  'GELEIAS SEM AÇÚCAR': ' (Sem Açúcar)',
  'Geleias 320 g': ' (320g)'
};

const normalizeMeasureType = (unitString: string) => {
  const type = unitString.toLowerCase().trim();
  if (['pct', 'pcte'].includes(type)) return 'pacote';
  if (['uni', 'un'].includes(type)) return 'unidade';
  if (['l', 'litro'].includes(type)) return 'litro';
  if (type === 'ml') return 'ml';
  return type; 
};

const normalizeMinimumOrderType = (typeString: string) => {
  if (!typeString) return '';
  const type = typeString.toLowerCase().trim();
  if (type === 'cx') return 'caixa';
  if (type === 'saca') return 'saca';
  return type;
};

const parsePrice = (raw: string): number => {
  return parseFloat(raw.replace(/[$\s]/g, '').replace(',', '.'));
};

export const parseProductList = (list: string): IProduct[] => {
  if (!list) return [];

  const lines = list.split('\n');
  const products: IProduct[] = [];
  
  // Estado Inicial: Começa assumindo Hortifruti para os primeiros itens
  let currentNormalizedCategory = "Hortifruti";
  let currentNameSuffix = "";

  // Regex para linha de produto completa
  // Ex:  Abobrinha italiana kg $ 8,90/cx 20 kg
  const productLineRegex = /^(?:\s*)?(.+?)\s+(kg|uni|pct|l|ml|g|und)\s+(?:.*?)([$]?\s*[\d,.]+)(?:\s*\/\s*(.*))?$/i;
  
  // Regex para linha simples (ex: Vinho tinto garrafão $ 60,00)
  const simpleLineRegex = /^(?:\s*)?(.+?)\s+([$]?\s*[\d,.]+)$/i;

  // Termos para ignorar (Saudações e textos informativos)
  const ignorePatterns = ['olá', 'segue', 'previsão', 'disponibilidade', 'ecoterra', 'semana'];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;
    
    // Verifica se é uma linha de ignorar
    if (ignorePatterns.some(p => trimmedLine.toLowerCase().startsWith(p))) continue;

    // Tenta dar match de produto
    const complexMatch = trimmedLine.match(productLineRegex);
    const simpleMatch = trimmedLine.match(simpleLineRegex);

    // Se NÃO for produto e NÃO começa com a seta típica '', assumimos que é Categoria
    const isProductLine = trimmedLine.startsWith('') || complexMatch || simpleMatch;
    
    if (!isProductLine) {
      // Nova Categoria Detectada
      const rawCat = trimmedLine.replace(/[:;]$/, '').trim(); // Remove pontuação final
      
      // Lógica de Normalização
      if (CATEGORY_MAP[rawCat]) {
        currentNormalizedCategory = CATEGORY_MAP[rawCat];
      } else {
        // Heurísticas de fallback
        if (rawCat.toLowerCase().includes('geleia')) currentNormalizedCategory = 'Geleias e Doces';
        else if (rawCat.toLowerCase().includes('vinho')) currentNormalizedCategory = 'Bebidas e Vinhos';
        else currentNormalizedCategory = rawCat; // Usa o texto original se não conhecer
      }

      // Define sufixo de contexto (ex: Sem Açúcar)
      currentNameSuffix = CONTEXT_SUFFIX_MAP[rawCat] || "";
      continue;
    }

    // Processamento do Produto
    if (complexMatch) {
      try {
        const [, nameRaw, unitRaw, priceRaw, minOrderRaw] = complexMatch;
        
        let finalName = nameRaw.trim();
        // Evita duplicação do sufixo se o nome já tiver
        if (currentNameSuffix && !finalName.includes(currentNameSuffix.trim())) {
           finalName += currentNameSuffix;
        }

        let minimumOrder = undefined;
        if (minOrderRaw) {
            const minOrderParts = minOrderRaw.trim().split(/\s+/);
            if (minOrderParts.length >= 1) {
                minimumOrder = {
                    type: normalizeMinimumOrderType(minOrderParts[0]),
                    value: minOrderParts.slice(1).join(' ') || '1'
                };
            }
        }

        products.push({
          name: finalName,
          category: currentNormalizedCategory,
          available: true,
          measure: {
            type: normalizeMeasureType(unitRaw),
            value: parsePrice(priceRaw),
            minimumOrder
          }
        });
      } catch (error) {
        console.warn('Erro ao processar linha complexa:', trimmedLine, error);
      }
    } else if (simpleMatch) {
      try {
        const [, nameRaw, priceRaw] = simpleMatch;
        
        let finalName = nameRaw.trim();
        if (currentNameSuffix && !finalName.includes(currentNameSuffix.trim())) {
            finalName += currentNameSuffix;
        }

        // Inferência de unidade para linhas simples
        let unit = 'unidade';
        if (finalName.toLowerCase().includes('garrafão')) unit = 'garrafão';
        else if (finalName.toLowerCase().includes('kg')) unit = 'kg';

        products.push({
          name: finalName,
          category: currentNormalizedCategory,
          available: true,
          measure: {
            type: unit,
            value: parsePrice(priceRaw)
          }
        });
      } catch (error) {
        console.warn('Erro ao processar linha simples:', trimmedLine, error);
      }
    }
  }

  // Deduplicação por nome (Enterprise Standard)
  const uniqueProducts = Array.from(new Map(products.map(item => [item.name, item])).values());

  return uniqueProducts;
};