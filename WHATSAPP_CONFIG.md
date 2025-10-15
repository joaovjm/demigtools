# Configuração do WhatsApp para Envio de Campanhas

## Variáveis de Ambiente Necessárias

Para que o envio de campanhas funcione diretamente via Supabase, você precisará configurar as seguintes variáveis de ambiente:

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# ID do número de telefone do WhatsApp Business
VITE_WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui

# Token de acesso da API do WhatsApp Business  
VITE_WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
```

## Como obter essas informações:

1. **VITE_WHATSAPP_PHONE_NUMBER_ID**: 
   - Acesse o Facebook Business Manager
   - Vá para WhatsApp Business API > Números de telefone
   - Copie o ID do seu número de telefone

2. **VITE_WHATSAPP_ACCESS_TOKEN**:
   - Acesse o Facebook Business Manager  
   - Vá para Aplicativos > Seu App > WhatsApp Business API
   - Copie o token de acesso permanente

## ⚠️ Importante:

- **Nunca** commite o arquivo `.env` com os valores reais
- Estes tokens são sensíveis e devem ser tratados com segurança
- Certifique-se de que o arquivo `.env` esteja no `.gitignore`

## Funcionalidades implementadas:

### Chat/Campanhas:
✅ **loadCampaigns()** - Busca de campanhas diretamente no Supabase (sem API intermediária)
✅ **handleSendCampaign()** - Envio de campanhas via chamadas diretas ao Supabase
✅ Envio de templates via API do Facebook Graph
✅ Salvamento de mensagens no banco de dados
✅ Logs detalhados de campanhas na tabela `campaign_logs`
✅ Tratamento de erros e rate limits do WhatsApp
✅ Suporte a variáveis dinâmicas nos templates
✅ Delays progressivos entre envios de templates

### Resolução de Problemas:
✅ Corrigido erro "SyntaxError: Unexpected token '<'" - eliminado endpoint inexistente `/api/campaigns`
✅ Todas as operações agora são feitas diretamente com o Supabase
