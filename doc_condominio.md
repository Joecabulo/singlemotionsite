# Documentação de Implementação Completa
## SM Condomínio – Sistema de Gestão Condominial

## 1. VISÃO GERAL DO SISTEMA

### 1.1 Propósito
O SM Condomínio é uma solução web completa para gestão de condomínios
residenciais, projetada para ser implementada como instância única (on-
premise) para cada cliente. O sistema centraliza comunicação, reservas,
controle de portaria e gestão financeira em uma plataforma integrada.

### 1.2 Características Principais
- **Arquitetura**: Instância única por condomínio
- **Plataforma**: Web responsiva
- **Banco de Dados**: PostgreSQL
- **Modelo de Negócio**: Venda de implementação personalizada
- **Tempo de Implantação**: Aproximadamente 5 minutos por configuração
inicial

### 1.3 Diferenciais Competitivos
- Customização visual completa por cliente
- Sistema multi-perfil com níveis de acesso diferenciados
- Automações inteligentes (notificações, expiração de avisos)
- Escalabilidade modular (cliente compra funcionalidades conforme
necessidade)

## 2. ARQUITETURA DO SISTEMA

### 2.1 Modelo de Implementação

**Instância Única (Single-Tenant)**
- Cada condomínio possui sua própria instalação do sistema
- Servidor dedicado ou compartilhado com isolamento total
- Banco de dados independente por cliente
- Personalização visual e funcional sem impactar outros clientes

### 2.2 Estrutura de Configuração

**Arquivo de Configuração Principal** (.env ou settings.json)

Parâmetros obrigatórios na implementação:
- Nome do Condomínio
- CNPJ do Condomínio
- Endereço completo
- Quantidade de blocos
- Quantidade de unidades por bloco
- E-mail administrativo
- Telefone de contato
- Fuso horário

**Diretório de Assets Personalizados**
- `/logo/` - Logotipo do condomínio (formatos PNG, SVG, JPG)
- `/themes/` - Arquivos de tema personalizado
- `/documents/` - Documentos oficiais (regimento, atas)
- `/uploads/` - Arquivos enviados pelos usuários

### 2.3 Camadas da Aplicação

**Camada de Apresentação (Frontend)**
- Interface responsiva para desktop, tablet e mobile
- Dashboard diferenciado por perfil de usuário
- Sistema de temas personalizável
- Componentes reutilizáveis

**Camada de Lógica de Negócio (Backend)**
- API RESTful para comunicação
- Regras de negócio centralizadas
- Sistema de autenticação e autorização
- Gerenciamento de sessões

**Camada de Dados (Database)**
- PostgreSQL como SGBD principal
- Estrutura normalizada
- Índices otimizados para consultas frequentes
- Sistema de backup automatizado

**Camada de Integração**
- APIs externas para pagamentos
- Serviço de e-mail (SMTP)
- Serviço de notificações push
- Armazenamento de arquivos

## 3. MÓDULO 0: CORE (BASE DO SISTEMA)

### 3.1 Gestão de Unidades

**3.1.1 Estrutura Hierárquica**
- Condomínio (raiz)
- Blocos/Torres
- Unidades (Apartamentos/Casas)

**3.1.2 Cadastro de Blocos**

Informações necessárias:
- Identificador do bloco (nome/número)
- Quantidade de andares
- Quantidade de unidades por andar
- Observações específicas

Funcionalidades:
- Criação de múltiplos blocos
- Edição de informações
- Desativação (não exclusão para manter histórico)
- Visualização hierárquica

**3.1.3 Cadastro de Unidades**

Informações necessárias:
- Número/Identificação da unidade
- Bloco vinculado
- Andar
- Tipo (apartamento, casa, sala comercial)
- Metragem (opcional)
- Quantidade de vagas de garagem vinculadas
- Status (ocupada, vaga, em reforma)

Funcionalidades:
- Cadastro individual ou em lote
- Vinculação automática ao bloco
- Histórico de ocupação
- Gestão de vagas de garagem

### 3.2 Gestão de Pessoas

**3.2.1 Tipos de Perfil**

**Proprietário**
- Pessoa física ou jurídica com propriedade registrada
- Acesso total às funcionalidades da unidade
- Pode autorizar moradores e inquilinos
- Recebe todas as comunicações oficiais
- Responsável financeiro principal

**Morador**
- Reside na unidade (pode ser o próprio proprietário)
- Acesso às reservas e comunicações
- Pode registrar ocorrências
- Pode autorizar visitantes

**Inquilino**
- Autorizado pelo proprietário
- Acesso similar ao morador
- Período de permanência definido
- Notificações também para o proprietário

**Funcionário**
- Prestador de serviço autorizado
- Acesso limitado e temporário
- Registro de entrada e saída
- Vinculado a uma unidade específica

**3.2.2 Cadastro de Pessoas**

Informações básicas obrigatórias:
- Nome completo
- CPF/CNPJ
- Data de nascimento
- Telefone principal
- E-mail
- Foto (opcional)

Informações de endereço:
- Unidade vinculada
- Tipo de vínculo (proprietário, morador, inquilino)
- Data de início do vínculo
- Data de término (para inquilinos)

Informações complementares:
- Telefones adicionais
- Contato de emergência
- Observações

**3.2.3 Relacionamentos entre Pessoas e Unidades**

Uma unidade pode ter:
- Um ou mais proprietários
- Um ou mais moradores
- Um inquilino (ou família de inquilinos)
- Múltiplos funcionários autorizados

Uma pessoa pode:
- Ser proprietária de múltiplas unidades
- Ser moradora de apenas uma unidade por vez
- Ter múltiplos perfis (ex: proprietário de uma unidade e inquilino de outra)

### 3.3 Controle de Acessos

**3.3.1 Sistema de Autenticação**

Métodos de login:
- CPF + Senha
- E-mail + Senha
- Recuperação de senha via e-mail
- Primeiro acesso com senha temporária

Segurança:
- Senha com requisitos mínimos (8 caracteres, maiúsculas, números)
- Criptografia de senhas no banco
- Bloqueio após tentativas inválidas
- Sessão com timeout configurável
- Log de acessos

**3.3.2 Níveis de Permissão**

**Síndico (Administrador Total)**
- Acesso a todos os módulos
- Gestão de usuários e permissões
- Configuração do sistema
- Relatórios completos
- Aprovação de reservas (se configurado)

**Subsíndico (Administrador Parcial)**
- Acesso similar ao síndico
- Pode ter restrições em módulo financeiro
- Não pode alterar configurações críticas
- Não pode gerenciar o perfil do síndico

**Conselho Fiscal**
- Acesso ao módulo financeiro (leitura)
- Acesso a relatórios
- Visualização de documentos
- Sem permissão de edição

**Morador/Proprietário**
- Acesso ao mural de avisos
- Sistema de reservas
- Autorização de visitantes
- Registro de ocorrências
- Visualização de documentos
- Área financeira (própria unidade)

**Inquilino**
- Similar ao morador
- Algumas restrições (dependem de configuração)
- Notificações também para o proprietário

**Porteiro/Zelador**
- Acesso ao módulo de portaria
- Controle de encomendas
- Validação de visitantes
- Livro de ocorrências
- Registro de entrada/saída

**Funcionário Terceirizado**
- Acesso apenas ao livro de ocorrências (leitura)
- Registro de serviços executados

**3.3.3 Gestão de Permissões**

Funcionalidades:
- Atribuição de perfil no cadastro do usuário
- Alteração de perfil (com log de auditoria)
- Permissões customizadas por usuário (casos especiais)
- Ativação/Desativação de usuários
- Relatório de acessos por perfil

## 4. MÓDULO 1: COMUNICAÇÃO E SOCIAL

### 4.1 Mural Digital

**4.1.1 Características dos Avisos**

Tipos de avisos:
- Comunicado geral (visível para todos)
- Comunicado por bloco (apenas moradores do bloco)
- Comunicado por unidade (privado)
- Aviso urgente (destaque visual)
- Aviso permanente (fixado no topo)

**4.1.2 Criação de Avisos**

Quem pode criar:
- Síndico
- Subsíndico
- Administradora (se configurado)

