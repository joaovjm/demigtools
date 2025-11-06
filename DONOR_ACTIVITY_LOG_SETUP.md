# Sistema de Histórico de Atividades do Doador

## 📋 Visão Geral

Foi implementado um sistema completo de rastreamento de atividades para doadores, que registra todas as ações realizadas por operadores, incluindo:

- ✅ Acesso ao doador
- ✅ Edição de informações do doador
- ✅ Criação de doações
- ✅ Edição de doações
- ✅ Deleção de doações

## 🗄️ Configuração do Banco de Dados

### 1. Criar a tabela no Supabase

Execute o script SQL localizado em:
```
/demigtools/supabase_donor_activity_log.sql
```

**Passos:**
1. Acesse o Dashboard do Supabase
2. Navegue até **SQL Editor**
3. Abra o arquivo `supabase_donor_activity_log.sql`
4. Copie todo o conteúdo e execute no SQL Editor
5. Verifique se a tabela foi criada com sucesso

### 2. Estrutura da Tabela

A tabela `donor_activity_log` contém os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGSERIAL | Chave primária |
| `donor_id` | BIGINT | ID do doador (FK) |
| `operator_code_id` | VARCHAR(50) | ID do operador que realizou a ação |
| `action_type` | VARCHAR(100) | Tipo de ação realizada |
| `action_description` | TEXT | Descrição detalhada da ação |
| `old_values` | JSONB | Valores antigos (para edições) |
| `new_values` | JSONB | Valores novos (para edições/criações) |
| `related_donation_id` | BIGINT | ID da doação relacionada (opcional) |
| `created_at` | TIMESTAMP | Data e hora da ação |

### 3. Tipos de Ações (action_type)

- `donor_access` - Quando um operador acessa a página do doador
- `donor_edit` - Quando informações do doador são editadas
- `donation_create` - Quando uma nova doação é criada
- `donation_edit` - Quando uma doação é editada
- `donation_delete` - Quando uma doação é deletada

## 🎨 Componentes Criados

### 1. **TabNavigation** (`src/components/TabNavigation`)
Sistema de navegação por abas reutilizável.

### 2. **DonorActivityHistory** (`src/components/DonorActivityHistory`)
Componente que exibe o histórico de atividades em formato de timeline.

**Características:**
- Exibição em ordem cronológica (mais recente primeiro)
- Ícones e cores diferentes para cada tipo de ação
- Expansível para ver detalhes das alterações
- Loading state
- Empty state quando não há atividades

### 3. **Helper: logDonorActivity** (`src/helper/logDonorActivity.jsx`)
Funções utilitárias para registro e busca de atividades.

**Funções principais:**
- `logDonorActivity()` - Registra uma nova atividade
- `getDonorActivityLog()` - Busca o histórico de atividades
- `getActionDescription()` - Gera descrições amigáveis

## 📱 Interface do Usuário

### Página Donor

A página do doador agora possui **duas abas**:

1. **Doações** 📊
   - Lista de todas as doações do doador (TableDonor)
   - Funcionalidade existente mantida

2. **Histórico de Ações** 📜
   - Timeline com todas as atividades registradas
   - Informações sobre:
     - Quem realizou a ação (operador)
     - Quando foi realizada (data e hora)
     - O que foi feito (descrição)
     - Detalhes das alterações (valores antigos vs novos)

### Visualização do Histórico

Cada entrada do histórico mostra:
- **Ícone visual** indicando o tipo de ação
- **Descrição clara** da ação realizada
- **Operador responsável** pela ação
- **Data e hora** com formato brasileiro
- **ID da doação** relacionada (quando aplicável)
- **Botão "Ver detalhes"** para expandir e visualizar:
  - Valores anteriores
  - Valores novos
  - Formato JSON estruturado

## 🔧 Integração Automática

O sistema registra automaticamente as seguintes ações:

### 1. Acesso ao Doador
**Quando:** Um operador abre a página de um doador
**Arquivo:** `src/pages/Donor/index.jsx`
```javascript
logDonorActivity({
  donor_id: id,
  operator_code_id: operatorData.operator_code_id,
  action_type: "donor_access",
  action_description: "Acessou a página do doador",
});
```

### 2. Edição do Doador
**Quando:** Um operador salva alterações nas informações do doador
**Arquivo:** `src/pages/Donor/index.jsx` (handleEditDonor)
```javascript
logDonorActivity({
  donor_id: id,
  operator_code_id: operatorData.operator_code_id,
  action_type: "donor_edit",
  action_description: "Editou as informações do doador",
  old_values: originalDonorData,
  new_values: donorData,
});
```

