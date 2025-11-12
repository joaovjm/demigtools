# 📧 Envio de Campanhas em Massa - Documentação

## Visão Geral

A funcionalidade de **Envio em Massa** permite que administradores selecionem múltiplos contatos com email e enviem uma campanha para todos simultaneamente.

## Como Acessar

1. Faça login como **Admin**
2. No menu superior, clique em **"Admin"**
3. Selecione **"Envio em Massa"**
4. Você será redirecionado para `/bulkemailsend`

## Estrutura de Dados

### Tabela `donor_email`
```sql
- id: ID único do registro
- donor_id: FK que referencia a tabela donor
- donor_email: Email do doador
```

### Tabela `donor`
```sql
- donor_id: ID único do doador
- donor_name: Nome do doador
- donor_type: Tipo do doador (Mensal, Esporádico, etc.)
- donor_tel_1: Telefone principal
- ... outros campos
```

## Funcionalidades

### 1. Seleção de Contatos

**Painel Esquerdo - Lista de Contatos:**
- Visualize todos os doadores que possuem email cadastrado
- Cada contato exibe:
  - Nome do doador
  - Tipo do doador (badge colorido)
  - Email
  - Telefone 1 (se disponível)

**Exemplo de exibição de contato:**
```
☑️ João da Silva [Mensal]
    joao@email.com
    📞 41999999999
```

**Filtros Disponíveis:**
- 🔍 **Busca por texto**: Filtra por nome, email ou telefone
- 🔽 **Filtro por tipo**: Filtra por tipo de doador (Mensal, Esporádico, Lead, etc.)
- ☑️ **Selecionar/Desselecionar Todos**: Marca ou desmarca todos os contatos filtrados

**Seleção Individual:**
- Clique em qualquer contato para marcar/desmarcar
- Contatos selecionados ficam destacados com fundo colorido
- O contador mostra quantos contatos estão selecionados

**Exemplos de Busca:**
- Digite `João` → Encontra todos com "João" no nome
- Digite `@gmail.com` → Encontra todos os emails do Gmail
- Digite `41999` → Encontra todos os telefones que começam com 41999
- Digite `Mensal` no filtro de tipo → Mostra apenas doadores mensais
- Combine busca + filtro para refinar ainda mais

### 2. Composição da Campanha

**Painel Direito - Formulário de Campanha:**

#### a) Seleção de Campanha
- Escolha uma campanha cadastrada no sistema
- Apenas campanhas com textos cadastrados aparecem
- Ao selecionar, os textos disponíveis são carregados

#### b) Seleção de Texto
- Escolha o texto da campanha selecionada
- Ao selecionar, o assunto e mensagem são preenchidos automaticamente

#### c) Assunto
- Campo obrigatório
- Define o assunto do email

#### d) Mensagem
- Campo obrigatório com textarea
- Suporta variáveis dinâmicas:
  - `{{nome_doador}}` - Substitui pelo nome do doador
  - `[IMAGEM]` - Posição onde a imagem será inserida

#### e) Anexar Imagem (opcional)
- Escolha uma imagem (JPEG, PNG, GIF, WEBP)
- Tamanho máximo: 5MB
- Preview em tempo real
- Botão para remover imagem
- Se `[IMAGEM]` estiver no texto, a imagem será inserida naquela posição
- Se não houver `[IMAGEM]`, a imagem será adicionada no final

### 3. Envio

**Processo de Envio:**
1. Clique no botão **"Enviar para X contatos"**
2. O sistema valida:
   - Se há contatos selecionados
   - Se assunto e mensagem estão preenchidos
3. Inicia o envio sequencial com:
   - Barra de progresso visual
   - Contador (X de Y)
   - Delay de 500ms entre envios

**Feedback:**
- ✅ **Sucesso**: Mensagem verde com total de emails enviados
- ⚠️ **Parcial**: Mensagem amarela indicando sucessos e falhas
- ❌ **Erro**: Mensagem vermelha com detalhes do erro