Campos do aviso:
- Título (obrigatório)
- Conteúdo (texto rico com formatação)
- Categoria (manutenção, social, urgente, administrativo)
- Prioridade (normal, alta, urgente)
- Público-alvo (todos, bloco específico, unidade específica)
- Data de expiração (opcional)
- Anexos (PDF, imagens)
- Opção de envio por e-mail
- Opção de notificação push

**4.1.3 Lógica de Expiração**

Sistema automatizado:
- Avisos com data de expiração são marcados como expirados
automaticamente
- Exibição diferenciada para avisos expirados (cor/opacidade reduzida)
- Arquivo de avisos antigos (acessível via busca)
- Notificação para o criador próximo à expiração

Exemplos de uso:
- Falta de água programada: expira em 24h
- Aviso de assembleia: expira após a data da reunião
- Comunicado permanente: sem data de expiração

**4.1.4 Interações no Mural**

Funcionalidades:
- Confirmação de leitura (opcional)
- Contador de visualizações
- Comentários (se habilitado pelo criador)
- Reações simples (útil, visto)
- Compartilhamento com outros moradores
- Impressão do aviso

Relatórios:
- Taxa de visualização por aviso
- Moradores que não leram avisos urgentes
- Avisos mais comentados

### 4.2 Assembleia Virtual

**4.2.1 Criação de Assembleia**

Informações obrigatórias:
- Título da assembleia
- Data e horário (início e fim)
- Local (se presencial ou híbrida)
- Tipo (ordinária, extraordinária)
- Convocação (primeira ou segunda)
- Descrição/Introdução

Pauta da reunião:
- Múltiplos itens de pauta
- Ordem dos itens
- Descrição detalhada de cada item
- Documentos de apoio anexados

**4.2.2 Fluxo da Assembleia**

**Fase 1: Convocação**
- Publicação da convocação com antecedência legal
- Envio automático de e-mail para todos os proprietários
- Notificação push
- Confirmação de presença (opcional)

**Fase 2: Discussão (Antes/Durante)**
- Campo de comentários por item de pauta
- Moderação pelo síndico
- Anexo de documentos pelos moradores

- Perguntas e respostas

**Fase 3: Votação**
- Abertura de votação por item
- Modalidades de voto:
- Sim
- Não
- Abstenção
- Voto ponderado por fração ideal (configurável)
- Prazo para votação
- Resultado parcial (visível ou oculto)

**Fase 4: Encerramento**
- Resultado final automaticamente calculado
- Geração de ata preliminar
- Publicação dos resultados
- Período para contestações

**4.2.3 Regras de Votação**

Configurações possíveis:
- Um voto por unidade
- Voto ponderado por fração ideal
- Voto ponderado por metragem
- Exigência de quórum mínimo
- Maioria simples ou qualificada
- Prazo para votação (horas/dias)

Validações:

- Apenas proprietários votam (configurável)
- Um voto por pessoa (no mesmo item)
- Não permite alteração após votação fechada
- Log completo de votos (auditável pelo síndico)

**4.2.4 Ata Digital**

Geração automática:
- Cabeçalho com dados do condomínio
- Data, horário e tipo da assembleia
- Lista de presenças (presenciais e virtuais)
- Pauta completa
- Resultado de cada votação
- Campo para observações do secretário
- Assinatura digital do síndico e secretário

Funcionalidades:
- Exportação em PDF
- Publicação na documentoteca
- Envio por e-mail para todos os proprietários

### 4.3 Documentoteca

**4.3.1 Estrutura de Documentos**

Categorias predefinidas:
- Atas de assembleia
- Regimento interno
- Convenção de condomínio

- Contratos de prestadores
- Plantas e projetos
- Manuais de equipamentos
- Documentos fiscais
- Relatórios administrativos
- Seguros e apólices

**4.3.2 Upload e Gestão**

Quem pode fazer upload:
- Síndico (todas as categorias)
- Subsíndico (categorias permitidas)
- Conselho fiscal (documentos financeiros)

Informações do documento:
- Título do documento
- Categoria
- Descrição
- Data do documento
- Data de upload
- Versão (se aplicável)
- Palavras-chave para busca
- Visibilidade (todos, apenas proprietários, apenas síndico)

Formatos aceitos:
- PDF (principal)
- Imagens (JPG, PNG)
- Documentos (DOC, DOCX, XLS, XLSX – convertidos para PDF)

**4.3.3 Controle de Versão**

Sistema de versionamento:
- Manter histórico de versões antigas
- Marcar versão atual como ativa
- Log de alterações
- Comparação entre versões (se possível)

Exemplo:
- Regimento Interno v1.0 (2023)
- Regimento Interno v1.1 (2024 – alteração aprovada em assembleia)

**4.3.4 Acesso e Segurança**

Níveis de acesso:
- Documentos públicos (todos visualizam)
- Documentos restritos (apenas proprietários)
- Documentos confidenciais (apenas síndico/conselho)

Segurança:
- Marca d’água com CPF do usuário que baixou
- Log de downloads
- Impossibilidade de exclusão (apenas arquivamento)
- Backup automático

**4.3.5 Busca e Filtros**

Sistema de busca:
- Busca por palavra-chave

- Filtro por categoria
- Filtro por data
- Filtro por tipo de documento
- Ordenação por relevância, data, título

## 5. MÓDULO 2: RESERVAS E RECURSOS

### 5.1 Cadastro de Espaços Reserváveis

**5.1.1 Tipos de Espaços**

Espaços comuns típicos:
- Salão de festas
- Churrasqueira/Espaço gourmet
- Piscina (horários específicos)
- Quadra esportiva
- Sala de cinema
- Sala de jogos
- Espaço fitness
- Sala de reuniões
- Espaço coworking
- Playground (horário exclusivo)

**5.1.2 Configuração do Espaço**

Informações básicas:
- Nome do espaço
- Descrição detalhada

- Capacidade máxima de pessoas
- Fotos do espaço
- Lista de itens disponíveis
- Regulamento específico

Configurações de disponibilidade:
- Dias da semana disponíveis
- Horário de funcionamento
- Turnos de reserva (manhã, tarde, noite, dia todo)
- Duração mínima/máxima da reserva
- Intervalo entre reservas (tempo de limpeza)

Configurações financeiras:
- Gratuito ou pago
- Valor da reserva (se pago)
- Taxa de limpeza adicional
- Valor de caução (opcional)
- Multa por danos
- Forma de pagamento

### 5.2 Regras de Reserva

**5.2.1 Regras Gerais**

Controle de acesso:
- Apenas moradores/proprietários podem reservar
- Restrição de reservas por unidade (ex: 1 reserva por mês)
- Fila de espera para espaços concorridos
- Prioridade para aniversariantes (opcional)

Antecedência e prazos:
- Antecedência mínima para reserva (ex: 48 horas)
- Antecedência máxima (ex: 60 dias)
- Prazo para cancelamento sem multa
- Prazo para confirmação da reserva

**5.2.2 Validação de Conflitos**

Lógica de conflito:
- Verificação automática de sobreposição de horários
- Bloqueio de reserva em horário já ocupado
- Mensagem clara sobre o conflito
- Sugestão de horários próximos disponíveis

Considerações:
- Tempo de limpeza entre reservas
- Reservas administrativas (manutenção, eventos do condomínio)
- Bloqueios temporários

**5.2.3 Sistema de Aprovação**

Modalidades:
- Aprovação automática (se disponível)
- Aprovação manual pelo síndico
- Aprovação automática com limite (ex: 2 por mês, depois manual)

Notificações:
- Solicitação enviada ao síndico

- Prazo para aprovação (ex: 24 horas)
- Aprovação automática se não houver resposta
- Notificação de aprovação/recusa ao solicitante

### 5.3 Fluxo de Reserva

**5.3.1 Etapa 1: Consulta de Disponibilidade**

Interface:
- Calendário visual com disponibilidade
- Filtro por espaço
- Legenda de status (disponível, reservado, bloqueado)
- Visualização mensal/semanal/diária

**5.3.2 Etapa 2: Solicitação**

Formulário de reserva:
- Seleção de data e horário
- Seleção do turno
- Quantidade aproximada de pessoas
- Finalidade do evento (opcional)
- Observações especiais

**5.3.3 Etapa 3: Termo de Uso**

Termo de responsabilidade:
- Exibição do regulamento específico do espaço
- Checkbox obrigatório de concordância
- Termos incluem:

