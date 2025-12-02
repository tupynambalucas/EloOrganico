import { forwardRef, useState } from 'react';
import { parseProductList } from './SharingFunctions';
import DatePicker, { registerLocale } from 'react-datepicker';
import CurrentSharingStyles from '@cssComponents/admin-panel/panels/sharing/current-sharing.module.css';
import { ptBR } from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);
import 'react-datepicker/dist/react-datepicker.css';
import { set } from 'date-fns';
import type { SharingFormData } from '../../../../../../components/react/admin-panel/panels/sharing';
// Type definitions remain the same

// This helper component is fine as is
const CustomDataButton = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(({ value, onClick }, ref) => (
  <button className={CurrentSharingStyles.dataPicker} type="button" onClick={onClick} ref={ref}>
    {value || 'Escolha uma data'}
  </button>
));

// 1. Define the props for SharingForm in a separate type for clarity
type SharingFormProps = {
  onSharingCreate: (data: SharingFormData) => void;
};

// 2. Convert the component to use a block body with an explicit return
const SharingForm = forwardRef<HTMLDivElement, SharingFormProps>(
  (props, ref) => {
    // Destructure props for easier access
    const {
      onSharingCreate
    } = props;

    const [products, setProducts] = useState<SharingFormData['products']>([]);
    const [openingDate, setOpeningDate] = useState<Date | null>(null);
    const [closingDate, setClosingDate] = useState<Date | null>(null);
    const [formAction, setFormAction] = useState(1);
    const [description, setDescription] = useState('');
    const formNextAction = () => setFormAction(formAction + 1);
    const formPrevAction = () => setFormAction(formAction - 1);
    const [listIsValid, setListIsValid] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); // Previne que a página seja recarregada

      // Validações podem ser adicionadas aqui (ex: verificar se as datas foram preenchidas)
      if (!openingDate || !closingDate) {
        alert('Por favor, preencha as datas de abertura e fechamento.');
        return;
      }
      
      // Agrupa todos os dados do estado em um único objeto
      const formData: SharingFormData = {
        products,
        description,
        openingDate,
        closingDate,
      };

      // Chama a função recebida via props, passando os dados do formulário para o componente pai
      onSharingCreate(formData);
    };
    // You can add any other component logic here before the return statement

    return (
      <div className={CurrentSharingStyles.sharingCreate} ref={ref}>
        {listIsValid ? (
          <div className={CurrentSharingStyles.form}>
            {/* Form content for when the list is valid */}
            <form onSubmit={handleSubmit}>
              <div>
                <textarea 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder='Descrição' 
                />
              </div>
              <div>
                <div>
                  <p className='Inter-Regular'>Data Abertura</p>
                  <DatePicker
                    selected={openingDate}
                    onChange={(date: Date) => setOpeningDate(date)}
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeCaption="Horário"
                    customInput={<CustomDataButton />}
                  />
                </div>
                <div>
                  <p className='Inter-Regular'>Data Fechamento</p>
                  <DatePicker
                    selected={closingDate}
                    onChange={(date: Date) => setClosingDate(date)}
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeCaption="Horário"
                    customInput={<CustomDataButton />}
                  />
                </div>
              </div>
              <button type='submit'>Criar Partilha</button>
            </form>
          </div>
        ) : (
          <div className={CurrentSharingStyles.listInput}>
            {/* Input area for when the list is not yet valid */}
            <textarea
              placeholder='Copie e cole a lista aqui...'
              onChange={(e) => setProducts(parseProductList(e.target.value))}
            />
            <button onClick={() => setListIsValid(true)}>Aprovar Lista</button>
          </div>
        )}
        <div className={CurrentSharingStyles.adminValidation}>
          {/* This part is now outside the conditional, but you might want to move it inside */}
          <div>
            {products.map((product, index) => (
              <div key={index} className={CurrentSharingStyles.product}>
                <div>
                  <div>
                    <p className='Inter-Semibold'>{product.name}</p>
                  </div>
                  <div>
                    {product.measure.minimumOrder ? (
                      <p className='Inter-Regular'>
                        Pedido Mínimo: {product.measure.minimumOrder.type} de {product.measure.minimumOrder.value}
                      </p>
                    ) : (
                      <p className='Inter-Regular'>Sem pedido mínimo</p>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <p className='Inter-Light'>{product.category}</p>
                  </div>
                  <div>
                    <p className='Inter-Bold'>
                      R${product.measure.value} {`[${product.measure.type}]`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default SharingForm;