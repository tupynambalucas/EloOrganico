import React from 'react';
import styles from './styles.module.css';

import { useCycleCreate } from './useCycleCreate';
import { InputStep } from './steps/InputStep';
import { FixErrorsStep } from './steps/FixErrorsStep';
import { ValidateStep } from './steps/ValidateStep';
import { ScheduleStep } from './steps/ScheduleStep';

const CycleCreate: React.FC = () => {
  const { state, actions } = useCycleCreate();

  const renderValidateOrFix = () => {
    // Se estiver no modo de correção (Fixing Items)
    if (state.isFixingErrors) {
      return (
        <FixErrorsStep
          fixingItems={state.fixingItems}
          onUpdateItem={actions.handleUpdateFixingItem}
          onProcessFixed={actions.handleProcessFixedItems}
        />
      );
    }

    // Se estiver no modo de validação normal
    return (
      <ValidateStep
        products={state.products}
        failedLines={state.failedLines}
        onRemoveProduct={actions.handleRemoveProduct}
        onStartFixing={actions.handleStartFixing}
        onBack={() => actions.setStep('input-list')}
        onNext={() => actions.setStep('config-cycle')}
      />
    );
  };

  return (
    <div className={styles.container}>
      {/* Exibir erro global se houver */}
      {state.storeError && <div className={styles.errorMessage}>{state.storeError}</div>}

      {/* Passo 1: Input */}
      {state.step === 'input-list' && (
        <InputStep
          value={state.textInput}
          onChange={actions.setTextInput}
          onParse={actions.handleParse}
          onCancel={actions.handleReset}
        />
      )}

      {/* Passo 2: Validar e/ou Corrigir */}
      {state.step === 'validate-list' && renderValidateOrFix()}

      {/* Passo 3: Configurar Datas */}
      {state.step === 'config-cycle' && (
        <ScheduleStep
          description={state.description}
          setDescription={actions.setDescription}
          openingDate={state.openingDate}
          closingDate={state.closingDate}
          isSubmitting={state.isSubmitting}
          onOpeningDateChange={actions.setOpeningDate}
          onClosingDateChange={actions.setClosingDate}
          onBack={() => actions.setStep('validate-list')}
          onSubmit={(e) => {
            e.preventDefault();
            void actions.handleSubmit();
          }}
        />
      )}
    </div>
  );
};

export default CycleCreate;