- Horário de entrada e saída
- Responsabilidade por danos
- Limite de som
- Proibição de determinadas ações
- Obrigação de limpeza básica
- Consequências do não cumprimento

**5.3.4 Etapa 4: Cobrança (se aplicável)**

Taxa de limpeza:
- Geração automática de aviso de cobrança
- Vinculação à próxima fatura da unidade
- Opção de pagamento antecipado
- Emissão de comprovante

Caução:
- Valor retido (ou cheque caução)
- Devolução após vistoria
- Desconto de danos identificados

**5.3.5 Etapa 5: Confirmação**

Após aprovação:
- E-mail de confirmação
- Notificação push
- Voucher de reserva (com QR Code)
- Lembretes automáticos (24h e 2h antes)

### 5.4 Gestão de Reservas

**5.4.1 Painel do Morador**

Funcionalidades:
- Minhas reservas (ativas e históricas)
- Cancelamento de reserva
- Download do voucher
- Checklist de preparação

**5.4.2 Painel do Síndico**

Funcionalidades:
- Visão geral de todas as reservas
- Aprovação pendentes
- Criação de reservas administrativas
- Bloqueio de datas (manutenção)
- Relatório de uso dos espaços
- Histórico de problemas por espaço

**5.4.3 Controle de Uso**

Check-in e check-out:
- Registro de entrada (portaria ou automático)
- Registro de saída
- Vistoria pós-uso
- Registro fotográfico (opcional)
- Liberação de caução

Avaliação:

- Morador avalia o estado do espaço
- Sistema de estrelas
- Comentários
- Relatório de problemas

### 5.5 Relatórios do Módulo

Relatórios disponíveis:
- Taxa de ocupação por espaço
- Horários mais reservados
- Unidades que mais reservam
- Receita gerada (se aplicável)
- Tempo médio entre reservas
- Índice de cancelamentos
- Problemas reportados por espaço

## 6. MÓDULO 3: PORTARIA E LOGÍSTICA

### 6.1 Livro de Ocorrências

**6.1.1 Registro de Ocorrências**

Quem pode registrar:
- Porteiro/Zelador
- Síndico
- Moradores (sobre sua unidade)

Tipos de ocorrências:

- Reclamação de barulho
- Problemas de manutenção
- Conflitos entre moradores
- Animais soltos
- Irregularidades em obras
- Descumprimento de regras
- Acidentes
- Tentativa de invasão
- Problemas em áreas comuns

**6.1.2 Formulário de Ocorrência**

Campos obrigatórios:
- Data e hora da ocorrência
- Tipo de ocorrência
- Unidade envolvida (se aplicável)
- Descrição detalhada
- Local da ocorrência
- Testemunhas
- Ação tomada imediatamente

Campos opcionais:
- Fotos/vídeos
- Áudio de depoimento
- Documentos relacionados
- Gravidade (baixa, média, alta)

**6.1.3 Fluxo de Tratamento**

Registro inicial:
- Ocorrência criada por porteiro ou morador
- Notificação automática para síndico
- Status: “Pendente”

Análise:
- Síndico avalia a ocorrência
- Pode solicitar informações adicionais
- Pode envolver conselho ou outros moradores
- Status: “Em análise”

Resolução:
- Definição de ações corretivas
- Comunicação com envolvidos
- Registro de providências tomadas
- Status: “Resolvida” ou “Arquivada”

Acompanhamento:
- Morador pode comentar sobre resolução
- Reabertura se problema persistir
- Histórico completo mantido

**6.1.4 Relatórios de Ocorrências**

Visões disponíveis:
- Ocorrências por tipo
- Ocorrências por unidade
- Ocorrências não resolvidas
- Tempo médio de resolução

- Horários com mais ocorrências
- Mapa de calor de problemas

### 6.2 Controle de Encomendas

**6.2.1 Fluxo de Entrada**

Recebimento na portaria:
- Registro de data e hora de chegada
- Identificação do destinatário (unidade)
- Transportadora/Entregador
- Tipo de encomenda (carta, pacote, móvel)
- Tamanho aproximado
- Observações (frágil, refrigerado)
- Foto da encomenda (opcional)

Armazenamento:
- Localização física (prateleira, box)
- Código de rastreamento interno
- QR Code para identificação rápida

**6.2.2 Notificação ao Morador**

Envio automático imediato:
- Notificação push no app
- SMS (se configurado)
- E-mail com detalhes
- WhatsApp (se integrado)

Conteúdo da notificação:
- Tipo de encomenda
- Transportadora
- Horário de recebimento
- Local de retirada
- Prazo para retirada

**6.2.3 Controle de Retirada**

Baixa da encomenda:
- Identificação do retirador (morador ou autorizado)
- Conferência de documento
- Assinatura digital no sistema
- Foto do retirador (segurança adicional)
- Data e hora da retirada

Casos especiais:
- Retirada por terceiro autorizado
- Entrega na unidade (se serviço disponível)
- Devolução à transportadora (prazo vencido)

**6.2.4 Gestão de Encomendas**

Painel do morador:
- Encomendas pendentes
- Histórico de encomendas
- Autorização de terceiros para retirada
- Solicitação de entrega na unidade

Painel da portaria:
- Lista de encomendas por unidade
- Busca rápida por unidade ou nome
- Encomendas não retiradas (com prazo)
- Impressão de comprovantes

Painel do síndico:
- Relatório de encomendas por período
- Unidades com mais encomendas
- Tempo médio de permanência
- Encomendas não retiradas
- Ocupação do espaço de armazenamento

**6.2.5 Política de Prazo**

Configurações:
- Prazo padrão para retirada (ex: 15 dias)
- Notificações de lembrete (ex: 10 dias, 5 dias, 1 dia)
- Procedimento após vencimento do prazo
- Taxa de armazenamento prolongado (opcional)

Ações após vencimento:
- Tentativa de contato adicional
- Comunicação com transportadora
- Devolução ao remetente
- Descarte (com autorização legal)

### 6.3 Autorização de Visitantes

**6.3.1 Pré-Autorização pelo Morador**

Cadastro antecipado:
- Nome completo do visitante
- CPF do visitante
- Telefone de contato
- Foto (opcional)
- Data e horário da visita
- Duração estimada
- Finalidade (social, serviço, delivery)

Autorização recorrente:
- Para empregados domésticos
- Cuidadores
- Prestadores de serviço fixos
- Validade por período (ex: 6 meses)

**6.3.2 Validação na Portaria**

Processo de entrada:
- Porteiro busca autorização por CPF ou nome
- Validação da identidade (documento)
- Confirmação visual com foto (se disponível)
- Registro de entrada no sistema
- Liberação de acesso
- Entrega de crachá/identificação temporária

Visitante sem autorização prévia:
- Porteiro consulta o morador via interfone

- Morador autoriza verbalmente
- Porteiro registra autorização verbal no sistema
- Procedimento padrão de entrada

**6.3.3 Controle de Permanência**

Registro de movimentação:
- Hora de entrada registrada
- Hora de saída registrada
- Tempo total de permanência
- Devolução de crachá

Alertas automáticos:
- Visitante com permanência além do previsto
- Notificação para o morador
- Verificação pela segurança (se aplicável)

**6.3.4 Segurança e Privacidade**

Lista negra:
- Bloqueio de visitantes específicos
- Por solicitação do morador
- Por decisão administrativa (problema anterior)
- Motivo do bloqueio registrado

Relatórios confidenciais:
- Apenas síndico acessa relatórios completos
- Morador vê apenas suas autorizações
- Dados pessoais protegidos (LGPD)

**6.3.5 Tipos Especiais de Acesso**

Prestadores de serviço:
- Autorização específica para prestadores (encanador, eletricista)
- Registro da empresa
- Prazo de execução do serviço
- Material autorizado a entrar
- Vistoria de saída (opcional)

Delivery/Motoboy:
- Acesso rápido sem cadastro prévio
- Registro de empresa/app
- Tempo máximo de permanência
- Acesso apenas ao bloco de destino

Visitas sociais:
- Cadastro completo
- Limite de visitantes simultâneos por unidade (configurável)
- Horário permitido para visitas (regras do condomínio)

### 6.4 Integração entre Funcionalidades

**6.4.1 Dashboard Unificado da Portaria**

