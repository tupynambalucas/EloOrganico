# Implementação de Nova Funcionalidade: "Feirinha"

**Objetivo:** Implementar uma nova funcionalidade no sistema chamada "Feirinha". Esta funcionalidade irá gerenciar as vendas em eventos especiais e com localização física.

## Principais Diferenças da "Partilha" (Ciclo de Compartilhamento)

- **Localização:** Ao contrário do sistema principal de "Partilha", que está vinculado à Ecovila, os eventos da "Feirinha" podem acontecer em qualquer lugar.
- **Estado:** A "Partilha" opera com estados claros (Aberto, Pendente, Fechado). Uma "Feirinha" é sem estado; múltiplos eventos podem ocorrer simultaneamente ou em sucessão próxima sem influenciar um ao outro.
- **Pedidos:** Se a data de uma "Feirinha" coincidir com a data de uma "Partilha", os pedidos são processados juntos, mas permanecem como entidades logicamente separadas.

## Requisitos Essenciais

### 1. Isolamento de Dados

- **Rastreamento Separado:** Os produtos da "Feirinha" devem ser rastreados independentemente dos produtos da "Partilha".
- **Documento de Banco de Dados Dedicado:** Um modelo/documento de banco de dados separado deve ser criado para os eventos e vendas da "Feirinha". Isso é crucial para que os administradores possam monitorar o progresso do evento e diferenciar os canais de venda (Feirinha vs. Partilha).

### 2. Processamento de Pagamentos

- **Pagamento Imediato:** Todas as compras na "Feirinha" devem ser pagas no momento da transação.
- **Sem Sistema de Crédito/Débito:** O sistema de crédito/débito existente usado na "Partilha" (onde os membros podem ter um saldo) **não** se aplica à "Feirinha". Como esses eventos podem acontecer em qualquer lugar com clientes potencialmente não recorrentes, um modelo de "pagamento no ato" é obrigatório.
- **Registro de Pagamentos:** O sistema deve registrar os pagamentos da "Feirinha" separadamente dos pagamentos da "Partilha" para garantir uma contabilidade financeira clara para os administradores.

### 3. Interface Administrativa

- **Painel Dedicado:** Assim como a "Partilha" tem seu próprio painel de gerenciamento, a funcionalidade "Feirinha" requer sua própria interface dedicada no painel de administração. Isso permitirá a criação, gerenciamento e monitoramento dos eventos de feira e suas vendas associadas.
