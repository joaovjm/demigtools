# Guia de Migração - Campanhas para Supabase

Este guia mostra como migrar do sistema de campanhas baseado em servidor serverless para o novo sistema usando Supabase diretamente.

## Arquivos Criados

### Novos Arquivos
- `src/services/campaignsService.js` - Serviço principal de campanhas
- `src/hooks/useCampaigns.jsx` - Hook React para gerenciar campanhas
- `src/components/CampaignsManager.jsx` - Componente de exemplo
- `src/components/AdminManager/CampainMigrated.jsx` - Exemplo de migração

### Arquivos que Podem ser Removidos
- `api/campaigns.js` - Servidor serverless (não é mais necessário)

## Passos da Migração

### 1. Substituir Imports

**Antes:**
```javascript
import { getCampains } from "../../helper/getCampains";
import { updateCampains } from "../../helper/updateCampains";
import { deleteCampain } from "../../helper/deleteCampain";
import { insertNewCampain } from "../../helper/insertNewCampain";
```

**Depois:**
```javascript
import { useCampaigns } from "../../hooks/useCampaigns.jsx";
// ou
import campaignsService from "../../services/campaignsService.js";
```

### 2. Substituir Estados e Funções

**Antes:**
```javascript
const [campains, setCampains] = useState([]);
const [reload, setReload] = useState(false);

useEffect(() => {
  const campain = async () => {
    const response = await getCampains();
    setCampains(response);
  };
  campain();
}, [inEdit, reload]);

const handleNewCampain = async () => {
  await insertNewCampain(newCampain);
  setReload((prev) => !prev);
  setNewCampain("");
};
```

**Depois:**
```javascript
const {
  campaigns,
  loading,
  error,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = useCampaigns();

const handleNewCampaign = async () => {
  const result = await createCampaign({
    name: newCampaignName,
    description: newCampaignDescription,
    selectedTemplates: [],
    variables: []
  });
  
  if (result.success) {
    toast.success("Campanha criada com sucesso!");
  }
};
```

### 3. Substituir Operações CRUD

#### Criar Campanha

**Antes:**
```javascript
const handleNewCampain = async () => {
  await insertNewCampain(newCampain);
  setReload((prev) => !prev);
  setNewCampain("");
};
```

**Depois:**
```javascript
const handleNewCampaign = async () => {
  const result = await createCampaign({
    name: newCampaignName,
    description: newCampaignDescription,
    selectedTemplates: [],
    variables: []
  });
  
  if (result.success) {
    toast.success("Campanha criada com sucesso!");
    setNewCampaignName("");
    setNewCampaignDescription("");
  } else {
    toast.error(`Erro: ${result.error}`);
  }
};
```

#### Atualizar Campanha

**Antes:**
```javascript
const handleEdit = async (id) => {
  if (inEdit) {
    const updateCampain = campains.find((c) => c.id === id);
    await updateCampains(updateCampain);
    setInEdit();
  } else {
    setInEdit(id);
  }
};
```

**Depois:**
```javascript
const handleSaveEdit = async () => {
  const result = await updateCampaign(editingId, {
    name: editingName,
    description: editingDescription
  });
  
  if (result.success) {
    toast.success("Campanha atualizada com sucesso!");
    setEditingId(null);
  } else {
    toast.error(`Erro: ${result.error}`);
  }
};
```

#### Deletar Campanha

**Antes:**
```javascript
const handleDelete = async (id) => {
  if (window.confirm("Deseja mesmo deletar esta campanha?")) {
    await deleteCampain(id);
    setReload((prev) => !prev);
  }
};
```

**Depois:**
```javascript
const handleDelete = async (id) => {
  if (window.confirm("Deseja mesmo deletar esta campanha?")) {
    const result = await deleteCampaign(id);
    
    if (result.success) {
      toast.success("Campanha deletada com sucesso!");
    } else {
      toast.error(`Erro: ${result.error}`);
    }
  }
};
```

### 4. Atualizar Renderização

**Antes:**
```javascript
{campains?.map((cp) => (
  <option value={cp.id}>{cp.campain_name}</option>
))}
```

**Depois:**
```javascript
{campaigns?.map((campaign) => (
  <option key={campaign.id} value={campaign.id}>
    {campaign.name}
  </option>
))}
```

## Vantagens da Migração

### 1. **Menos Código**
- Não precisa gerenciar estados de loading manualmente
- Não precisa fazer reload manual das listas
- Tratamento de erro centralizado

### 2. **Melhor Performance**
- Conexão direta com Supabase
- Menos requisições HTTP
- Atualizações em tempo real

### 3. **Mais Simples**
- Uma única importação para todas as operações
- Estados gerenciados automaticamente
- Menos boilerplate

### 4. **Mais Robusto**
- Tratamento de erro consistente
- Validação de dados
- Logs detalhados

## Exemplo Completo de Migração

Veja o arquivo `src/components/AdminManager/CampainMigrated.jsx` para um exemplo completo de como migrar um componente existente.

## Checklist de Migração

- [ ] Substituir imports antigos pelos novos
- [ ] Remover estados manuais (campaigns, loading, error)
- [ ] Usar o hook `useCampaigns`
- [ ] Atualizar funções CRUD
- [ ] Atualizar renderização (campain_name → name)
- [ ] Testar todas as funcionalidades
- [ ] Remover arquivos antigos (opcional)

## Suporte

Se encontrar problemas durante a migração:

1. Verifique se o Supabase está configurado corretamente
2. Confirme se a tabela `whatsapp_campaigns` existe
3. Verifique os logs do console para erros
4. Use o componente `CampaignsManager.jsx` como referência

## Próximos Passos

Após migrar as campanhas, considere:

1. Migrar outros helpers para serviços similares
2. Implementar cache local se necessário
3. Adicionar testes para os novos serviços
4. Documentar outras APIs que podem ser migradas