Visão única:
- Visitantes aguardando liberação
- Encomendas chegadas hoje
- Ocorrências pendentes de registro

- Avisos urgentes do síndico
- Reservas de espaços para hoje

**6.4.2 Relatórios Consolidados**

Para o síndico:
- Movimentação diária (visitantes, encomendas, ocorrências)
- Unidades mais movimentadas
- Horários de pico
- Eficiência da portaria
- Incidentes de segurança

## 7. MÓDULO 4: FINANCEIRO (UPGRADE PREMIUM)

### 7.1 Estrutura Financeira

**7.1.1 Conceitos Fundamentais**

Receitas:
- Taxa condominial ordinária
- Taxa condominial extraordinária
- Taxas por uso de espaços
- Multas e penalidades
- Aluguéis de áreas comerciais
- Outras receitas

Despesas:
- Folha de pagamento

- Manutenção predial
- Consumo de água e energia
- Seguros
- Serviços terceirizados
- Materiais e suprimentos
- Reserva de fundo
- Outras despesas

**7.1.2 Rateio de Despesas**

Métodos de cálculo:
- Rateio por fração ideal
- Rateio igualitário
- Rateio proporcional ao consumo
- Rateio misto (parte fixa + parte variável)

Configuração:
- Definição de fração ideal por unidade
- Percentuais personalizados
- Exceções (unidades comerciais, boxes)

### 7.2 Controle de Custos

**7.2.1 Lançamento de Despesas**

Registro manual:
- Data do lançamento
- Fornecedor/Prestador
- Categoria da despesa

- Descrição detalhada
- Valor
- Forma de pagamento
- Data de vencimento
- Anexo de nota fiscal (PDF)
- Centro de custo

Categorização:
- Despesas fixas recorrentes
- Despesas variáveis
- Investimentos (CAPEX)
- Despesas extraordinárias

**7.2.2 Gestão de Fornecedores**

Cadastro de fornecedores:
- Razão social
- CNPJ
- Endereço
- Telefone e e-mail
- Dados bancários
- Categoria de serviço
- Histórico de pagamentos
- Avaliação de desempenho

Contratos:
- Registro de contratos ativos
- Vigência e renovações
- Valores e reajustes

- Condições de pagamento
- Alertas de vencimento

**7.2.3 Fluxo de Aprovação**

Alçadas de aprovação:
- Despesas até X: síndico aprova sozinho
- Despesas de X a Y: aprovação do conselho
- Despesas acima de Y: aprovação em assembleia

Processo:
- Solicitação de despesa
- Análise e aprovação
- Emissão de ordem de pagamento
- Pagamento e baixa
- Conciliação bancária

### 7.3 Faturamento e Cobrança

**7.3.1 Geração de Boletos**

Integração bancária:
- Configuração de convênio bancário
- Geração automática de boletos
- Envio por e-mail
- Disponibilização no sistema
- Código de barras e PIX

Composição da fatura:

- Taxa condominial base
- Taxas adicionais (água, gás, fundo de reserva)
- Multas por atraso
- Juros de mora
- Serviços extras utilizados
- Créditos a compensar

**7.3.2 Ciclo de Faturamento**

Fechamento mensal:
- Data de fechamento (ex: dia 25)
- Cálculo automático de rateios
- Geração de faturas
- Envio massivo de boletos
- Data de vencimento (ex: dia 10)

Personalização:
- Data de vencimento diferenciada (se permitido)
- Parcelamento de débitos
- Negociação de dívidas

**7.3.3 Controle de Pagamentos**

Baixa automática:
- Integração com banco via arquivo de retorno
- Baixa automática de pagamentos
- Atualização de status da fatura
- Notificação de pagamento ao morador

Baixa manual:
- Registro de pagamentos em dinheiro ou cheque
- Pagamentos de acordos
- Compensações de créditos

**7.3.4 Inadimplência**

Identificação:
- Lista de inadimplentes
- Valor total em atraso por unidade
- Tempo de atraso
- Histórico de inadimplência

Ações de cobrança:
- Envio de lembretes automáticos
- Segunda via de boleto
- Notificação formal
- Cobrança judicial (exportação de dados)

Restrições por inadimplência:
- Bloqueio de reservas
- Marcação visual no sistema
- Relatório para assembleia

### 7.4 Relatórios Financeiros

**7.4.1 Relatórios Operacionais**

Disponíveis:

- Demonstrativo de receitas e despesas
- Fluxo de caixa
- Contas a pagar e a receber
- Conciliação bancária
- Posição financeira consolidada

Periodicidade:
- Diário
- Mensal
- Trimestral
- Anual
- Personalizado

**7.4.2 Relatórios Gerenciais**

Análises:
- Evolução de despesas por categoria
- Comparativo mensal/anual
- Previsão orçamentária vs realizado
- Índice de inadimplência
- Taxa de ocupação financeira
- Custo per capita

**7.4.3 Transparência Financeira**

Portal do morador:
- Visualização de suas faturas
- Histórico de pagamentos
- Débitos pendentes

- Demonstrativo mensal simplificado
- Download de comprovantes

Portal público:
- Demonstrativo mensal resumido (sem valores por unidade)
- Principais despesas do mês
- Saldo em conta
- Investimentos do fundo de reserva

**7.4.4 Auditoria e Compliance**

Funcionalidades:
- Log de todas as transações
- Rastreabilidade de alterações
- Exportação para auditoria externa
- Backup de documentos fiscais
- Relatório de conformidade fiscal

### 7.5 Integração com Banco

**7.5.1 APIs Bancárias**

Funcionalidades integradas:
- Geração de boletos
- Consulta de pagamentos (arquivo retorno)
- Geração de PIX dinâmico
- Conciliação automática
- Transferências bancárias

Bancos suportados:
- Bancos principais (Bradesco, Itaú, Santander, Caixa, BB)
- Bancos digitais (Nubank Empresas, Inter, etc.)
- Via API ou arquivo CNAB

**7.5.2 Segurança Financeira**

Controles:
- Dupla autenticação para operações financeiras
- Limite de valores por transação
- Aprovação multi-nível
- Certificado digital para transações
- Logs detalhados

## 8. PERSONALIZAÇÃO VISUAL DO SISTEMA

### 8.1 Página de Customização (Design Settings)

**8.1.1 Acesso e Permissões**

Quem pode acessar:
- Apenas síndico
- Ou administrador técnico (durante implementação)

Localização:
- Menu de configurações
- Subseção “Aparência do Sistema”

**8.1.2 Paleta de Cores**

**Cores Principais**

Cor primária:
- Utilização: botões principais, cabeçalhos, links
- Seletor de cor visual (color picker)
- Código hexadecimal
- Pré-visualização em tempo real

Cor secundária:
- Utilização: botões secundários, destaques, badges
- Coordenada com cor primária
- Sugestões automáticas de harmonia

Cor de destaque (accent):
- Utilização: notificações importantes, calls-to-action
- Contraste com cores principais

**Cores de Interface**

Plano de fundo geral:
- Cor sólida
- Gradiente (duas cores)
- Padrão sutil (opcional)

Plano de fundo dos cards:
- Cor de fundo das seções/módulos
- Opacidade configurável

- Bordas e sombras

Cor de texto:
- Texto principal
- Texto secundário
- Texto de links
- Validação automática de contraste (acessibilidade)

**Cores Semânticas**

Fixas mas customizáveis:
- Cor de sucesso (verde padrão)
- Cor de erro (vermelho padrão)
- Cor de aviso (amarelo/laranja padrão)
- Cor de informação (azul padrão)

**8.1.3 Personalização de Plano de Fundo**

Opções disponíveis:

Cor sólida:
- Seleção via color picker
- Qualquer cor hexadecimal

Gradiente:
- Tipo: linear, radial
- Duas ou mais cores
- Ângulo/direção do gradiente
- Pré-visualização em tempo real

Imagem:
- Upload de imagem (JPG, PNG)
- Tamanho máximo: 5MB
- Posicionamento: centro, topo, cobrir, conter
- Opacidade/Overlay escuro (para legibilidade do texto)
- Padrão repetido (para texturas)

Padrão geométrico:
- Biblioteca de padrões predefinidos
- Cor do padrão customizável
- Opacidade ajustável

**8.1.4 Tipografia**

