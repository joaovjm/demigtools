# Configuração para Desenvolvimento Local

Este guia explica como configurar as variáveis de ambiente para desenvolvimento local.

## 1. Criar arquivo .env.local

Crie um arquivo `.env.local` na **raiz do projeto** (mesmo nível do package.json):

```bash
# Arquivo: .env.local
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
WHATSAPP_PAGE_ID=seu_page_id_aqui
WEBHOOK_VERIFY_TOKEN=seu_webhook_verify_token_aqui
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

## 2. Obter Credenciais do WhatsApp

### 2.1 Phone Number ID
1. Acesse [Facebook Developer Console](https://developers.facebook.com/)
2. Vá para seu App → WhatsApp → API Setup
3. Copie o "Phone number ID"

### 2.2 Access Token
1. No mesmo local, clique em "Generate Token"
2. Copie o token gerado
3. **IMPORTANTE**: Use um token permanente se possível

### 2.3 Page ID (Opcional mas recomendado)
1. Acesse [Facebook Developer Console](https://developers.facebook.com/)
2. Vá para seu App → WhatsApp → API Setup
3. Copie o "Page ID" (diferente do Phone Number ID)
4. **Nota**: Se não configurar, o sistema tentará obter automaticamente

### 2.4 Webhook Verify Token
1. Crie um token seguro (ex: `meu_token_secreto_123`)
2. Use o mesmo token no Facebook Developer Console

## 3. Configurar Webhook Local

### 3.1 Usar ngrok (Recomendado)

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3000

# Copiar a URL gerada (ex: https://abc123.ngrok.io)
```

### 3.2 Configurar no Facebook
1. Vá para WhatsApp → Configuration
2. **Callback URL**: `https://sua-url-ngrok.ngrok.io/api/webhook/whatsapp`
3. **Verify Token**: O mesmo valor de `WEBHOOK_VERIFY_TOKEN`
4. **Webhook Fields**: `messages`, `message_deliveries`, `message_reads`

## 4. Testar Configuração

### 4.1 Iniciar servidor local
```bash
npm run dev
```

### 4.2 Testar APIs
- **Configuração**: `http://localhost:3000/api/whatsapp-config`
- **Conexão**: `http://localhost:3000/api/test-whatsapp-connection`
- **Webhook**: `http://localhost:3000/api/test-webhook`

### 4.3 Verificar no console
Abra o DevTools e verifique se não há erros de configuração.

## 5. Estrutura de Arquivos

```
demigtools/
├── .env.local          # ← Criar este arquivo
├── .env.local.example  # ← Arquivo de exemplo
├── api/
│   ├── whatsapp-config.js
│   ├── test-whatsapp-connection.js
│   └── send-whatsapp-message.js
└── src/
    └── services/
        └── whatsappWebhookService.jsx
```

## 6. Troubleshooting

### Problema: "Variáveis de ambiente não configuradas"
**Solução:**
1. Verifique se o arquivo `.env.local` existe na raiz
2. Verifique se as variáveis estão escritas corretamente
3. Reinicie o servidor (`npm run dev`)

### Problema: "Token expirado"
**Solução:**
1. Gere um novo token no Facebook Developer Console
2. Atualize `WHATSAPP_ACCESS_TOKEN` no `.env.local`
3. Reinicie o servidor

### Problema: "Webhook não funciona"
**Solução:**
1. Use ngrok para expor a porta local
2. Configure a URL do ngrok no Facebook
3. Teste a verificação do webhook

## 7. Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Verificar variáveis carregadas
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.WHATSAPP_PHONE_NUMBER_ID)"

# Testar API diretamente
curl http://localhost:3000/api/whatsapp-config
```

## 8. Próximos Passos

1. ✅ Criar arquivo `.env.local`
2. ✅ Configurar credenciais do WhatsApp
3. ✅ Usar ngrok para webhook local
4. ✅ Testar APIs
5. ✅ Verificar funcionamento no frontend

Depois que estiver funcionando localmente, você pode fazer o deploy para o Vercel! 🚀
