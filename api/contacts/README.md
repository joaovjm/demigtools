# API de Contatos

Esta API gerencia os contatos do sistema, permitindo listar, visualizar, atualizar e deletar contatos, com foco especial na edição do código doador.

## Endpoints Disponíveis

### 1. Listar Contatos
**GET** `/api/contacts`

Retorna uma lista de todos os contatos com informações do operador associado.

**Resposta:**
```json
{
  "success": true,
  "contacts": [
    {
      "id": "uuid",
      "name": "Nome do Contato",
      "phone_number": "5511999999999",
      "donor_code": "COD123",
      "operator_name": "Nome do Operador",
      "operator_code_id": "123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

### 2. Buscar Contato por ID
**GET** `/api/contacts/[id]`

Retorna um contato específico pelo seu ID.

**Resposta:**
```json
{
  "success": true,
  "contact": {
    "id": "uuid",
    "name": "Nome do Contato",
    "phone_number": "5511999999999",
    "donor_code": "COD123",
    "operator_name": "Nome do Operador",
    "operator_code_id": "123",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 3. Atualizar Contato
**PUT** `/api/contacts/[id]`

Atualiza um contato existente. Principalmente usado para editar o código doador.

**Body:**
```json
{
  "donor_code": "NOVO_CODIGO",
  "name": "Novo Nome (opcional)",
  "phone_number": "5511888888888 (opcional)"
}
```

**Resposta:**
```json
{
  "success": true,
  "contact": {
    "id": "uuid",
    "name": "Nome do Contato",
    "phone_number": "5511999999999",
    "donor_code": "NOVO_CODIGO",
    "operator_name": "Nome do Operador",
    "operator_code_id": "123",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Contato atualizado com sucesso"
}
```

### 4. Criar Novo Contato
**POST** `/api/contacts`

Cria um novo contato no sistema.

**Body:**
```json
{
  "name": "Nome do Contato",
  "phone_number": "5511999999999",
  "operator_code_id": "123",
  "donor_code": "COD123"
}
```

### 5. Deletar Contato
**DELETE** `/api/contacts/[id]`

Remove um contato do sistema.

**Resposta:**
```json
{
  "success": true,
  "message": "Contato \"Nome do Contato\" deletado com sucesso"
}
```

### 6. Teste da API
**GET** `/api/contacts/test`

Endpoint de teste para verificar se a API está funcionando corretamente.

**Resposta:**
```json
{
  "success": true,
  "message": "✅ API de contatos funcionando corretamente!",
  "results": {
    "connection": "OK",
    "tableStructure": "OK",
    "operatorRelationship": "OK",
    "totalContacts": 10
  }
}
```

## Estrutura da Tabela

A API trabalha com a tabela `contacts` que possui os seguintes campos:

- `contact_id` (UUID, Primary Key)
- `name` (VARCHAR) - Nome do contato
- `phone_number` (VARCHAR) - Número de telefone
- `donor_code` (VARCHAR) - Código do doador (editável)
- `operator_code_id` (VARCHAR) - ID do operador associado
- `created_at` (TIMESTAMPTZ) - Data de criação

## Relacionamentos

- **Operadores**: A tabela `contacts` se relaciona com a tabela `operator` através do campo `operator_code_id`
- **Conversas**: Os contatos podem ter conversas associadas na tabela `conversations`

## Códigos de Erro

- `400` - Dados inválidos ou ausentes
- `404` - Contato não encontrado
- `405` - Método HTTP não permitido
- `500` - Erro interno do servidor

## Headers CORS

A API inclui headers CORS para permitir requisições de diferentes origens:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Integração com Frontend

Esta API foi criada especificamente para integrar com o componente `WhatsappManager` na aba "Gerenciar Contatos", permitindo:

1. Listar todos os contatos com informações do operador
2. Editar o código doador de forma inline
3. Atualizar as informações em tempo real
4. Gerenciar contatos de forma eficiente
