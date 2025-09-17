# Configuração de Variáveis de Ambiente no Vercel

Este documento explica como configurar corretamente as variáveis de ambiente no Vercel para o projeto demigtools.

## Problema Identificado

O projeto estava tentando usar variáveis de ambiente do backend diretamente no frontend, o que não é seguro e não funciona corretamente no Vercel.

## Solução Implementada

### 1. Abordagem Segura

- **Frontend**: Não acessa variáveis de ambiente diretamente
- **Backend**: Mantém todas as variáveis sensíveis nas API routes
- **Comunicação**: Frontend se comunica com o backend via APIs

### 2. APIs Criadas

- `/api/whatsapp-config` - Retorna configurações necessárias (sem expor tokens)
- `/api/send-whatsapp-message` - Envia mensagens usando variáveis do backend
- `/api/send-email` - Envia emails usando variáveis do backend

### 3. Configuração no Vercel

#### 3.1 Via Dashboard do Vercel

1. Acesse o dashboard do Vercel
2. Selecione seu projeto
3. Vá para Settings > Environment Variables
4. Adicione **APENAS** as variáveis do backend:

```
WHATSAPP_API_URL = https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID = seu_phone_number_id
WHATSAPP_ACCESS_TOKEN = seu_access_token
WEBHOOK_VERIFY_TOKEN = seu_webhook_verify_token
EMAIL_USER = seu_email@gmail.com
EMAIL_PASS = sua_senha_de_app
```

#### 2.2 Via CLI do Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Configurar variáveis de ambiente
vercel env add VITE_WHATSAPP_API_URL
vercel env add VITE_WHATSAPP_PHONE_NUMBER_ID
vercel env add VITE_WHATSAPP_ACCESS_TOKEN
vercel env add VITE_WEBHOOK_VERIFY_TOKEN
vercel env add VITE_BACKEND_URL
vercel env add VITE_ENVIRONMENT
vercel env add WHATSAPP_API_URL
vercel env add WHATSAPP_PHONE_NUMBER_ID
vercel env add WHATSAPP_ACCESS_TOKEN
vercel env add WEBHOOK_VERIFY_TOKEN
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
```

### 3. Configuração Local

Crie um arquivo `.env` na raiz do projeto:

```env
# Frontend (Vite)
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
VITE_WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
VITE_WHATSAPP_ACCESS_TOKEN=seu_access_token
VITE_WEBHOOK_VERIFY_TOKEN=seu_webhook_verify_token
VITE_BACKEND_URL=http://localhost:3001
VITE_ENVIRONMENT=development

# Backend
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WEBHOOK_VERIFY_TOKEN=seu_webhook_verify_token
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

## Verificação

### 1. Verificar se as variáveis estão sendo carregadas

Adicione este código temporariamente em um componente para verificar:

```javascript
console.log('Variáveis de ambiente:', {
  WHATSAPP_API_URL: import.meta.env.VITE_WHATSAPP_API_URL,
  PHONE_NUMBER_ID: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID,
  ACCESS_TOKEN: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN ? 'Definido' : 'Não definido'
});
```

### 2. Verificar no Console do Navegador

Abra o DevTools e verifique se as variáveis aparecem corretamente.

## Troubleshooting

### Problema: Variáveis não aparecem no frontend

**Solução:**
1. Verifique se as variáveis começam com `VITE_`
2. Verifique se estão configuradas no Vercel
3. Faça um novo deploy após adicionar as variáveis
4. Verifique se não há erros de sintaxe no código

### Problema: Variáveis não aparecem no backend

**Solução:**
1. Verifique se as variáveis estão configuradas no Vercel
2. Verifique se o arquivo `api/` está sendo servido corretamente
3. Verifique se não há erros de sintaxe no código

### Problema: Deploy falha

**Solução:**
1. Verifique se todas as variáveis obrigatórias estão configuradas
2. Verifique se não há caracteres especiais nas variáveis
3. Verifique os logs de build no Vercel

## Arquivos Modificados

1. `src/services/whatsappWebhookService.jsx` - Atualizado para usar `import.meta.env`
2. `vite.config.js` - Configurado para carregar variáveis de ambiente
3. `vercel.json` - Adicionado mapeamento de variáveis de ambiente

## Próximos Passos

1. Configure as variáveis de ambiente no Vercel
2. Faça um novo deploy
3. Teste a funcionalidade
4. Remova os logs de debug após confirmar que está funcionando