**Viabilidade de Alteração de Fonte**

Análise técnica:

Vantagens:
- Personalização completa da identidade visual
- Adequação a diferentes perfis de condomínio (formal, moderno, clássico)
- Melhora percepção de marca própria

Desafios:
- Carregamento de fontes customizadas pode impactar performance
- Necessidade de validar legibilidade
- Suporte a caracteres especiais e acentuação
- Licenciamento de fontes comerciais

**Recomendação de Implementação**:
- Oferecer seleção entre fontes web gratuitas (Google Fonts)
- 10-15 opções pré-selecionadas e testadas
- Categorias: Serifa, Sem-serifa, Display, Monoespaçada
- Validação automática de legibilidade e contraste

**Configurações de Tipografia**

Família de fonte:
- Seleção de fonte para títulos
- Seleção de fonte para corpo de texto
- Pré-visualização com texto real do sistema

Tamanhos:
- Tamanho base de texto (14px-18px)
- Escala automática para títulos e subtítulos
- Ajuste global de espaçamento entre linhas

Peso da fonte:
- Normal, negrito para títulos
- Opção de peso intermediário (se disponível na fonte)

**8.1.5 Logotipo**

Gestão da logo:

Upload:
- Formato: PNG (com transparência) ou SVG

- Tamanho recomendado: 200x80px (proporção ajustável)
- Tamanho máximo do arquivo: 2MB
- Pré-visualização antes de salvar

Posicionamento:
- Cabeçalho (padrão)
- Rodapé (opcional, menor)
- Tela de login

Versões:
- Logo para fundo claro
- Logo para fundo escuro (se aplicável)
- Logo compacta para mobile

Armazenamento:
- Diretório: `/logo/`
- Nome do arquivo padronizado: `logo-condominio.png` ou `logo-
condominio.svg`
- Backup automático

**8.1.6 Sistema de Pré-Visualização**

Funcionalidade crítica:

Preview em tempo real:
- Simulação de tela de login
- Simulação de dashboard
- Simulação de módulo (ex: mural)
- Todas as alterações refletidas instantaneamente
Comparação antes/depois:
- Botão para alternar entre tema atual e personalizado
- Facilita validação de alterações

Modos de visualização:
- Desktop
- Tablet
- Mobile

**8.1.7 Temas Predefinidos**

Para facilitar implementação:

Templates prontos:
- Tema Clássico (azul formal)
- Tema Moderno (cores vibrantes)
- Tema Minimalista (tons neutros)
- Tema Escuro (dark mode)
- Tema Corporativo (cinza e verde)

Cada tema inclui:
- Paleta de cores completa
- Sugestão de fonte
- Plano de fundo configurado

**8.1.8 Validações e Segurança**

Validações automáticas:

Contraste:
- Verificação WCAG AA (acessibilidade)
- Alerta se contraste insuficiente entre texto e fundo
- Sugestões automáticas de ajuste

Performance:
- Limite de tamanho para imagens de fundo
- Compressão automática de imagens grandes
- Cache de recursos visuais

Responsividade:
- Teste automático em diferentes resoluções
- Alerta se logo ficar desproporcional
- Ajuste automático de elementos

**8.1.9 Salvamento e Reversão**

Controles:

Salvar alterações:
- Botão de salvar destacado
- Confirmação antes de aplicar
- Aplicação imediata para todos os usuários

Reverter para padrão:
- Botão para restaurar tema original
- Confirmação de segurança
- Backup automático do tema anterior

Histórico de temas:
- Salvar até 5 versões anteriores
- Restauração rápida de versões antigas

**8.1.10 Exportação/Importação**

Para facilitar replicação:

Exportar tema:
- Arquivo JSON com todas as configurações
- Inclui referências a arquivos (logo, imagens)
- Pode ser usado em outra instalação

Importar tema:
- Upload de arquivo JSON
- Pré-visualização antes de aplicar
- Ajuste de caminhos de arquivos

### 8.2 Implementação Técnica das Customizações

**8.2.1 Estrutura de Armazenamento**

Banco de dados:
- Tabela `configuracoes_tema` com campos para cada personalização
- Versionamento de configurações
- Relação com ID do condomínio

Arquivos físicos:

- Diretório `/logo/` para logotipos
- Diretório `/themes/assets/` para imagens de fundo
- Arquivos nomeados com ID do condomínio

**8.2.2 Aplicação de Estilos**

CSS dinâmico:
- Geração de arquivo CSS customizado na primeira carga
- Variáveis CSS para cores e tipografia
- Cache no navegador
- Atualização automática ao detectar mudanças

Prioridade de estilos:
1. Estilos base do sistema
2. Tema personalizado (sobrescreve)
3. Ajustes de responsividade
4. Preferências do usuário (modo escuro, se implementado)

**8.2.3 Performance**

Otimizações:
- Lazy loading de imagens de fundo
- Compressão automática de assets
- CDN para fontes externas
- Cache agressivo de tema (atualizado só quando muda)

## 9. ARQUITETURA TÉCNICA DETALHADA

### 9.1 Estrutura do Banco de Dados (PostgreSQL)

**9.1.1 Tabelas Principais**

**Módulo Core**

`condominios`
- Informações do condomínio
- Dados de contato
- Configurações gerais

`blocos`
- Identificação do bloco
- Relação com condomínio
- Quantidade de andares

`unidades`
- Número da unidade
- Relação com bloco
- Tipo, metragem, status
- Fração ideal

`pessoas`
- Dados pessoais completos
- CPF, e-mail, telefones
- Foto

`pessoas_unidades`
- Relacionamento N:N

- Tipo de vínculo
- Datas de início/fim
- Status ativo

`usuarios`
- Credenciais de login
- Relação com pessoa
- Perfil de acesso
- Último acesso

**Módulo Comunicação**

`avisos`
- Título, conteúdo, categoria
- Público-alvo
- Data de criação e expiração
- Prioridade

`avisos_visualizacoes`
- Registro de leitura
- Data/hora
- Usuário

`assembleias`
- Dados da assembleia
- Tipo, convocação
- Status

`assembleias_pautas`

- Itens de pauta
- Ordem, descrição
- Status de votação

`assembleias_votos`
- Voto do proprietário
- Item de pauta
- Sim/Não/Abstenção
- Data/hora

`documentos`
- Metadados do documento
- Categoria, versão
- Caminho do arquivo
- Visibilidade

**Módulo Reservas**

`espacos_reservaveis`
- Nome, descrição
- Capacidade, fotos
- Regulamento

`espacos_configuracoes`
- Horários de funcionamento
- Regras de reserva
- Valores

`reservas`

- Data, horário, turno
- Espaço, unidade
- Status da reserva
- Termo aceito

`reservas_taxas`
- Valores cobrados
- Status de pagamento

**Módulo Portaria**

`ocorrencias`
- Tipo, descrição, gravidade
- Unidade envolvida
- Status, resolução

`ocorrencias_arquivos`
- Fotos, vídeos, documentos

`encomendas`
- Transportadora
- Unidade destino
- Data entrada/saída
- Status, localização

`visitantes_autorizados`
- Dados do visitante
- Unidade que autorizou
- Período de validade

- Tipo de autorização

`visitantes_acessos`
- Registro de entrada/saída
- Autorização utilizada
- Porteiro responsável

**Módulo Financeiro**

`plano_contas`
- Categorias de receitas e despesas
- Hierarquia

`lancamentos`
- Tipo (receita/despesa)
- Valor, data
- Categoria, fornecedor
- Status de pagamento

`fornecedores`
- Dados cadastrais
- Categoria, avaliação

`faturas_unidades`
- Mês/ano de referência
- Unidade
- Valor total
- Status de pagamento

`faturas_itens`
- Composição da fatura
- Descrição, valor

`boletos`
- Dados do boleto
- Código de barras
- Status de pagamento

**Configurações e Logs**

`configuracoes_sistema`
- Chave-valor para configs
- Tipo de dado

`configuracoes_tema`
- Personalizações visuais
- Paleta de cores, fontes
- Caminhos de arquivos

`logs_acesso`
- Registro de login
- IP, user-agent
- Ações realizadas

`logs_auditoria`
- Mudanças em dados críticos
- Quem, quando, o quê

**9.1.2 Índices e Performance**

