import type { IProduct } from '@elo-organico/shared';
import type { FailedLine } from './parseProductList';

export interface FixingItem {
  id: string;
  originalText: string;
  category: string;
  name: string;
  price: string;
  unit: string;
}

export interface CycleCreateState {
  textInput: string;
  description: string;
  products: IProduct[];
  failedLines: FailedLine[];
  fixingItems: FixingItem[]; // <--- Array para edição em massa
  openingDate: Date | null;
  closingDate: Date | null;
  isSubmitting: boolean;
  storeError: string | null;
  isFixingErrors: boolean;
}