## Variáveis Dinâmicas

### `{{nome_doador}}`
Substitui o nome do doador no corpo da mensagem.

**Exemplo:**
```
Olá {{nome_doador}},

Esperamos que esteja bem...
```

**Resultado para João Silva:**
```
Olá João Silva,

Esperamos que esteja bem...
```

### `[IMAGEM]`
Define onde a imagem anexada será exibida no email.

**Exemplo:**
```
Confira nossa nova campanha:

[IMAGEM]

Obrigado pelo apoio!
```

## Arquivos Criados

### 1. Helper - `src/helper/getDonorEmails.jsx`
Funções para buscar doadores com email:
- `getDonorEmails()`: Busca todos os contatos com email
- `getDonorEmailsByType(type)`: Busca contatos filtrados por tipo

### 2. Página - `src/pages/BulkEmailSend/index.jsx`
Componente principal com toda a lógica de:
- Listagem de contatos
- Filtros e busca
- Seleção múltipla
- Composição de campanha
- Envio em massa

### 3. Estilos - `src/pages/BulkEmailSend/bulkemailsend.module.css`
CSS modular com design moderno:
- Layout responsivo em grid
- Animações suaves
- Estados visuais (hover, selected)
- Barra de progresso animada

### 4. Rotas Atualizadas
- `src/router.jsx`: Adicionada rota `/bulkemailsend` protegida por Admin
- `src/components/Navitens/index.jsx`: Adicionado item no menu Admin

## API Utilizada

### Endpoint: `/api/send-email`
Já existente no sistema, enviando um email por vez.

**Payload:**
```json
{
  "emailTo": "email@exemplo.com",
  "subject": "Assunto do email",
  "text": "Corpo da mensagem",
  "image": {
    "filename": "imagem.jpg",
    "content": "base64_string",
    "contentType": "image/jpeg"
  }
}
```

## Permissões

⚠️ **IMPORTANTE**: Esta funcionalidade está disponível apenas para usuários com perfil **Admin**.

A rota é protegida por `<ProtectedRoute requiredRole="Admin" />`.

## Fluxo de Uso Completo

1. **Acesso**: Admin → Envio em Massa
2. **Filtros**: Escolha tipo de doador (opcional)
3. **Busca**: Digite nome, email ou telefone para refinar (opcional)
4. **Seleção**: Marque os contatos desejados ou use "Selecionar Todos"
5. **Campanha**: Escolha campanha e texto pré-cadastrados
6. **Revisão**: Revise assunto e mensagem (pode editar)
7. **Imagem**: Adicione imagem se desejar (opcional)
8. **Envio**: Clique em "Enviar para X contatos"
9. **Aguarde**: Acompanhe o progresso na barra
10. **Resultado**: Veja o feedback de sucesso/falha

## Observações Técnicas

- **Delay entre envios**: 500ms para evitar sobrecarga
- **Validação de emails**: Apenas emails válidos (com @) são listados
- **Substituição de variáveis**: Feita antes do envio para cada contato
- **Responsivo**: Layout adaptável para desktop e mobile
- **Busca inteligente**: 
  - Nome: busca case-insensitive (não diferencia maiúsculas/minúsculas)
  - Email: busca case-insensitive
  - Telefone: busca exata por números digitados
  - Resultados em tempo real conforme você digita

## Melhorias Futuras Sugeridas

- [ ] Salvar templates de mensagens personalizadas
- [ ] Agendar envios para data/hora específica
- [ ] Histórico de campanhas enviadas
- [ ] Estatísticas de abertura/cliques
- [ ] Envio em lotes maiores com fila
- [ ] Preview do email antes de enviar
- [ ] Exportar lista de contatos selecionados

## Suporte

Para dúvidas ou problemas, contate o administrador do sistema.

---

**Versão**: 1.0  
**Data**: 2025-11-12  
**Autor**: DEMIGTools Development Team