Índices essenciais:
- CPF de pessoas (único)
- E-mail de usuários (único)
- Unidade + data em reservas
- Status de faturas
- Datas de vencimento

Índices compostos:
- Unidade + tipo de vínculo (pessoas_unidades)
- Espaço + data (reservas)
- Data + status (encomendas)

**9.1.3 Integridade Referencial**

Constraints:
- Foreign keys com ON DELETE e ON UPDATE apropriados
- Check constraints para validações
- Unique constraints para evitar duplicidades

Triggers:
- Atualização de timestamps automáticos
- Cálculo de valores derivados
- Validações complexas

### 9.2 Camadas da Aplicação

**9.2.1 Backend (API)**

Estrutura de rotas:

Autenticação:
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/recuperar-senha
- POST /api/auth/alterar-senha

Usuários:
- GET /api/usuarios
- GET /api/usuarios/:id
- POST /api/usuarios
- PUT /api/usuarios/:id
- DELETE /api/usuarios/:id

Unidades:
- GET /api/unidades
- GET /api/blocos/:id/unidades
- POST /api/unidades
- PUT /api/unidades/:id

Avisos:
- GET /api/avisos
- POST /api/avisos
- PUT /api/avisos/:id
- DELETE /api/avisos/:id
- POST /api/avisos/:id/marcar-lido

Reservas:
- GET /api/espacos
- GET /api/reservas/disponiveis
- POST /api/reservas
- PUT /api/reservas/:id
- DELETE /api/reservas/:id

Portaria:
- GET /api/encomendas
- POST /api/encomendas
- PUT /api/encomendas/:id/baixar
- GET /api/visitantes
- POST /api/visitantes/autorizar

Financeiro:
- GET /api/faturas
- GET /api/faturas/:id/boleto
- GET /api/relatorios/financeiro

**9.2.2 Middleware e Validações**

Autenticação:
- Validação de token JWT
- Refresh token
- Sessão expirada

Autorização:
- Verificação de perfil
- Permissões por módulo

- Acesso a recursos próprios

Validações:
- Validação de entrada (schema validation)
- Sanitização de dados
- Rate limiting

**9.2.3 Frontend (Web)**

Estrutura de páginas:

Públicas:
- Login
- Recuperação de senha

Dashboard:
- Visão geral personalizada por perfil
- Widgets principais
- Notificações recentes

Módulos:
- Cada módulo com suas páginas específicas
- Navegação contextual
- Breadcrumbs

Componentes reutilizáveis:
- Cards
- Tabelas com paginação
- Formulários padronizados

- Modais
- Notificações (toast)

### 9.3 Segurança

**9.3.1 Autenticação e Autorização**

Estratégias:
- Senhas com hash (bcrypt)
- Tokens JWT com expiração
- Refresh tokens em cookie httpOnly
- Logout invalida tokens

Controle de acesso:
- Role-based access control (RBAC)
- Permissões granulares
- Validação em backend

**9.3.2 Proteção de Dados**

LGPD compliance:
- Consentimento explícito
- Direito ao esquecimento
- Portabilidade de dados
- Minimização de coleta
- Log de acesso a dados sensíveis

Criptografia:
- Dados sensíveis criptografados

- Comunicação HTTPS
- Certificado SSL válido

**9.3.3 Auditoria**

Logs completos:
- Acessos ao sistema
- Modificações em dados
- Tentativas de acesso inválidas
- Operações financeiras

Retenção:
- Logs mantidos por período legal
- Backup de logs
- Análise de anomalias

### 9.4 Integrações

**9.4.1 E-mail**

Configuração SMTP:
- Servidor SMTP configurável
- Templates de e-mail personalizáveis
- Fila de envio
- Retry automático em falhas

Tipos de e-mail:
- Notificações transacionais
- E-mails de marketing (opcional)

- Relatórios periódicos
- Alertas urgentes

**9.4.2 Notificações Push**

Implementação:
- Firebase Cloud Messaging (FCM) ou similar
- Registro de tokens
- Segmentação por perfil
- Agendamento de envios

**9.4.3 SMS (Opcional)**

Provedor de SMS:
- Integração com gateway nacional
- Envio de códigos de verificação
- Alertas críticos

**9.4.4 APIs Bancárias**

Boletos:
- Geração via API
- Arquivo CNAB
- Registro de boletos
- Consulta de pagamentos

PIX:
- Geração de QR Code dinâmico
- Webhook de confirmação

- Conciliação automática

**9.4.5 Armazenamento de Arquivos**

Opções:
- Armazenamento local (servidor)
- S3 ou similar (cloud)
- Backup redundante

Gestão:
- Upload com validação
- Compressão automática de imagens
- Organização por módulo
- Cleanup de arquivos órfãos

### 9.5 Performance e Escalabilidade

**9.5.1 Cache**

Estratégias:
- Cache de consultas frequentes (Redis)
- Cache de assets estáticos
- Cache de sessões
- Invalidação inteligente

**9.5.2 Otimizações de Banco**

Queries:
- Índices apropriados

- Queries otimizadas
- Paginação de resultados
- Lazy loading de relações

Connection pooling:
- Pool de conexões configurado
- Limite de conexões simultâneas

**9.5.3 Otimizações Frontend**

Carregamento:
- Code splitting
- Lazy loading de rotas
- Compressão de assets
- CDN para recursos estáticos

Responsividade:
- Design mobile-first
- Imagens responsivas
- Progressive Web App (PWA)

### 9.6 Backup e Recuperação

**9.6.1 Backup de Dados**

Estratégia:
- Backup diário automatizado
- Backup incremental horário
- Backup completo semanal

- Retenção de 30 dias

Escopo:
- Banco de dados completo
- Arquivos de usuário
- Configurações do sistema

**9.6.2 Disaster Recovery**

Plano:
- Documentação de recuperação
- Testes periódicos
- RTO e POR definidos
- Servidor de contingência

**9.6.3 Versionamento**

Código:
- Git com branches definidas
- Tags de versão
- Changelog documentado

Banco de dados:
- Migrations versionadas
- Rollback possível
- Testes antes de deploy

## 10. PROCESSO DE IMPLEMENTAÇÃO

### 10.1 Fase Pré-Implementação

**10.1.1 Levantamento de Requisitos**

Reunião com cliente:
- Quantidade de blocos e unidades
- Estrutura organizacional
- Processos atuais
- Necessidades específicas
- Módulos desejados

Documentação:
- Regimento interno
- Convenção do condomínio
- Organograma
- Lista de moradores (se disponível)

**10.1.2 Preparação do Ambiente**

Infraestrutura:
- Provisionamento de servidor
- Instalação de dependências
- Configuração de banco de dados
- Certificado SSL
- Domínio configurado

Configuração inicial:
- Arquivo .env com dados do condomínio

- Nome, CNPJ, endereço
- E-mails administrativos
- Configurações de SMTP

### 10.2 Implementação Técnica

**10.2.1 Configuração Base (30 minutos)**

Passo a passo:
1. Clone da aplicação no servidor
2. Configuração do arquivo .env
3. Criação do banco de dados
4. Execução das migrations
5. Seed com dados iniciais
6. Upload da logo (pasta /logo/)
7. Teste de conectividade

**10.2.2 Customização Visual (20 minutos)**

Passo a passo:
1. Acesso à página de personalização
2. Seleção ou customização de tema
3. Upload da logo oficial
4. Ajuste de cores (se necessário)
5. Pré-visualização e teste
6. Salvamento das configurações

**10.2.3 Carga de Dados (30-60 minutos)**

Cadastros iniciais:
1. Cadastro de blocos
2. Cadastro de unidades (pode ser em lote)
3. Cadastro do síndico (primeiro usuário)
4. Cadastro de espaços reserváveis (se aplicável)
5. Upload de documentos iniciais (regimento, convenção)

Importação em massa:
- Se cliente fornecer planilha com moradores
- Script de importação automatizado
- Validação de dados
- Geração de senhas temporárias

**10.2.4 Testes Finais (20 minutos)**

Checklist:
- Login do síndico funcional
- Acesso a todos os módulos contratados
- Envio de e-mail de teste
- Upload de arquivo de teste
- Criação de aviso de teste
- Reserva de teste (se módulo ativo)
- Responsividade em mobile

### 10.3 Entrega e Treinamento

