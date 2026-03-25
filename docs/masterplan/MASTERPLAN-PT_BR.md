# **Documento Mestre do Projeto** 

## **Plataforma de Gestão e Partilha de Orgânicos**

| Status: | 🟢 Documentação Viva (Atualizado em 22 de Janeiro de 2026 |
| :---- | :---- |
| **Projeto:** | Elo Orgânico |
| **Escopo Principal:** | Digitalização e Otimização da Cadeia de Partilha de Produtos Orgânicos. |

### **🚀 Fase 1: Proposta Funcional e Escopo**

Este documento detalha o desenvolvimento de uma plataforma digital robusta para a gestão otimizada da partilha de produtos orgânicos da ecovila. Nosso objetivo estratégico é migrar processos manuais baseados em planilhas e mensagens para um sistema centralizado, de alta performance e escalabilidade.

#### **1.1. Escopo e Fluxo Operacional**

A solução é arquitetada em dois ambientes integrados: um **Painel Administrativo (Backend)** e um **Portal para Clientes (Frontend)**.

**Fluxo de um Ciclo (End-to-End):**

* **Configuração do Ciclo:** O administrador define e programa as janelas(ciclo) de compra com datas de abertura e fechamento.  
* **Ingestão de Produtos:** A lista de produtos (texto plano) é processada por um *parser* inteligente que realiza a validação, tipagem e estruturação automática.  
* **Abertura de Compras:** O catálogo é habilitado automaticamente para os membros na data programada.  
* **Execução de Pedidos:** Os membros montam cestos personalizados e submetem os pedidos via portal.  
* **Processamento de Pagamento:** Integração direta com a API do **EFI Bank** para pagamentos via Pix.  
* **Confirmação:** O sistema realiza a conciliação bancária e confirma o pedido automaticamente.

### **1.2. Arquitetura Tecnológica Resumida**

Uma *stack* moderna e independente para garantir agilidade e controle:

| Componente | Tecnologia | Benefício Primário |
| :---- | :---- | :---- |
| **Backend** | Fastify (Node.js) \+ Zod | Alta performance, tipagem rigorosa (segurança) e eficiência. |
| **Frontend** | React 19, Vite e Zustand | Single Page Application (SPA) rápida, responsiva e com gestão de estado otimizada. |
| **Banco de Dados** | Cluster MongoDB (Self-hosted Replica Set) | Flexibilidade de esquema e alta disponibilidade transacional (ACID). |
| **Infraestrutura** | Docker em VPS Linux (Hetzner Cloud) | Total controle, baixo custo fixo e portabilidade. |

### **1.3. Módulos e Funcionalidades Chave**

| Módulo | Funcionalidades Críticas de Negócio |
| :---- | :---- |
| **Painel Administrativo** | 🔒 Autenticação de Alto Nível • Gestão Completa de Ciclos (CRUD) • **Parser Inteligente de Produtos** • Relatórios Logísticos e Fiscais. |
| **Portal do Cliente** | 👤 Login/Registro (Temática Avatares da Fauna) • **Catálogo Dinâmico e Sazonal** • Carrinho Otimizado e Checkout • Pagamento Simplificado via **Pix (QR Code / Copia e Cola)**. |

## **⚙️ Fase 2: Especificação Técnica e Arquitetura**

### **2.1. Resumo Executivo**

A arquitetura é baseada em uma aplicação web coesa, utilizando a *stack* JavaScript/TypeScript. Priorizamos a robustez, tipagem estrita (TypeScript Strict Mode) e a independência de fornecedores (*vendor lock-in*). A implantação é totalmente conteinerizada (Docker Compose) em servidores virtuais privados (VPS) na **Hetzner Cloud**.

### **2.2. Stack Tecnológica Confirmada**

* **Gestão de Código:** Monorepo gerenciado via NPM Workspaces (backend, frontend, shared).  
* **Backend:** Fastify v5 (Foco em API, alta taxa de transferência).  
* **Frontend:** React 19 \+ Vite (Performance maxima de *build* e runtime).  
* **Linguagem:** TypeScript (Strict Mode global, garantindo segurança de tipos).  
* **Banco de Dados:** MongoDB (Replica Set para integridade transacional).  
* **Cache & Sessão:** Redis (Cache em memória de alta velocidade).  
* **Fonte da Verdade:** Pacote @elo-organico/shared (Contém Schemas Zod compartilhados para validação *full-stack*).  
* **Gateway de Pagamento:** API Pix da **EFI Bank**.

### **2.3. Decisões de Design e Infraestrutura**

#### **Infraestrutura de Hospedagem (Self-Hosted na Hetzner)**

A adoção de uma arquitetura totalmente conteinerizada maximiza o controle e otimiza custos operacionais.

* **Servidor:** VPS Linux (Ubuntu/Debian) de baixo custo na Hetzner Cloud.  
* **Orquestração:** **Docker Compose** gerenciando a stack na mesma rede interna privada, garantindo segurança e latência mínima:  
  * backend: API Node.js.  
  * frontend: Servidor Nginx (Reverse Proxy/Servidor estático).  
  * db: MongoDB configurado como Replica Set (rs0) para transações ACID.  
  * redis: Cache em memória para sessões e filas de processamento.  
* **Vantagem Competitiva:** Eliminação de dependências em serviços gerenciados caros. Comunicação entre a API e o DB ocorre via rede interna Docker, resultando em latência **sub-milissegundo**.

#### **Modelagem de Dados (Domain-Driven Design \- DDD)**

A lógica de negócio está organizada em domínios para facilitar a manutenção e escalabilidade:

* **Auth:** Gerencia o ciclo de vida dos usuários (User), autenticação JWT e sessões seguras persistidas no Redis.  
* **Cycle:** Controla a janela de compras (openingDate, closingDate, isVisible).  
* **Product:** Catálogo de itens disponíveis, preços, unidades e categorias.

## **💰 Fase 3: Estimativa de Custo**

### **3.1. Detalhamento dos Custos**

A estratégia **"Self-Hosted"** na Hetzner Cloud proporciona uma relação custo-benefício altamente favorável e previsível.

| Categoria de Custo | Detalhamento | Custo Mensal Estimado |
| :---- | :---- | :---- |
| **Hospedagem (Hetzner Cloud VPS)** | Servidor de Alto Desempenho (VPS Linux) cobrindo Aplicação, Banco de Dados e Cache. | **€5,00 a €7,00** (Fixo) |
| **Banco de Dados & Cache** | Utilização de recursos da própria VPS (MongoDB/Redis). | **Custo Zero Adicional** |
| **Gateway de Pagamento (EFI Bank)** | Tarifa fixa por transação Pix recebida. | **Variável** (Competitiva vs. taxas percentuais) |
| **Domínio e DNS** | Registro e manutenção anual do nome de domínio. | **Custo Anual Padrão** |

### **3.2. Conclusão Financeira**

A arquitetura selecionada garante **previsibilidade total** dos custos de infraestrutura. O custo mensal fixo é extremamente baixo, independentemente do volume de consultas ao banco de dados ou tráfego, assegurando a sustentabilidade financeira do projeto a longo prazo.

## **🎨 Fase 4: Desenvolvimento da Marca e Identidade Visual**

**4.1. Estratégia de Marca**	

* **Nome Escolhido:** Elo Orgânico  
* **Conceito Central:** "De igual para igual, do solo para a mesa."  
* **Arquétipo:** O Cara Comum / O Vizinho (Acessível, Empático, Realista e Comunitário).  
* **Pilares:** Pertencimento, Simplicidade Honesta, Conexão Humana.  
* **Tom de Voz:** Próximo, Descomplicado e Parceiro ("A gente" em vez de "O Sistema").


| Slogan | Foco |
| :---- | :---: |
| **Principal** | "Sua comunidade, nossa colheita." |
| **Funcional** | "Partilha de orgânicos fácil, como deve ser." |
| **Impacto (Marketing)** | "Tão natural quanto a nossa amizade." |

* **Conceito da Logo:** Fusão visual de conexão (**Elo**) e natureza (**Orgânico**). Um símbolo com duas formas fluidas que se entrelaçam, formando um elo, com uma das pontas terminando na silhueta estilizada de uma folha.  
* **Tipografia:** Fonte Nunito arredondada e amigável, com **Elo** em peso Negrito e **Orgânico** em peso Regular.

### **4.2. Design System: Paleta de Cores**

A identidade cromática do Elo Orgânico foi desenvolvida para evocar a naturalidade do campo aliada à simplicidade de uma comunidade acolhedora. O sistema prioriza a acessibilidade (WCAG AAA) e a flexibilidade semântica.

#### **Identidade Principal (Tríade da Marca)**

Cores que definem a personalidade visual do aplicativo, equilibrando o calor da terra com a vitalidade da vegetação.

| Título da Cor | Uso Sugerido | Código HEX |
| :---: | ----- | :---: |
| Olive Leaf (Primária) | Identidade da Marca. Um verde médio e acolhedor, usado em cabeçalhos, botões principais de navegação e elementos de branding. Transmite equilíbrio e vitalidade natural. | **\#8EA637** |
| Sprout Green (Secundária) | Suporte e Luminosidade. Um verde claro vibrante, utilizado em fundos de destaque, ilustrações e elementos que indicam renovação ou início de processos. | **\#C9F2AC** |
| Deep Forest (Terciária) | Base Sólida. Um verde quase preto. Confere peso e estrutura para rodapés e elementos de alto contraste. | **\#022601** |

#### **Sistema de Backgrounds (Superfícies)**

Esta categoria foi arquitetada com dualidade (Verde e Marrom) e polaridade (Positivo/Claro e Negativo/Escuro) para criar profundidade e segmentação semântica na interface.

| Título da Cor | Uso Sugerido | Código HEX |
| :---: | ----- | :---: |
| Natural Fiber | Fundo Claro (Base). A cor padrão do app ("Papel"). Substitui o branco clínico por um creme acolhedor. | **\#F2E8C9** |
| Coffee Soil | Fundo Escuro (Base). Fundo principal para Modo Escuro ou cartões de alto destaque visual. | **\#400101** |
| Mint Whisper | Fundo Claro (Tint). Superfícies de destaque suave ou áreas de sucesso no modo claro. | **\#F1F8E9** |
| Canopy Dark | Fundo Escuro (Shade). Modais, Sidebars ou Modo Noturno. Baseado na sombra da floresta. | **\#02590F** |

#### **Cores Neutras Estruturais (Bordas e Divisores)**

Essenciais para a arquitetura da informação, definindo limites sem pesar visualmente.

| Título da Cor | Uso Sugerido | Código HEX |
| :---: | ----- | :---: |
| Raw Line | Bordas em Fundo Claro. Para inputs, cards e linhas divisórias sobre o fundo Natural Fiber. | **\#E6DCC3** |
| Night Line | Bordas em Fundo Escuro. Para divisórias sutis quando o fundo for Coffee Soil ou Deep Forest. | **\#2C1A1A** |
| Disabled Gray | Estado Desabilitado. Para botões ou campos inativos. Um cinza quente para não destoar. | **\#A89F91** |
| Overlay | Máscara de Fundo. Cor para escurecer o fundo quando um modal abre (usar 60% opacidade). | **\#022601** |

#### **Sistema Tipográfico (Textos e Leitura)**

Cores desenvolvidas especificamente para garantir conforto visual e hierarquia de informação, adaptáveis ao fundo onde o texto está aplicado.

| Título da Cor | Uso Sugerido | Código HEX |  |
| :---: | ----- | :---: | :---: |
|  |  | Fundo Claro (Positivo) | Fundo Escuro (Negativo) |
| Títulos (H1-H3) | Manchetes e Cabeçalhos | **\#400101  (Earth Brown)** | **\#F2E8C9 (Natural Fiber)** |
| Subtítulos (H4-H6) | Labels, Tags e Metadados | **\#5C4B3F  (Humus Brown)** | **\#C9F2AC (Sprout Green)** |
| Parágrafos (Body) | Textos longos e Descrições | **\#212121  (Soil Dark)** | **\#FBF8F1 (Cotton White)** |
| Legendas | Texto Apoio | **\#6D6D6D  (Ash Gray)** | **\#A89F91 (Disabled Gray)** |

**Cores de Destaque (Call to Action)** 

Cores vibrantes e apetitosas, inspiradas na colheita (frutas e raízes), usadas estrategicamente para guiar a ação do usuário de forma intuitiva.

| Título da Cor | Uso Sugerido | Código HEX |
| :---: | ----- | :---: |
| Harvest Pumpkin (Accent) | Ação Principal (CTA). Usado estritamente em botões de conversão ("Comprar", "Confirmar"). Sua temperatura quente desperta apetite e urgência amigável. | **\#F2622E** |
| Sun Pollen (Highlight) | Badges e Notificações. Amarelo dourado para destacar novidades, promoções ou contadores de notificação sem gerar ansiedade. | **\#F2A341** |

#### 

**Cores de Sombras**

O sistema de elevação utiliza sombras coloridas (não pretas) para criar uma profundidade rica e integrada ao ambiente "quente" da interface.

| Título da Cor | Uso Sugerido | Código HEX |
| :---: | ----- | :---: |
| Warm Shadow | Elevação Padrão. Sombra marrom suave para cards e botões sobre fundos claros. Cria uma sensação de flutuação natural. | **\#400101** |
| Canopy Shadow | Profundidade Intensa. Sombra verde muito escura para modais ou elementos sobrepostos em fundos coloridos, simulando a sombra densa de uma copa de árvore. | **\#022601** |

**Cores de Feedback da UI**

Estados do sistema traduzidos para uma linguagem visual que mantém a harmonia com a paleta natural.

| Título da Cor | Uso Sugerido | Código HEX |
| :---: | ----- | :---: |
| Emerald Fresh | Sucesso. Verde vibrante e digital para clareza imediata de conclusão. | **\#2ECC71** |
| Clay Error | Alerta Crítico. Um vermelho terroso e queimado. Comunica erro de forma clara, mas sem a agressividade de um vermelho neon digital. | **\#D9042B** |
| Ripe Warning | Atenção. Um ocre amarelado para avisos preventivos. Garante legibilidade sobre o fundo claro. | **\#F2C84B** |
| Water Info | Informação Neutra. Azul suave, representando a água. Única cor fria da paleta, usada para dados do sistema que não exigem ação imediata. | **\#2F80ED** |

**Padrões para Ícones (Iconografia)**

Definições de contraste para garantir a leitura rápida dos glifos em qualquer ambiente.

| Título da Cor | Uso Sugerido | Código HEX |  |
| :---: | ----- | :---: | :---: |
|  |  | Fundo Claro (Positivo) | Fundo Escuro (Negativo) |
| Ícone Primário | Navegação e Ações Padrão | **\#400101  (Earth Brown)** | **\#F2E8C9 (Natural Fiber)** |
| Ícone Ativo | Item Selecionado / Foco | **\#F2622E (Harvest Pumpkin)** | **\#F2622E (Harvest Pumpkin)** |
| Ícone Secundário | Metadados (ex: relógio, pin) | **\#5C4B3F (Humus Brown)** | **\#A89F91 (Disabled Gray)** |
| Ícone Inverso | Sobre Botões Sólidos | **\#F2E8C9 (Natural Fiber)** | **\#400101  (Earth Brown)** |

**🔄 Fase 5: Fluxograma Operacional**

Este fluxo detalha a jornada completa de um ciclo de partilha na nova infraestrutura **"Always-on"** (disponibilidade contínua).

### **1\. Etapa de Preparação (Administrador) ⚙️**

* **Acesso:** O Administrador acessa o Painel de Gestão (Disponível 24/7).  
* **Ingestão de Dados:** O Admin cola a lista bruta de produtos. O Frontend processa (Regex) e estrutura os dados para o formato JSON.  
* **Abertura do Ciclo:** O Admin define as datas de abertura e fechamento e ativa o ciclo. O Backend persiste os dados no Cluster MongoDB local.

### **2\. Etapa de Compras (Cliente) 🛒**

* **Navegação:** O Cliente acessa o portal e visualiza apenas os produtos ativamente disponíveis no ciclo.  
* **Carrinho:** Adiciona itens (definindo quantidade e peso, se aplicável) e revisa a totalidade do pedido.  
* **Checkout:** Confirmação final do pedido e alocação do estoque.  
* **Pagamento:** O sistema interage com a API do EFI Bank para gerar e exibir o **QR Code Pix** único para a transação.

### **3\. Etapa de Encerramento (Admin/Sistema) 📦**

* **Fechamento:** O sistema bloqueia a criação de novos pedidos **automaticamente** na data/hora limite configurada.  
* **Consolidação:** O Admin acessa relatórios de consolidação de pedidos (total por produto/produtor) para iniciar a logística.  
* **Histórico:** Os dados são permanentemente arquivados e permanecem disponíveis para consulta futura e *BI* (Business Intelligence).