### 3. Criação de Doação
**Quando:** Uma nova doação é criada
**Arquivo:** `src/components/ModalDonation/index.jsx` (handleSubmit)
```javascript
logDonorActivity({
  donor_id: donor_id,
  operator_code_id: operatorData.operator_code_id,
  action_type: "donation_create",
  action_description: `Criou uma doação no valor de R$ ${valor}`,
  new_values: { /* dados da doação */ },
  related_donation_id: result[0].donation_code_id,
});
```

### 4. Edição de Doação
**Quando:** Uma doação existente é modificada
**Arquivo:** `src/components/ModalEditDonation/index.jsx` (handleConfirm)
```javascript
logDonorActivity({
  donor_id: donation.donor_id,
  operator_code_id: operatorData.operator_code_id,
  action_type: "donation_edit",
  action_description: `Editou a doação de R$ ${oldValue} para R$ ${newValue}`,
  old_values: originalValues,
  new_values: newValues,
  related_donation_id: donation.donation_code_id,
});
```

### 5. Deleção de Doação
**Quando:** Uma doação é deletada
**Arquivo:** `src/components/ModalEditDonation/index.jsx` (handleDelete)
```javascript
logDonorActivity({
  donor_id: donation.donor_id,
  operator_code_id: operatorData.operator_code_id,
  action_type: "donation_delete",
  action_description: `Deletou uma doação no valor de R$ ${valor}`,
  old_values: { /* dados da doação deletada */ },
  related_donation_id: donation.donation_code_id,
});
```

## 🎯 Benefícios do Sistema

1. **Rastreabilidade Completa**
   - Saber exatamente quem fez o quê e quando
   - Histórico completo de todas as interações com o doador

2. **Auditoria**
   - Facilita auditorias internas
   - Identificação de padrões de uso
   - Responsabilização de operadores

3. **Resolução de Problemas**
   - Identificar quando e como erros foram introduzidos
   - Reverter alterações problemáticas com informações precisas

4. **Análise de Desempenho**
   - Monitorar atividade dos operadores
   - Identificar picos de atividade
   - Otimizar processos

## 🚀 Como Usar

### Para Operadores

1. **Acessar o Doador:**
   - Navegue até a página de um doador
   - O acesso será automaticamente registrado

2. **Ver Histórico:**
   - Na página do doador, clique na aba "Histórico de Ações"
   - Visualize todas as atividades em ordem cronológica
   - Clique em "Ver detalhes" para informações completas

3. **Realizar Ações:**
   - Todas as ações (criar, editar, deletar) são registradas automaticamente
   - Não é necessário fazer nada especial

### Para Desenvolvedores

Para adicionar novos tipos de ações:

1. Importe o helper:
```javascript
import { logDonorActivity } from "../../helper/logDonorActivity";
```

2. Chame a função no ponto apropriado:
```javascript
await logDonorActivity({
  donor_id: donorId,
  operator_code_id: operatorId,
  action_type: "seu_tipo_de_acao",
  action_description: "Descrição amigável da ação",
  old_values: valoresAntigos, // opcional
  new_values: valoresNovos,   // opcional
  related_donation_id: donationId, // opcional
});
```

## 📊 Políticas de Segurança (RLS)

O sistema utiliza Row Level Security do Supabase:

- **Leitura:** Todos os operadores autenticados podem visualizar o histórico
- **Inserção:** Todos os operadores autenticados podem criar registros
- **Atualização/Deleção:** Não permitido (histórico é imutável)

## 🔍 Possíveis Melhorias Futuras

1. **Filtros Avançados**
   - Filtrar por tipo de ação
   - Filtrar por operador
   - Filtrar por período

2. **Exportação**
   - Exportar histórico para PDF
   - Exportar histórico para Excel

3. **Notificações**
   - Alertas para ações críticas
   - Notificações por email

4. **Dashboard de Auditoria**
   - Visualização agregada de atividades
   - Gráficos e estatísticas

5. **Comparação de Versões**
   - Visualização lado a lado de alterações
   - Highlight de diferenças

## ❓ Troubleshooting

### A tabela não foi criada
- Verifique se você executou o script SQL completo
- Verifique as permissões do seu usuário no Supabase

### Atividades não estão sendo registradas
- Verifique se o `operator_code_id` está disponível no contexto
- Verifique o console do navegador para erros
- Verifique se as políticas RLS estão configuradas corretamente

### Histórico não aparece na interface
- Verifique se a aba "Histórico de Ações" está visível
- Verifique se há registros na tabela `donor_activity_log`
- Verifique o console para erros de carregamento

## 📝 Notas Importantes

- O histórico é **somente leitura** - registros não podem ser editados ou deletados
- Todos os timestamps são armazenados em UTC
- Os valores JSON são armazenados como JSONB para melhor performance
- O sistema não afeta a funcionalidade existente - é totalmente aditivo

## 🎉 Conclusão

O sistema de histórico de atividades está completamente funcional e integrado. Todos os pontos de ação já estão instrumentados e registrando automaticamente. Aproveite o novo nível de rastreabilidade e controle!