**10.3.1 Treinamento do Síndico (1-2 horas)**

Tópicos:

- Navegação geral
- Gestão de usuários
- Criação de avisos
- Gestão de reservas (se aplicável)
- Aprovação de solicitações
- Relatórios principais
- Alteração de configurações

Material de apoio:
- Manual do usuário (PDF)
- Vídeos tutoriais
- FAQ
- Contato de suporte

**10.3.2 Onboarding dos Moradores**

Comunicação:
- Aviso geral sobre novo sistema
- Instruções de primeiro acesso
- Tutorial em vídeo
- Suporte durante primeiras semanas

Processo de acesso:
- Envio de e-mail com credenciais temporárias
- Link de acesso ao sistema
- Obrigatoriedade de troca de senha
- Atualização de dados pessoais

**10.3.3 Go-Live**

Checklist final:
- Todos os cadastros validados
- Comunicação oficial enviada
- Suporte em standby
- Monitoramento ativo
- Backup realizado antes do go-live

### 10.4 Pós-Implementação

**10.4.1 Suporte Inicial (30 dias)**

Atividades:
- Monitoramento de uso
- Resolução de dúvidas
- Ajustes de configuração
- Identificação de bugs
- Treinamentos adicionais

**10.4.2 Manutenção Contínua**

Plano de manutenção:
- Atualizações de segurança
- Novos recursos
- Melhorias de performance
- Backup contínuo
- Monitoramento de disponibilidade

**10.4.3 Upgrades e Expansão**

Módulos adicionais:
- Venda de módulos não contratados inicialmente
- Migração de dados para novos módulos
- Treinamento incremental
- Ajuste de precificação

## 11. CRONOGRAMA DE DESENVOLVIMENTO (SPRINTS)

### Sprint 1: Setup e Módulo Core (2-3 semanas)

**Objetivos:**
- Arquitetura base funcional
- Banco de dados estruturado
- Sistema de autenticação completo
- CRUD de unidades e pessoas

**Entregas:**
- Estrutura de pastas do projeto
- Banco de dados com tabelas principais
- API de autenticação
- Tela de login
- Dashboard básico
- Cadastro de blocos e unidades
- Cadastro de pessoas
- Sistema de permissões

**Critérios de aceite:**

- Síndico consegue logar
- Síndico consegue cadastrar unidades
- Síndico consegue cadastrar pessoas e vincular a unidades
- Diferentes perfis têm acesso diferenciados

### Sprint 2: Módulo de Comunicação (2 semanas)

**Objetivos:**
- Mural digital funcional
- Sistema de documentos
- Base para assembleias

**Entregas:**
- CRUD de avisos
- Sistema de expiração automática
- Visualização e marcação de leitura
- Upload de documentos
- Categorização de documentos
- Visualizador de PDF integrado
- Estrutura básica de assembleias

**Critérios de aceite:**
- Síndico cria aviso e morador visualiza
- Avisos expiram automaticamente
- Upload de PDF funciona corretamente
- Documentos são categorizados e buscáveis

### Sprint 3: Sistema de Reservas (2-3 semanas)

**Objetivos:**
- Módulo de reservas completo e funcional
- Lógica de conflitos implementada
- Termo de uso integrado

**Entregas:**
- Cadastro de espaços reserváveis
- Configuração de regras por espaço
- Calendário de disponibilidade
- Solicitação de reserva
- Validação de conflitos
- Termo de responsabilidade
- Sistema de aprovação
- Integração com módulo financeiro (taxa de limpeza)
- Painel de gestão de reservas

**Critérios de aceite:**
- Morador consegue visualizar disponibilidade
- Sistema bloqueia reservas conflitantes
- Termo é obrigatório antes de confirmar
- Síndico aprova/recusa reservas
- Taxa é gerada automaticamente (se configurado)

### Sprint 4: Portaria e Logística (2 semanas)

**Objetivos:**
- Controle de portaria operacional
- Gestão de encomendas e visitantes

**Entregas:**
- Livro de ocorrências digital
- Controle de encomendas (entrada/saída)
- Notificações automáticas de encomenda
- Autorização de visitantes
- Registro de acessos
- Dashboard da portaria

**Critérios de aceite:**
- Porteiro registra ocorrência facilmente
- Encomenda notifica morador automaticamente
- Morador pré-autoriza visitante
- Porteiro valida visitante na entrada
- Assinatura digital na retirada de encomenda

### Sprint 5: Dashboard e Relatórios (1-2 semanas)

**Objetivos:**
- Dashboards personalizados
- Relatórios gerenciais
- Finalização de UX

**Entregas:**
- Dashboard do síndico com métricas principais
- Dashboard do morador personalizado
- Relatórios de reservas
- Relatórios de ocorrências
- Relatório de encomendas
- Exportação de relatórios (PDF, Excel)

- Melhorias de UX/UI

**Critérios de aceite:**
- Síndico visualiza métricas importantes
- Relatórios são precisos e exportáveis
- Interface intuitiva e responsiva

### Sprint 6: Módulo Financeiro (OPCIONAL – 3-4 semanas)

**Objetivos:**
- Sistema financeiro completo
- Integração bancária
- Controle de inadimplência

**Entregas:**
- Cadastro de fornecedores
- Lançamento de despesas
- Rateio de custos
- Geração de faturas
- Integração bancária (boletos e PIX)
- Controle de pagamentos
- Relatórios financeiros
- Portal de transparência
- Gestão de inadimplência

**Critérios de aceite:**
- Sistema gera faturas mensais automaticamente
- Boletos são gerados e enviados
- Pagamentos são conciliados automaticamente

- Relatórios financeiros são precisos
- Morador visualiza suas faturas e histórico

## 12. MODELO DE PRECIFICAÇÃO

### 12.1 Estrutura de Preços Sugerida

**12.1.1 Modelo Base + Módulos**

Implementação Base (Obrigatória):
- Módulo Core (unidades, pessoas, autenticação)
- Módulo Comunicação (mural e documentos)
- Customização visual completa
- Treinamento inicial
- 30 dias de suporte

Módulos Adicionais (Opcionais):
- Módulo de Reservas
- Módulo de Portaria
- Módulo Financeiro (Premium)

**12.1.2 Precificação por Porte**

Categorização:
- Pequeno: até 50 unidades
- Médio: 51-150 unidades
- Grande: 151-300 unidades
- Extra Grande: 301+ unidades

Valores diferenciados:
- Taxa de implementação varia por porte
- Mensalidade de manutenção proporcional
- Módulos adicionais com desconto progressivo

**12.1.3 Modelo de Receita Recorrente**

Mensalidade:
- Hospedagem e infraestrutura
- Manutenção e atualizações
- Suporte técnico
- Backup automatizado
- Monitoramento

Serviços adicionais:
- Treinamentos extras
- Customizações específicas
- Integrações personalizadas
- Consultoria de processos

### 12.2 Diferenciação Competitiva

**12.2.1 Vantagens do Produto**

Técnicas:
- Implementação rápida (5 minutos)
- Customização visual completa
- Arquitetura robusta (PostgreSQL)

- Escalabilidade modular
- Segurança avançada

Funcionais:
- Interface intuitiva
- Mobile-first
- Automações inteligentes
- Relatórios completos
- Multi-perfil

**12.2.2 Argumentos de Venda**

ROI para o condomínio:
- Redução de custos com comunicação (papel, impressão)
- Economia de tempo da administração
- Redução de inadimplência (módulo financeiro)
- Transparência e satisfação dos moradores
- Modernização e valorização do imóvel

Comparativo com concorrentes:
- Customização superior
- Implementação mais rápida
- Suporte personalizado
- Custo-benefício atrativo

## 13. DOCUMENTAÇÃO DE SUPORTE

### 13.1 Manual do Usuário

**13.1.1 Estrutura do Manual**

Capítulos:
1. Introdução ao sistema
2. Primeiro acesso
3. Navegação básica
4. Módulo de Comunicação
5. Módulo de Reservas
6. Módulo de Portaria
7. Módulo Financeiro
8. Perguntas Frequentes
9. Suporte técnico

Formato:
- PDF navegável
- Versão web (HTML)
- Vídeos tutoriais curtos (2-5 min)
- Tooltips contextuais no sistema

**13.1.2 Guias Específicos por Perfil**

Guia do Síndico:
- Gestão completa do sistema
- Configurações avançadas
- Relatórios gerenciais
- Aprovação de solicitações

Guia do Morador:

- Funcionalidades básicas
- Como reservar espaços
- Como autorizar visitantes
- Como visualizar faturas

Guia do Porteiro:
- Controle de encomendas
- Registro de visitantes
- Livro de ocorrências

### 13.2 Documentação Técnica

**13.2.1 Para Implementadores**

Conteúdo:
- Requisitos de servidor
- Processo de instalação passo a passo
- Configuração de variáveis de ambiente
- Troubleshooting comum
- Comandos úteis
- Checklist de go-live

**13.2.2 Para Desenvolvedores**

Conteúdo:
- Arquitetura do sistema
- Estrutura de banco de dados (DER)
- API documentation (Swagger/OpenAPI)
- Guia de contribuição

- Padrões de código
- Fluxo de deploy

### 13.3 Base de Conhecimento

**13.3.1 FAQ Categorizado**

Categorias:
- Acesso e login
- Cadastros
- Reservas
- Encomendas
- Financeiro
- Configurações
- Problemas técnicos

**13.3.2 Tutoriais Práticos**

Tutoriais em vídeo:
- Como criar um aviso
- Como fazer uma reserva
- Como autorizar visitante
- Como gerar relatório
- Como personalizar o tema

### 13.4 Material de Treinamento

**13.4.1 Apresentação para Síndico**

Slides:
- Visão geral do sistema
- Principais funcionalidades
- Fluxos de trabalho
- Melhores práticas
- Casos de uso

**13.4.2 Webinar para Moradores**

Roteiro:
- Introdução ao sistema (5 min)
- Como acessar (5 min)
- Principais funcionalidades (15 min)
- Demonstração prática (10 min)
- Perguntas e respostas (10 min)

## 14. SUPORTE E MANUTENÇÃO

### 14.1 Níveis de Suporte

**14.1.1 Suporte Básico (Incluído)**

Canais:
- E-mail (resposta em até 24h)
- Base de conhecimento
- Tutoriais em vídeo

Escopo:

- Dúvidas de uso
- Problemas técnicos simples
- Orientações gerais

**14.1.2 Suporte Premium (Opcional)**

Canais:
- WhatsApp/Telefone (horário comercial)
- E-mail prioritário (resposta em até 4h)
- Acesso remoto para resolução

Escopo:
- Suporte técnico avançado
- Customizações menores
- Treinamentos adicionais

**14.1.3 Suporte Crítico (SLA)**

Para problemas graves:
- Sistema fora do ar
- Perda de dados
- Falha de segurança
- Bug crítico

Resposta:
- Até 1 hora para primeira resposta
- Resolução prioritária
- Comunicação constante

### 14.2 Manutenção Preventiva

**14.2.1 Rotinas Automáticas**

Diárias:
- Backup de banco de dados
- Limpeza de logs antigos
- Verificação de espaço em disco
- Monitoramento de performance

Semanais:
- Backup completo
- Análise de logs de erro
- Verificação de integridade do banco
- Atualização de dependências de segurança

Mensais:
- Relatório de uso do sistema
- Análise de performance
- Otimização de queries lentas
- Revisão de segurança

**14.2.2 Atualizações**

Tipos:
- Patches de segurança (imediatos)
- Correção de bugs (semanais)
- Novos recursos (mensais/trimestrais)
- Versões principais (semestrais)

Processo:
- Testes em ambiente de homologação
- Notificação prévia ao cliente
- Janela de manutenção programada
- Rollback preparado se necessário

### 14.3 Monitoramento

**14.3.1 Métricas Monitoradas**

Performance:
- Tempo de resposta da API
- Tempo de carregamento de páginas
- Taxa de erro
- Uso de CPU e memória
- Espaço em disco

Negócio:
- Usuários ativos
- Taxa de adoção
- Funcionalidades mais usadas
- Horários de pico

**14.3.2 Alertas Automáticos**

Configurações:
- Sistema fora do ar
- Uso de disco acima de 80%

- Tempo de resposta &gt; 3 segundos
- Taxa de erro &gt; 5%
- Falha em backup

Notificações:
- E-mail para equipe técnica
- SMS para problemas críticos
- Dashboard de monitoramento

## 15. CONSIDERAÇÕES FINAIS

### 15.1 Checklist de Implementação Completa

**Antes do Go-Live:**
- [ ] Servidor provisionado e configurado
- [ ] Banco de dados criado e migrated
- [ ] Arquivo .env configurado corretamente
- [ ] Logo do condomínio no diretório /logo/
- [ ] Tema personalizado aplicado
- [ ] Blocos e unidades cadastrados
- [ ] Síndico cadastrado e testado
- [ ] Espaços reserváveis configurados (se aplicável)
- [ ] Documentos iniciais uploaded
- [ ] E-mail de teste enviado com sucesso
- [ ] Backup inicial realizado
- [ ] Certificado SSL ativo
- [ ] Domínio apontando corretamente
- [ ] Testes de responsividade concluídos

- [ ] Manual do usuário entregue
- [ ] Treinamento do síndico realizado

**Pós Go-Live:**
- [ ] Monitoramento ativo
- [ ] Suporte em standby
- [ ] Comunicação aos moradores enviada
- [ ] Primeiros acessos monitorados
- [ ] Feedback coletado
- [ ] Ajustes finos realizados

### 15.2 Próximos Passos Recomendados

**Curto Prazo (1-3 meses):**
- Coleta de feedback dos usuários
- Ajustes de UX baseados no uso real
- Correção de bugs identificados
- Otimização de performance

**Médio Prazo (3-6 meses):**
- Implementação de funcionalidades solicitadas
- Venda de módulos adicionais
- Integração com novos serviços
- Expansão para outros condomínios

**Longo Prazo (6-12 meses):**
- Desenvolvimento de app mobile nativo
- Integração com IoT (controle de acesso, câmeras)
- BI e analytics avançados

- Marketplace de serviços para moradores

### 15.3 Riscos e Mitigações

**Riscos Técnicos:**

Risco: Perda de dados
- Mitigação: Backup automatizado diário + teste mensal de restore

Risco: Indisponibilidade do sistema
- Mitigação: Monitoramento 24/7 + servidor de contingência

Risco: Falha de segurança
- Mitigação: Auditorias periódicas + atualizações constantes

**Riscos de Negócio:**

Risco: Baixa adoção pelos moradores
- Mitigação: Treinamento efetivo + interface intuitiva + suporte ativo

Risco: Resistência à mudança
- Mitigação: Comunicação clara dos benefícios + período de adaptação

Risco: Concorrência
- Mitigação: Diferenciação por customização + preço competitivo + suporte
superior

### 15.4 Métricas de Sucesso

**KPIs Técnicos:**
- Uptime &gt; 99,5%
- Tempo de resposta &lt; 2 segundos
- Taxa de erro &lt; 1%
- Tempo de implementação &lt; 1 hora

**KPIs de Negócio:**
- Taxa de adoção &gt; 70% em 30 dias
- NPS (Net Promoter Score) &gt; 50
- Churn rate &lt; 5% ao ano
- Upsell de módulos &gt; 30%

**KPIs de Suporte:**
- Tempo médio de primeira resposta &lt; 2 horas
- Taxa de resolução no primeiro contato &gt; 80%
- Satisfação com suporte &gt; 4.5/5

## CONCLUSÃO

Esta documentação apresenta um sistema completo e robusto de gestão
condominial, projetado para ser implementado rapidamente, mas com
funcionalidades avançadas que atendem todas as necessidades de um
condomínio moderno.

A arquitetura modular permite vendas escaláveis, desde a implementação
básica até o pacote completo com módulo financeiro, adaptando-se ao
orçamento e necessidades de cada cliente.

A personalização visual completa garante que cada condomínio tenha sua
identidade preservada, aumentando o senso de pertencimento e a taxa de
adoção.

O tempo de implementação de aproximadamente 5 minutos (após configuração
inicial) torna o produto extremamente competitivo no mercado, permitindo
atender múltiplos clientes rapidamente.

A documentação técnica detalhada facilita tanto o desenvolvimento quanto
futuras manutenções e expansões do sistema.

**Sistema pronto para desenvolvimento e comercialização!**